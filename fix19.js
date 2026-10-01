const fs = require('fs');
let c = fs.readFileSync('src/app/api/connections/route.ts', 'utf8');

const targetGet = `    const connections = result.map(row => ({
      sourceId: row.source_id,
      connectionId: row.connection_id,
      status: row.status,
      scopesApproved: row.scopes_approved ? JSON.parse(row.scopes_approved) : []
    }));`;

const replaceGet = `    const connections = result.map(row => ({
      sourceId: row.source_id,
      connectionId: row.connection_id,
      status: row.status,
      scopesApproved: row.scopes_approved ? JSON.parse(row.scopes_approved) : [],
      providerAccountId: row.provider_account_id,
      qualityScore: row.quality_score
    }));`;

c = c.replace(targetGet, replaceGet);

const targetPost = `    const scopesStr = JSON.stringify(connection.scopesApproved || []);

    await sql\`
      INSERT INTO user_connections (wallet_address, source_id, connection_id, status, scopes_approved) 
      VALUES (\${wallet}, \${connection.sourceId}, \${connection.connectionId}, \${connection.status}, \${scopesStr}) 
      ON CONFLICT (wallet_address, source_id) 
      DO UPDATE SET 
        connection_id = \${connection.connectionId}, 
        status = \${connection.status}, 
        scopes_approved = \${scopesStr}
    \`;`;

const replacePost = `    const scopesStr = JSON.stringify(connection.scopesApproved || []);

    // Try to parse the unique ID and calculate quality score from the downloaded JSON
    let providerAccountId = null;
    let qualityScore = 0;
    
    try {
      const dbResult = await sql\`SELECT data FROM downloaded_data WHERE connection_id = \${connection.connectionId}\`;
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
        }
      }
    } catch (e) {
      console.error('Error parsing JSON for quality score', e);
    }

    try {
      await sql\`
        INSERT INTO user_connections (wallet_address, source_id, connection_id, status, scopes_approved, provider_account_id, quality_score) 
        VALUES (\${wallet}, \${connection.sourceId}, \${connection.connectionId}, \${connection.status}, \${scopesStr}, \${providerAccountId}, \${qualityScore}) 
        ON CONFLICT (wallet_address, source_id) 
        DO UPDATE SET 
          connection_id = \${connection.connectionId}, 
          status = \${connection.status}, 
          scopes_approved = \${scopesStr},
          provider_account_id = \${providerAccountId},
          quality_score = \${qualityScore}
      \`;
    } catch (e: any) {
      if (e.message && e.message.includes('unique constraint "unique_provider_account"')) {
        return NextResponse.json({ error: 'This account is already registered in the marketplace.' }, { status: 409 });
      }
      throw e;
    }`;

c = c.replace(targetPost, replacePost);
fs.writeFileSync('src/app/api/connections/route.ts', c);
