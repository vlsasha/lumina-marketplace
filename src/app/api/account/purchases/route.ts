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
      WHERE buyer_id = ${userId} AND status = 'completed'
      ORDER BY purchased_at DESC
    `;
    
    return NextResponse.json({ purchases });
  } catch (error) {
    console.error('Failed to get purchases:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: (error as any).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!sql) return NextResponse.json({ error: 'Database not connected' }, { status: 500 });
    await initDb();
    
    const body = await req.json();
    const { buyerId, datasetId, transactionHash, sizeBytes, providerWallets, status = 'completed' } = body;
    
    if (!buyerId || !datasetId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const format = 'JSONL, CSV'; // Default formats available
    
    // Duplicates logic removed: we allow delta purchasing!
    

    const existing = await sql`SELECT id FROM purchases WHERE transaction_hash = ${transactionHash}`;
    let result;
    if (existing.length > 0) {
      result = await sql`
        UPDATE purchases SET status = ${status} WHERE transaction_hash = ${transactionHash} RETURNING *
      `;
    } else {
      result = await sql`
        INSERT INTO purchases (buyer_id, dataset_id, transaction_hash, format, size_bytes, provider_wallets, status)
        VALUES (${buyerId}, ${datasetId}, ${transactionHash}, ${format}, ${sizeBytes}, ${providerWallets ? JSON.stringify(providerWallets) : '[]'}, ${status})
        RETURNING *
      `;
    }

    
    return NextResponse.json({ success: true, purchase: result[0] });
  } catch (error) {
    console.error('Failed to create purchase:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
