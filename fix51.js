const fs = require('fs');

let c = fs.readFileSync('src/app/api/connections/route.ts', 'utf8');

const targetStr = `            }
          }
        }
      } catch (e) {
        console.error('Error parsing JSON for quality score', e);
      }`;

const replaceStr = `            }
          } else if (connection.sourceId === 'github') {
            // Github JSON can be nested or direct depending on the exact DCR scope structure
            const profile = json?.data?.results?.['github.profile']?.data?.data || json;
            if (profile?.username) {
              providerAccountId = 'github_' + profile.username;
              
              // Score based on Repositories
              const repoCount = profile.repositoryCount || 0;
              if (repoCount >= 50) qualityScore += 30;
              else if (repoCount >= 10) qualityScore += 15;
              
              // Score based on Network (Followers)
              const followers = profile.followers || 0;
              if (followers >= 100) qualityScore += 30;
              else if (followers >= 10) qualityScore += 15;
              
              // Score based on Activity (Contributions)
              const contribs = profile.contributionsLastYear || 0;
              if (contribs >= 1000) qualityScore += 40;
              else if (contribs >= 100) qualityScore += 20;
            }
          }
        }
      } catch (e) {
        console.error('Error parsing JSON for quality score', e);
      }`;

if (c.includes(targetStr)) {
  c = c.replace(targetStr, replaceStr);
  fs.writeFileSync('src/app/api/connections/route.ts', c);
  console.log("Success");
} else {
  // Try split/join
  const parts = c.split("            }\n          }\n        }\n      } catch (e) {\n        console.error('Error parsing JSON for quality score', e);\n      }");
  if (parts.length > 1) {
    console.log("Split worked");
    // Not needed, regex below
  } else {
    // Regex whitespace agnostic
    c = c.replace(/            \}\s*\}\s*\}\s*\} catch \(e\) \{\s*console\.error\('Error parsing JSON for quality score', e\);\s*\}/, replaceStr);
    fs.writeFileSync('src/app/api/connections/route.ts', c);
    console.log("Regex fallback used");
  }
}
