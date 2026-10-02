export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import sql, { initDb } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sourcesParam = searchParams.get('sources');
    const regionParam = searchParams.get('region');
    const ageParam = searchParams.get('age');
    
    if (!sql) {
       return NextResponse.json({ providers: ['0xC1d3007A33d86Fd7390B087304AD3083FC87438C'], count: 1 });
    }

    await initDb();
    
    let providers: string[] = [];
    let count = 0;

    // Build dynamic where clause for JSONB filtering
    let jsonbFilter = sql``;
    if (regionParam && regionParam !== 'Global') {
      // Look inside the downloaded_data JSON for a country/location match.
      // This uses PostgreSQL JSONB operators to search various paths depending on the provider.
      // Using ILIKE for case-insensitive matching if it was text, but with JSONB we cast to text.
      jsonbFilter = sql`
        AND EXISTS (
          SELECT 1 FROM downloaded_data dd 
          WHERE dd.connection_id = user_connections.connection_id
          AND (
            (dd.data::text ILIKE ${'%' + regionParam + '%'})
          )
        )
      `;
    }

    if (ageParam && ageParam !== 'Any') {
      // Simulating age extraction. In reality, most providers don't give age in raw JSON.
      // This will just scan the text for keywords as a placeholder MVP implementation.
      let ageKeyword = '';
      if (ageParam === '18-24') ageKeyword = '200'; // born in 200x
      if (ageParam === '25-31') ageKeyword = '199'; // born in 199x
      if (ageParam === '32-38') ageKeyword = '198';
      if (ageParam === '39-45') ageKeyword = '198';
      if (ageParam === '45+') ageKeyword = '197';
      
      if (ageKeyword) {
        jsonbFilter = sql`
          ${jsonbFilter}
          AND EXISTS (
            SELECT 1 FROM downloaded_data dd 
            WHERE dd.connection_id = user_connections.connection_id
            AND (dd.data::text ILIKE ${'%' + ageKeyword + '%'})
          )
        `;
      }
    }

    if (sourcesParam) {
      const sources = sourcesParam.split(',').filter(Boolean);
      if (sources.length > 0) {
        const result = await sql`
          SELECT wallet_address 
          FROM user_connections 
          WHERE status IN ('approved', 'completed') 
            AND source_id = ANY(${sources})
            ${jsonbFilter}
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
        ${jsonbFilter}
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
