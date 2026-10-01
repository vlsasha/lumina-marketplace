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
      } else if (connection.sourceId === 'linkedin') {
        try {
          const dbResult = await sql\`SELECT data FROM downloaded_data WHERE connection_id = \${connection.connectionId}\`;
          let json = null;
          if (dbResult && dbResult.length > 0) json = dbResult[0].data;
          
          const profile = json?.data?.results?.['linkedin.profile']?.data?.data || json;
          if (profile?.profileUrl) {
            // Extract the username part from https://www.linkedin.com/in/username/
            let username = profile.profileUrl;
            if (username.includes('/in/')) {
              username = username.split('/in/')[1].replace(/\\//g, '');
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
      }`
);

fs.writeFileSync('src/app/api/connections/route.ts', c);
