/**
 * API Route: Read approved data for a source connection.
 * GET /api/vana/data?source=xxx&connectionId=xxx&scope=xxx (scope is optional)
 */

import { readConnectionData } from '@/lib/vana';
import { NextRequest, NextResponse } from 'next/server';

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

    // Check cache first (each read is a paid call)
    const cacheKey = `${source}:${connectionId}:${scope || 'all'}`;
    const cached = dataCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({ ...(cached.data as Record<string, unknown>), cached: true });
    }

    const result = await readConnectionData(source, connectionId, scope);

    // Cache the result
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
