const fs = require('fs');

let c = fs.readFileSync('src/app/api/connections/route.ts', 'utf8');

const targetStr = `              else if (totalMsgs > 50) qualityScore += 10;
            }
          }`;

const replaceStr = `              else if (totalMsgs > 50) qualityScore += 10;
            }
          } else if (connection.sourceId === 'github') {
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
          }`;

c = c.split(targetStr).join(replaceStr);
fs.writeFileSync('src/app/api/connections/route.ts', c);
