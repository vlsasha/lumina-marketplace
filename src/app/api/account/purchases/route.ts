import { NextResponse } from 'next/server';
import sql, { initDb } from '@/lib/db';

export async function GET(req: Request) {
  try {
    if (!sql) return NextResponse.json({ error: 'Database not connected' }, { status: 500 });
    await initDb();
    
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    const purchases = await sql`
      SELECT id, dataset_id, transaction_hash, format, size_bytes, purchased_at
      FROM purchases
      WHERE buyer_id = ${userId}
      ORDER BY purchased_at DESC
    `;
    
    return NextResponse.json({ purchases });
  } catch (error) {
    console.error('Failed to get purchases:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
