import { NextResponse } from 'next/server';
import sql, { initDb } from '@/lib/db';
import crypto from 'crypto';

export async function GET(req: Request) {
  try {
    if (!sql) return NextResponse.json({ error: 'Database not connected' }, { status: 500 });
    await initDb();
    
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    const keys = await sql`SELECT raw_key, prefix, created_at FROM api_keys WHERE user_id = ${userId}`;
    
    if (keys.length === 0) {
      return NextResponse.json({ key: null });
    }
    
    return NextResponse.json({ key: keys[0].raw_key || `${keys[0].prefix}...` });
  } catch (error) {
    console.error('Failed to get API key:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: (error as any).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!sql) return NextResponse.json({ error: 'Database not connected' }, { status: 500 });
    await initDb();
    
    const { userId } = await req.json();
    if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    const rawKey = crypto.randomBytes(32).toString('hex');
    const apiKey = `db_live_${rawKey}`;
    
    const prefix = apiKey.substring(0, 15);
    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');

    // Upsert key for user
    await sql`
      INSERT INTO api_keys (user_id, key_hash, prefix, raw_key)
      VALUES (${userId}, ${keyHash}, ${prefix}, ${apiKey})
      ON CONFLICT (user_id) DO UPDATE SET
        key_hash = EXCLUDED.key_hash,
        prefix = EXCLUDED.prefix,
        raw_key = EXCLUDED.raw_key,
        created_at = CURRENT_TIMESTAMP
    `;

    // Only return the raw key ONCE upon creation
    return NextResponse.json({ apiKey });
  } catch (error) {
    console.error('Failed to generate API key:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
