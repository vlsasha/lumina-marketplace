/**
 * API Route: Read approved data for a source connection.
 * GET /api/vana/data?source=xxx&connectionId=xxx&scope=xxx (scope is optional)
 */

import { readConnectionData } from '@/lib/vana';
import { NextRequest, NextResponse } from 'next/server';
import sql, { initDb } from '@/lib/db';

// In-memory cache to prevent re-reading (and re-paying) for the same connectionId
const dataCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source');
    const connectionId = searchParams.get('connectionId') || searchParams.get('requestId');
    const scope = searchParams.get('scope') || undefined;

    if (!source || !connectionId) {
      return NextResponse.json(
        { error: 'Missing required params: source, connectionId' },
        { status: 400 }
      );
    }

    // Check DB first for permanent storage
    if (sql) {
      await initDb();
      try {
        const dbResult = await sql`SELECT data FROM downloaded_data WHERE connection_id = ${connectionId}`;
        if (dbResult && dbResult.length > 0) {
          return NextResponse.json({ ...dbResult[0].data, cached: 'db' });
        }
      } catch (err) {
        console.error('DB read error', err);
      }
    }

    // Check memory cache
    const cacheKey = `${source}:${connectionId}:${scope || 'all'}`;
    const cached = dataCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({ ...(cached.data as Record<string, unknown>), cached: 'memory' });
    }

    const result = await readConnectionData(source, connectionId, scope);

    // If successful and has no error property, save to DB
    if (sql && result && !(result as any).error) {
      try {
        await sql`
          INSERT INTO downloaded_data (connection_id, data) 
          VALUES (${connectionId}, ${JSON.stringify(result)}) 
          ON CONFLICT (connection_id) DO UPDATE SET data = ${JSON.stringify(result)}
        `;
      } catch (err) {
        console.error('DB write error', err);
      }
    }

    // Cache the result in memory as well
    dataCache.set(cacheKey, { data: result, timestamp: Date.now() });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error reading connection data:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to read connection data',
      },
      { status: 500 }
    );
  }
}
