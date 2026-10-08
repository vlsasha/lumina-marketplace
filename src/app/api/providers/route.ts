export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import sql, { initDb } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sourcesParam = searchParams.get('sources');
    const tierParam = searchParams.get('tier');
    const buyerId = searchParams.get('buyerId');
    
    if (!sql) {
       return NextResponse.json({ providers: ['0xC1d3007A33d86Fd7390B087304AD3083FC87438C'], count: 1 });
    }

    await initDb();
    
    let providers: string[] = [];
    let count = 0;

        let sqlFilter = sql``;
    if (tierParam && tierParam !== 'Any') {
      if (tierParam === 'A') sqlFilter = sql` AND quality_score >= 80`;
      else if (tierParam === 'B') sqlFilter = sql` AND quality_score >= 50 AND quality_score < 80`;
      else if (tierParam === 'C') sqlFilter = sql` AND quality_score >= 20 AND quality_score < 50`;
      else if (tierParam === 'D') sqlFilter = sql` AND quality_score < 20`;
    }

    if (sourcesParam) {
      const sources = sourcesParam.split(',').filter(Boolean);
      if (sources.length > 0) {
        const result = await sql`
          SELECT wallet_address 
          FROM user_connections 
          WHERE status IN ('approved', 'completed') 
            AND source_id = ANY(${sources})
            ${sqlFilter}
          GROUP BY wallet_address
          HAVING COUNT(DISTINCT source_id) = ${sources.length}
        `;
        providers = result.map(row => row.wallet_address);
        count = providers.length;
      }
    } else {
      const allConnectionsResult = await sql`
        SELECT wallet_address 
        FROM user_connections 
        WHERE status IN ('approved', 'completed')
        ${sqlFilter}
      `;
      providers = allConnectionsResult.map(row => row.wallet_address);
      count = providers.length;
    }
    
    
    // Filter out already purchased wallets
    if (buyerId && sourcesParam) {
      const sources = sourcesParam.split(',').filter(Boolean);
      // Determine what dataset ID to look up (approximate, since we only know the source name and tier)
      // Actually, we can just look up ALL purchases for this buyer where the dataset name includes the source name.
      // But more simply, we can just check all provider_wallets they ever bought for ANY dataset.
      
      // We only want to filter out wallets that the user has already bought FOR THIS SPECIFIC source/dataset!
      // The dataset_id in the DB looks like "ChatGPT (Tier D)" or "Instagram (Tier A)".
      // We can use ILIKE to match the source name.
      const sourceQuery = `%${sources[0]}%`;
      const purchases = await sql`SELECT provider_wallets FROM purchases WHERE buyer_id = ${buyerId} AND dataset_id ILIKE ${sourceQuery}`;

      const purchasedWallets = new Set();
      purchases.forEach(p => {
        if (p.provider_wallets && Array.isArray(p.provider_wallets)) {
          p.provider_wallets.forEach(w => purchasedWallets.add(w));
        }
      });
      providers = providers.filter(w => !purchasedWallets.has(w));
      count = providers.length;
    }
    
    // Prevent fallback to treasury wallet if there are genuinely 0 remaining
    if (providers.length === 0 && count === 0) {
      // Do nothing, let it be 0!
    } else if (providers.length === 0) {
      providers.push('0xC1d3007A33d86Fd7390B087304AD3083FC87438C');
    }

    
    return NextResponse.json({
      providers,
      count,
      debug: {
        sourcesParam,
        buyerId,
        tierParam,
        // removed due to scope
        // removed due to scope
      }
    });

  } catch (error) {
    console.error('Failed to fetch providers', error);
    return NextResponse.json({ providers: ['0xC1d3007A33d86Fd7390B087304AD3083FC87438C'], count: 1 });
  }
}

export async function POST(req: Request) {
  try {
    if (!sql) return NextResponse.json({ success: true });
    
    const { wallet_address } = await req.json();
    if (!wallet_address) return NextResponse.json({ error: 'Missing wallet' }, { status: 400 });

    await initDb();
    
    await sql`
      INSERT INTO vana_users (wallet_address) 
      VALUES (${wallet_address}) 
      ON CONFLICT (wallet_address) DO NOTHING
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to add provider', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
