const fs = require('fs');

let file = fs.readFileSync('src/app/api/connections/route.ts', 'utf8');

// 1. Add let variables
file = file.replace(
  `let qualityScore = 0;`,
  `let qualityScore = 0;\n      let region = 'Global';\n      let ageGroup = 'Any';`
);

// 2. Add YouTube region logic
file = file.replace(
  `if (profile?.channelId) {\n              providerAccountId = profile.channelId;\n            }`,
  `if (profile?.channelId) {\n              providerAccountId = profile.channelId;\n            }\n            if (profile?.country) {\n              region = profile.country;\n            }`
);

// 3. Add Spotify region and age logic
const spotifyBlock = `const profile = json?.data?.results?.['spotify.profile']?.data?.data || json;
            if (profile?.id) {
              providerAccountId = profile.id;
            }`;
const newSpotifyBlock = `const profile = json?.data?.results?.['spotify.profile']?.data?.data || json;
            if (profile?.id) {
              providerAccountId = profile.id;
            }
            if (profile?.country) region = profile.country;
            if (profile?.birthdate) {
              const birthYear = parseInt(profile.birthdate.split('-')[0]);
              if (!isNaN(birthYear)) {
                const currentYear = new Date().getFullYear();
                const age = currentYear - birthYear;
                if (age >= 18 && age <= 24) ageGroup = '18-24';
                else if (age >= 25 && age <= 31) ageGroup = '25-31';
                else if (age >= 32 && age <= 38) ageGroup = '32-38';
                else if (age >= 39 && age <= 45) ageGroup = '39-45';
                else if (age > 45) ageGroup = '45+';
              }
            }`;
file = file.replace(spotifyBlock, newSpotifyBlock);

// 4. Update SQL Insert
const oldInsert = `          INSERT INTO user_connections (wallet_address, source_id, connection_id, status, scopes_approved, provider_account_id, quality_score) 
          VALUES (\${wallet}, \${connection.sourceId}, \${connection.connectionId}, \${connection.status}, \${scopesStr}, \${providerAccountId}, \${qualityScore})`;
const newInsert = `          INSERT INTO user_connections (wallet_address, source_id, connection_id, status, scopes_approved, provider_account_id, quality_score, region, age_group) 
          VALUES (\${wallet}, \${connection.sourceId}, \${connection.connectionId}, \${connection.status}, \${scopesStr}, \${providerAccountId}, \${qualityScore}, \${region}, \${ageGroup})`;
file = file.replace(oldInsert, newInsert);

// 5. Update SQL Update
const oldUpdate = `            provider_account_id = \${providerAccountId}, 
            quality_score = \${qualityScore}`;
const newUpdate = `            provider_account_id = \${providerAccountId}, 
            quality_score = \${qualityScore},
            region = \${region},
            age_group = \${ageGroup}`;
file = file.replace(oldUpdate, newUpdate);

fs.writeFileSync('src/app/api/connections/route.ts', file);
