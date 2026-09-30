import { NextResponse } from 'next/server';
import sql, { initDb } from '@/lib/db';

export async function GET() {
  if (!sql) return NextResponse.json({ error: 'No DB' });
  
  try {
    await initDb();
    
    // We know the connectionId from before
    const connectionId = 'dcr_240fc368f424458e844a59fa0b49bd65';
    
    // 1. Fetch the JSON from downloaded_data
    const dbResult = await sql`SELECT data FROM downloaded_data WHERE connection_id = ${connectionId}`;
    if (!dbResult || dbResult.length === 0) {
      return NextResponse.json({ error: 'Data not found in downloaded_data' });
    }
    
    const json = dbResult[0].data;
    let qualityScore = 0;
    
    // 2. Recalculate score
    const profile = json?.data?.results?.['youtube.profile']?.data?.data;
    if (profile?.joinedDate) {
      const year = parseInt(profile.joinedDate.split(', ')[1]);
      if (year && year <= 2016) qualityScore += 40;
      else if (year && year <= 2021) qualityScore += 20;
    }
    
    const history = json?.data?.results?.['youtube.history']?.data?.data?.history;
    if (history && history.length >= 20) qualityScore += 20;
    
    const subs = json?.data?.results?.['youtube.subscriptions']?.data?.data?.subscriptions;
    if (subs && subs.length >= 10) qualityScore += 40;

    // 3. Update the user_connections table
    await sql`
      UPDATE user_connections 
      SET quality_score = ${qualityScore} 
      WHERE connection_id = ${connectionId}
    `;

    return NextResponse.json({ 
      success: true, 
      message: 'Quality score recalculated successfully!',
      newScore: qualityScore,
      tier: qualityScore >= 80 ? 'S' : qualityScore >= 60 ? 'A' : qualityScore >= 40 ? 'B' : 'C'
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
