const fs = require('fs');
let c = fs.readFileSync('src/app/api/connections/route.ts', 'utf8');

c = c.replace(
  `        } catch (e) {
          console.error(e);
        }
      }`,
  `        } catch (e) {
          console.error(e);
        }
      } else if (connection.sourceId === 'instagram') {
        try {
          const dbResult = await sql\`SELECT data FROM downloaded_data WHERE connection_id = \${connection.connectionId}\`;
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
      }`
);

fs.writeFileSync('src/app/api/connections/route.ts', c);
