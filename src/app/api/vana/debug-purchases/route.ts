import { NextResponse } from 'next/server';
import sql, { initDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    if (!sql) return NextResponse.json({ error: 'No DB' });
    await initDb();
    
    const buyerId = '0x8E3f4BFB720582bF7223FDB6A1a678957b38835A';
    const datasetId = 'Instagram (Tier D)';
    const txHash = '0x134e4abdad219371303bbe0125d7995110a2cd16b3b9ecfd338d40841a3859f6';
    const format = 'JSONL, CSV';
    const sizeBytes = 10240;
    const providerWalletsStr = JSON.stringify(['0x8E3f4BFB720582bF7223FDB6A1a678957b38835A', '0xC1d3007A33d86Fd7390B087304AD3083FC87438C']);
    
    const existing = await sql`SELECT id FROM purchases WHERE transaction_hash = ${txHash}`;
    if (existing.length === 0) {
      await sql`
        INSERT INTO purchases (buyer_id, dataset_id, transaction_hash, format, size_bytes, provider_wallets)
        VALUES (${buyerId}, ${datasetId}, ${txHash}, ${format}, ${sizeBytes}, ${providerWalletsStr}::jsonb)
      `;
      return NextResponse.json({ success: true, message: 'Inserted' });
    }
    return NextResponse.json({ success: true, message: 'Already exists' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed', details: String(error) }, { status: 500 });
  }
}
