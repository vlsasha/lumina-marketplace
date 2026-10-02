export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import sql, { initDb } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sourcesParam = searchParams.get('sources');
    const tierParam = searchParams.get('tier');
    
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
    
    if (providers.length === 0) {
      providers.push('0xC1d3007A33d86Fd7390B087304AD3083FC87438C');
      if (count === 0) count = 0; // If filter misses, actually show 0 to the user!
    }

    return NextResponse.json({
      providers,
      count
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
