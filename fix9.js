const fs = require('fs');
let c = fs.readFileSync('src/app/api/vana/data/route.ts', 'utf8');

const target = `import { readConnectionData } from '@/lib/vana';
import { NextRequest, NextResponse } from 'next/server';

// In-memory cache to prevent re-reading (and re-paying) for the same connectionId
const dataCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes`;

const replacement = `import { readConnectionData } from '@/lib/vana';
import { NextRequest, NextResponse } from 'next/server';
import sql, { initDb } from '@/lib/db';

// In-memory cache to prevent re-reading (and re-paying) for the same connectionId
const dataCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes`;

c = c.replace(target, replacement);

const target2 = `    // Check cache first (each read is a paid call)
    const cacheKey = \`\${source}:\${connectionId}:\${scope || 'all'}\`;
    const cached = dataCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({ ...(cached.data as Record<string, unknown>), cached: true });
    }

    const result = await readConnectionData(source, connectionId, scope);

    // Cache the result
    dataCache.set(cacheKey, { data: result, timestamp: Date.now() });

    return NextResponse.json(result);`;

const replacement2 = `    // Check DB first for permanent storage
    if (sql) {
      await initDb();
      try {
        const dbResult = await sql\`SELECT data FROM downloaded_data WHERE connection_id = \${connectionId}\`;
        if (dbResult && dbResult.length > 0) {
          return NextResponse.json({ ...dbResult[0].data, cached: 'db' });
        }
      } catch (err) {
        console.error('DB read error', err);
      }
    }

    // Check memory cache
    const cacheKey = \`\${source}:\${connectionId}:\${scope || 'all'}\`;
    const cached = dataCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({ ...(cached.data as Record<string, unknown>), cached: 'memory' });
    }

    const result = await readConnectionData(source, connectionId, scope);

    // If successful and has no error property, save to DB
    if (sql && result && !(result as any).error) {
      try {
        await sql\`
          INSERT INTO downloaded_data (connection_id, data) 
          VALUES (\${connectionId}, \${result as any}) 
          ON CONFLICT (connection_id) DO UPDATE SET data = \${result as any}
        \`;
      } catch (err) {
        console.error('DB write error', err);
      }
    }

    // Cache the result in memory as well
    dataCache.set(cacheKey, { data: result, timestamp: Date.now() });

    return NextResponse.json(result);`;

c = c.replace(target2, replacement2);
fs.writeFileSync('src/app/api/vana/data/route.ts', c);
