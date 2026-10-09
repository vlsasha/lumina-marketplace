import { NextResponse } from 'next/server';
import sql, { initDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    if (!sql) return NextResponse.json({ error: 'No DB' });
    await initDb();
    
    const connections = await sql`SELECT wallet_address, source_id, provider_account_id, quality_score FROM user_connections`;
    return NextResponse.json({ connections });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
