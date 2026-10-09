import { NextResponse } from 'next/server';
import sql, { initDb } from '@/lib/db';

export async function GET(req: Request) {
  try {
    if (!sql) return NextResponse.json({ error: 'No DB' });
    await initDb();
    
    // Just wipe all purchases so the user can test again freshly!
    await sql`DELETE FROM purchases`;
    
    return NextResponse.json({ success: true, message: 'All purchases reset for testing!' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
