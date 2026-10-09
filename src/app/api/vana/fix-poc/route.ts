import { NextResponse } from 'next/server';
import sql, { initDb } from '@/lib/db';
import { submitProviderPoC } from '@/lib/oracle';

export async function GET(req: Request) {
  try {
    if (!sql) return NextResponse.json({ error: 'No DB' });
    await initDb();
    
    // Get all unique wallets that have connections
    const wallets = await sql`SELECT DISTINCT wallet_address FROM user_connections`;
    
    let processed = 0;
    for (const row of wallets) {
      // Get the highest quality score for this wallet
      const scores = await sql`SELECT quality_score FROM user_connections WHERE wallet_address = ${row.wallet_address}`;
      let maxScore = 10;
      for (const s of scores) {
        if (s.quality_score > maxScore) maxScore = s.quality_score;
      }
      
      // Fire PoC for this wallet
      await submitProviderPoC(row.wallet_address, maxScore);
      processed++;
    }
    
    return NextResponse.json({ success: true, processed });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
