const fs = require('fs');
let c = fs.readFileSync('src/app/api/connections/route.ts', 'utf8');

const regex = /\} catch \(e\) \{\s*console\.error\('Error parsing JSON for quality score', e\);\s*\}/;

const insertion = `} catch (e) {
        console.error('Error parsing JSON for quality score', e);
      }
      
      // Fallback or explicit check for github since it might not be in downloaded_data yet if parsing raw
      if (connection.sourceId === 'github') {
        try {
          const dbResult = await sql\`SELECT data FROM downloaded_data WHERE connection_id = \${connection.connectionId}\`;
          let json = null;
          if (dbResult && dbResult.length > 0) json = dbResult[0].data;
          
          const profile = json?.data?.results?.['github.profile']?.data?.data || json;
          if (profile?.username) {
            providerAccountId = 'github_' + profile.username;
            const repoCount = profile.repositoryCount || 0;
            if (repoCount >= 50) qualityScore += 30;
            else if (repoCount >= 10) qualityScore += 15;
            
            const followers = profile.followers || 0;
            if (followers >= 100) qualityScore += 30;
            else if (followers >= 10) qualityScore += 15;
            
            const contribs = profile.contributionsLastYear || 0;
            if (contribs >= 1000) qualityScore += 40;
            else if (contribs >= 100) qualityScore += 20;
          }
        } catch (e) {
          console.error(e);
        }
      }`;

c = c.replace(regex, insertion);
fs.writeFileSync('src/app/api/connections/route.ts', c);
