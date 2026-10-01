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
          const convos = json?.data?.results?.['chatgpt.conversations']?.data?.data?.conversations || json?.conversations;
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
      
      // Fallback or explicit check for github
      if (connection.sourceId === 'github') {
        try {
          const dbResult = await sql`SELECT data FROM downloaded_data WHERE connection_id = ${connection.connectionId}`;
          let json = null;
          if (dbResult && dbResult.length > 0) json = dbResult[0].data;
          
          const profileItem = json?.data?.results?.['github.profile']?.data?.data?.items?.[0] || {};
          if (profileItem?.username) {
            providerAccountId = 'github_' + profileItem.username;
            
            const repos = json?.data?.results?.['github.repositories']?.data?.data?.repositories || [];
            const repoCount = repos.length;
            if (repoCount >= 50) qualityScore += 30;
            else if (repoCount >= 10) qualityScore += 15;
            
            const followers = profileItem.followers || 0;
            if (followers >= 100) qualityScore += 30;
            else if (followers >= 10) qualityScore += 15;
            
            const contribData = json?.data?.results?.['github.contributions']?.data?.data;
            const contribs = contribData?.totalContributionsLastYear || 0;
            if (contribs >= 1000) qualityScore += 40;
            else if (contribs >= 100) qualityScore += 20;
          }
        } catch (e) {
          console.error(e);
        }
      } else if (connection.sourceId === 'strava') {
        try {
          const dbResult = await sql`SELECT data FROM downloaded_data WHERE connection_id = ${connection.connectionId}`;
          let json = null;
          if (dbResult && dbResult.length > 0) json = dbResult[0].data;
          
          // Try to find the activities array inside Vana's JSON payload
          let activities = [];
          if (json?.data?.results?.['read_activities']?.data?.data) {
             activities = json.data.results['read_activities'].data.data;
          } else if (json?.data?.results?.['activities']?.data?.data) {
             activities = json.data.results['activities'].data.data;
          } else if (json?.data?.results?.['strava.activities']?.data?.data) {
             activities = json.data.results['strava.activities'].data.data;
          } else if (Array.isArray(json)) {
             activities = json;
          } else if (json?.data && Array.isArray(json.data)) {
             activities = json.data;
          }
          
          if (activities && Array.isArray(activities) && activities.length > 0) {
            // Anti-Sybil: use the user's first activity ID or a hash as a unique identifier since Vana Strava ZIP doesn't include the profile endpoint
            providerAccountId = 'strava_user_' + (activities[0].id || activities[0]['Activity ID'] || Math.floor(Math.random() * 1000000));
            
            // Score based on number of activities
            if (activities.length >= 100) qualityScore += 50;
            else if (activities.length >= 20) qualityScore += 30;
            else if (activities.length > 0) qualityScore += 15;
            
            // Score based on total distance
            let totalDistance = 0;
            activities.forEach(act => {
               const dist = act.distance || act['Distance'] || 0;
               totalDistance += parseFloat(dist);
            });
            
            // Assuming distance is in meters or kilometers (we check both limits)
            if (totalDistance > 1000) qualityScore += 50;
            else if (totalDistance > 100) qualityScore += 30;
            else if (totalDistance > 5) qualityScore += 10;
          }
        } catch (e) {
          console.error(e);
        }
      } else if (connection.sourceId === 'instagram') {
        try {
          const dbResult = await sql`SELECT data FROM downloaded_data WHERE connection_id = ${connection.connectionId}`;
          let json = null;
          if (dbResult && dbResult.length > 0) json = dbResult[0].data;
          
          const profile = json?.data?.results?.['instagram.profile']?.data?.data || json;
          if (profile?.username) {
            providerAccountId = 'instagram_' + profile.username;
            
            if (profile.is_verified) qualityScore += 30;
            
            const followers = profile.follower_count || 0;
            if (followers >= 1000) qualityScore += 40;
            else if (followers >= 100) qualityScore += 20;
            
            const posts = profile.media_count || 0;
            if (posts >= 50) qualityScore += 30;
            else if (posts >= 10) qualityScore += 15;
          }
        } catch (e) {
          console.error(e);
        }
      } else if (connection.sourceId === 'spotify') {
        try {
          const dbResult = await sql`SELECT data FROM downloaded_data WHERE connection_id = ${connection.connectionId}`;
          let json = null;
          if (dbResult && dbResult.length > 0) json = dbResult[0].data;
          
          const profile = json?.data?.results?.['spotify.profile']?.data?.data || json;
          if (profile?.id) {
            providerAccountId = 'spotify_' + profile.id;
            
            // Score based on followers
            const followers = profile.followers || 0;
            if (followers >= 100) qualityScore += 30;
            else if (followers >= 10) qualityScore += 15;
            
            // Score based on saved tracks
            const tracksData = json?.data?.results?.['spotify.savedTracks']?.data?.data;
            const tracks = tracksData?.total || tracksData?.savedTracks?.length || 0;
            if (tracks >= 500) qualityScore += 40;
            else if (tracks >= 100) qualityScore += 20;
            
            // Score based on playlists
            const playlistData = json?.data?.results?.['spotify.playlists']?.data?.data;
            const playlists = playlistData?.total || playlistData?.playlists?.length || 0;
            if (playlists >= 10) qualityScore += 30;
            else if (playlists >= 3) qualityScore += 15;
          }
        } catch (e) {
          console.error(e);
        }
      } else if (connection.sourceId === 'linkedin') {
        try {
          const dbResult = await sql`SELECT data FROM downloaded_data WHERE connection_id = ${connection.connectionId}`;
          let json = null;
          if (dbResult && dbResult.length > 0) json = dbResult[0].data;
          
          const profile = json?.data?.results?.['linkedin.profile']?.data?.data || json;
          if (profile?.profileUrl) {
            // Extract the username part from https://www.linkedin.com/in/username/
            let username = profile.profileUrl;
            if (username.includes('/in/')) {
              username = username.split('/in/')[1].replace(/\//g, '');
            }
            providerAccountId = 'linkedin_' + username;
            
            // Score based on profile connections count
            const connCount = parseInt(profile.connections) || 0;
            if (connCount >= 500) qualityScore += 30;
            else if (connCount >= 100) qualityScore += 15;
            
            // Score based on experiences
            const exps = json?.data?.results?.['linkedin.experience']?.data?.data?.experiences || [];
            if (exps.length >= 5) qualityScore += 30;
            else if (exps.length > 0) qualityScore += 15;
            
            // Score based on skills
            const skills = json?.data?.results?.['linkedin.skills']?.data?.data?.skills || [];
            if (skills.length >= 10) qualityScore += 20;
            else if (skills.length >= 3) qualityScore += 10;
            
            // Bonus for education & languages
            const edu = json?.data?.results?.['linkedin.education']?.data?.data?.education || [];
            if (edu.length > 0) qualityScore += 10;
            
            const langs = json?.data?.results?.['linkedin.languages']?.data?.data?.languages || [];
            if (langs.length > 0) qualityScore += 10;
          }
        } catch (e) {
          console.error(e);
        }
      } else if (connection.sourceId === 'claude') {
        try {
          const dbResult = await sql`SELECT data FROM downloaded_data WHERE connection_id = ${connection.connectionId}`;
          let json = null;
          if (dbResult && dbResult.length > 0) json = dbResult[0].data;
          
          const claudeData = json?.data?.results?.['claude.conversations']?.data?.data || json;
          if (claudeData?.organizationId) {
            providerAccountId = 'claude_' + claudeData.organizationId;
            
            const plan = claudeData.profile?.plan || '';
            if (plan.toLowerCase().includes('pro') || plan.toLowerCase().includes('paid')) {
              qualityScore += 20;
            }
            
            const convos = claudeData.conversations || [];
            if (convos.length >= 50) qualityScore += 40;
            else if (convos.length >= 10) qualityScore += 20;
            
            const msgTotal = claudeData.messageTotal || 0;
            if (msgTotal >= 500) qualityScore += 40;
            else if (msgTotal >= 100) qualityScore += 20;
          }
        } catch (e) {
          console.error(e);
        }
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
