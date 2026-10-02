export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import sql, { initDb } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sourcesParam = searchParams.get('sources');
    
    if (!sql) {
       return NextResponse.json({ providers: ['0xC1d3007A33d86Fd7390B087304AD3083FC87438C'], count: 1 });
    }

    await initDb();
    
    let providers: string[] = [];
    let count = 0;

    if (sourcesParam) {
      // Find users who have ALL the requested sources
      const sources = sourcesParam.split(',').filter(Boolean);
      if (sources.length > 0) {
        const result = await sql`
          SELECT wallet_address 
          FROM user_connections 
          WHERE status IN ('approved', 'completed') 
            AND source_id = ANY(${sources})
          GROUP BY wallet_address
          HAVING COUNT(DISTINCT source_id) = ${sources.length}
        `;
        providers = result.map(row => row.wallet_address);
        count = providers.length;
      }
    } else {
      // If no specific sources are selected, count TOTAL connected datasets across the platform
      // to make the marketplace look more populated (as requested by the user).
      const allConnectionsResult = await sql`
        SELECT wallet_address 
        FROM user_connections 
        WHERE status IN ('approved', 'completed')
      `;
      providers = allConnectionsResult.map(row => row.wallet_address);
      count = providers.length; // Will be 7 if 1 user connected 7 accounts
    }
    
    // Always include the Treasury wallet as a fallback so the marketplace doesn't break if DB is empty
    if (providers.length === 0) {
      providers.push('0xC1d3007A33d86Fd7390B087304AD3083FC87438C');
      if (count === 0) count = 1;
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
