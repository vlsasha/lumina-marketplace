import { NextResponse } from 'next/server';
import sql, { initDb } from '@/lib/db';
import { createPublicClient, http } from 'viem';
import { vana } from 'viem/chains';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    if (!sql) return NextResponse.json({ error: 'No DB' });
    await initDb();
    
    // Auto-create status column if it doesn't exist
    await sql`ALTER TABLE purchases ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'completed'`;
    
    const pendingPurchases = await sql`SELECT id, transaction_hash FROM purchases WHERE status = 'pending'`;
    if (pendingPurchases.length === 0) {
      return NextResponse.json({ success: true, message: 'No pending purchases' });
    }

    const publicClient = createPublicClient({ chain: vana, transport: http() });
    
    let verified = 0;
    let failed = 0;

    for (const p of pendingPurchases) {
      try {
        const receipt = await publicClient.getTransactionReceipt({ hash: p.transaction_hash as `0x${string}` });
        if (receipt && receipt.status === 'success') {
          await sql`UPDATE purchases SET status = 'completed' WHERE id = ${p.id}`;
          verified++;
        } else if (receipt && receipt.status === 'reverted') {
          await sql`UPDATE purchases SET status = 'failed' WHERE id = ${p.id}`;
          failed++;
        }
      } catch (e) {
        // Receipt not found yet, leave as pending
      }
    }
    
    return NextResponse.json({ success: true, verified, failed });
  } catch (error) {
    return NextResponse.json({ error: 'Failed', details: String(error) }, { status: 500 });
  }
}
