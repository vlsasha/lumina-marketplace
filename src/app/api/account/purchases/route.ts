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

export async function POST(req: Request) {
  try {
    if (!sql) return NextResponse.json({ error: 'Database not connected' }, { status: 500 });
    await initDb();
    
    const body = await req.json();
    const { buyerId, datasetId, transactionHash, sizeBytes } = body;
    
    if (!buyerId || !datasetId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const format = 'JSONL, CSV'; // Default formats available
    
    // Prevent duplicates
    const existing = await sql`SELECT id FROM purchases WHERE buyer_id = ${buyerId} AND dataset_id = ${datasetId}`;
    if (existing && existing.length > 0) {
      return NextResponse.json({ error: 'You have already purchased this dataset.' }, { status: 409 });
    }
    
    const result = await sql`
      INSERT INTO purchases (buyer_id, dataset_id, transaction_hash, format, size_bytes)
      VALUES (${buyerId}, ${datasetId}, ${transactionHash}, ${format}, ${sizeBytes})
      RETURNING *
    `;
    
    return NextResponse.json({ success: true, purchase: result[0] });
  } catch (error) {
    console.error('Failed to create purchase:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
