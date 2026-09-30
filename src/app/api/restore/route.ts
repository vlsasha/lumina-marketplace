import { NextResponse } from 'next/server';
import sql, { initDb } from '@/lib/db';

export async function GET() {
  if (!sql) return NextResponse.json({ error: 'No DB' });
  
  try {
    await initDb();
    
    // We know the wallet and connection_id from the screenshots
    const wallet = '0xC1d3007A33d86Fd7390B087304AD3083FC87438C';
    const sourceId = 'youtube';
    const connectionId = 'dcr_240fc368f424458e844a59fa0b49bd65';
    
    // Some mock scopes for youtube since we don't know exactly what they approved, but they approved all 6
    const scopesStr = JSON.stringify(['youtube.history', 'youtube.likes', 'youtube.playlists', 'youtube.profile', 'youtube.subscriptions', 'youtube.watchLater']);

    await sql`
      INSERT INTO user_connections (wallet_address, source_id, connection_id, status, scopes_approved) 
      VALUES (${wallet}, ${sourceId}, ${connectionId}, 'completed', ${scopesStr}) 
      ON CONFLICT (wallet_address, source_id) 
      DO UPDATE SET 
        connection_id = ${connectionId}, 
        status = 'completed', 
        scopes_approved = ${scopesStr}
    `;

    return NextResponse.json({ success: true, message: 'Restored YouTube connection to your wallet!' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
