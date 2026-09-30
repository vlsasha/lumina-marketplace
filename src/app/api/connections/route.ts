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
      scopesApproved: row.scopes_approved ? JSON.parse(row.scopes_approved) : []
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

    await sql`
      INSERT INTO user_connections (wallet_address, source_id, connection_id, status, scopes_approved) 
      VALUES (${wallet}, ${connection.sourceId}, ${connection.connectionId}, ${connection.status}, ${scopesStr}) 
      ON CONFLICT (wallet_address, source_id) 
      DO UPDATE SET 
        connection_id = ${connection.connectionId}, 
        status = ${connection.status}, 
        scopes_approved = ${scopesStr}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save connection', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
