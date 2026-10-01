const fs = require('fs');
let c = fs.readFileSync('src/app/api/connections/route.ts', 'utf8');

const regex = /\/\/ Fallback or explicit check for github[\s\S]*?\} catch \(e\) \{\s*console\.error\(e\);\s*\}\s*\}/;

const insertion = `// Fallback or explicit check for github
      if (connection.sourceId === 'github') {
        try {
          const dbResult = await sql\`SELECT data FROM downloaded_data WHERE connection_id = \${connection.connectionId}\`;
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
      }`;

c = c.replace(regex, insertion);
fs.writeFileSync('src/app/api/connections/route.ts', c);
