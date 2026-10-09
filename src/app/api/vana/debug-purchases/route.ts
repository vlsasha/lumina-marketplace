import { NextResponse } from 'next/server';
import sql, { initDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    if (!sql) return NextResponse.json({ error: 'No DB' });
    await initDb();
    
    await sql`ALTER TABLE purchases ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'completed'`;
    
    return NextResponse.json({ success: true, message: 'Altered table' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed', details: String(error) }, { status: 500 });
  }
}
