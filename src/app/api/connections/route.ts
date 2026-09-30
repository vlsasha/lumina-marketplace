export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import sql, { initDb } from '@/lib/db';

export async function GET(req: Request) {
  try {
    if (!sql) return NextResponse.json({ connections: [] });
    
    const { searchParams } = new URL(req.url);
    const wallet = searchParams.get('wallet');
    
    if (!wallet) return NextResponse.json({ connections: [] });

    await initDb();
    const result = await sql`SELECT * FROM user_connections WHERE wallet_address = ${wallet}`;
    
    const connections = result.map(row => ({
      sourceId: row.source_id,
      connectionId: row.connection_id,
      status: row.status,
      scopesApproved: row.scopes_approved ? JSON.parse(row.scopes_approved) : [],
      providerAccountId: row.provider_account_id,
      qualityScore: row.quality_score
    }));

    return NextResponse.json({ connections });
  } catch (error) {
    console.error('Failed to fetch connections', error);
    return NextResponse.json({ connections: [] });
  }
}

export async function POST(req: Request) {
  try {
    if (!sql) return NextResponse.json({ success: true });
    
    const { wallet, connection } = await req.json();
    if (!wallet || !connection) return NextResponse.json({ error: 'Missing args' }, { status: 400 });

    await initDb();
    
    const scopesStr = JSON.stringify(connection.scopesApproved || []);

    // Try to parse the unique ID and calculate quality score from the downloaded JSON
    let providerAccountId = null;
    let qualityScore = 0;
    
    try {
      const dbResult = await sql`SELECT data FROM downloaded_data WHERE connection_id = ${connection.connectionId}`;
      if (dbResult && dbResult.length > 0) {
        const json = dbResult[0].data;
        
        if (connection.sourceId === 'youtube') {
          // Extract provider ID
          const profile = json?.data?.results?.['youtube.profile']?.data?.data;
          if (profile?.channelId) {
            providerAccountId = profile.channelId;
          }
          
          // Calculate quality score
          if (profile?.joinedDate) {
            const year = parseInt(profile.joinedDate.split(', ')[1]);
            if (year && year <= 2016) qualityScore += 40;
            else if (year && year <= 2021) qualityScore += 20;
          }
          
          const history = json?.data?.results?.['youtube.history']?.data?.data?.history;
          if (history && history.length >= 20) qualityScore += 20;
          
          const subs = json?.data?.results?.['youtube.subscriptions']?.data?.data?.subscriptions;
          if (subs && subs.length >= 10) qualityScore += 40;
        } else if (connection.sourceId === 'chatgpt') {
          const convos = json?.conversations;
          if (Array.isArray(convos)) {
            // Assign unique ID based on first conversation UUID as proxy
            if (convos.length > 0 && convos[0].id) {
              providerAccountId = 'chatgpt_' + convos[0].id;
            }
            
            // Calculate quality score based on volume
            if (convos.length > 100) qualityScore += 50;
            else if (convos.length > 50) qualityScore += 30;
            else if (convos.length > 10) qualityScore += 10;
            
            // Calculate based on message density
            let totalMsgs = 0;
            convos.forEach((c: any) => { totalMsgs += (c.message_count || 0); });
            if (totalMsgs > 1000) qualityScore += 50;
            else if (totalMsgs > 300) qualityScore += 30;
            else if (totalMsgs > 50) qualityScore += 10;
          }
        }
      }
    } catch (e) {
      console.error('Error parsing JSON for quality score', e);
    }

    try {
      await sql`
        INSERT INTO user_connections (wallet_address, source_id, connection_id, status, scopes_approved, provider_account_id, quality_score) 
        VALUES (${wallet}, ${connection.sourceId}, ${connection.connectionId}, ${connection.status}, ${scopesStr}, ${providerAccountId}, ${qualityScore}) 
        ON CONFLICT (wallet_address, source_id) 
        DO UPDATE SET 
          connection_id = ${connection.connectionId}, 
          status = ${connection.status}, 
          scopes_approved = ${scopesStr},
          provider_account_id = ${providerAccountId},
          quality_score = ${qualityScore}
      `;
    } catch (e: any) {
      if (e.message && e.message.includes('unique constraint "unique_provider_account"')) {
        return NextResponse.json({ error: 'This account is already registered in the marketplace.' }, { status: 409 });
      }
      throw e;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save connection', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    if (!sql) return NextResponse.json({ success: true });
    
    const { searchParams } = new URL(req.url);
    const wallet = searchParams.get('wallet');
    const source = searchParams.get('source');
    
    if (!wallet || !source) return NextResponse.json({ error: 'Missing args' }, { status: 400 });

    await initDb();
    
    await sql`
      DELETE FROM user_connections 
      WHERE wallet_address = ${wallet} AND source_id = ${source}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save connection', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
