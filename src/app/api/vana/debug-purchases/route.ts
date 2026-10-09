import { NextResponse } from 'next/server';
import sql, { initDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    if (!sql) return NextResponse.json({ error: 'No DB' });
    await initDb();
    const purchases = await sql`SELECT * FROM purchases`;
    return NextResponse.json({ purchases });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
