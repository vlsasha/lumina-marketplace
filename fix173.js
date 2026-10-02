const fs = require('fs');
let file = fs.readFileSync('src/app/api/connections/route.ts', 'utf8');

const oldSql = `        INSERT INTO user_connections (wallet_address, source_id, connection_id, status, scopes_approved, provider_account_id, quality_score) 
        VALUES (\${wallet}, \${connection.sourceId}, \${connection.connectionId}, \${connection.status}, \${scopesStr}, \${providerAccountId}, \${qualityScore}) 
        ON CONFLICT (wallet_address, source_id) 
        DO UPDATE SET 
          connection_id = \${connection.connectionId}, 
          status = \${connection.status}, 
          scopes_approved = \${scopesStr},
          provider_account_id = \${providerAccountId}, 
          quality_score = \${qualityScore}`;

const newSql = `        INSERT INTO user_connections (wallet_address, source_id, connection_id, status, scopes_approved, provider_account_id, quality_score, region, age_group) 
        VALUES (\${wallet}, \${connection.sourceId}, \${connection.connectionId}, \${connection.status}, \${scopesStr}, \${providerAccountId}, \${qualityScore}, \${region}, \${ageGroup}) 
        ON CONFLICT (wallet_address, source_id) 
        DO UPDATE SET 
          connection_id = \${connection.connectionId}, 
          status = \${connection.status}, 
          scopes_approved = \${scopesStr},
          provider_account_id = \${providerAccountId}, 
          quality_score = \${qualityScore},
          region = \${region},
          age_group = \${ageGroup}`;

file = file.replace(oldSql, newSql);

const oldSpotify = `const profile = json?.data?.results?.['spotify.profile']?.data?.data || json;
          if (profile?.id) {
            providerAccountId = profile.id;
          }`;
const newSpotify = `const profile = json?.data?.results?.['spotify.profile']?.data?.data || json;
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

file = file.replace(oldSpotify, newSpotify);

fs.writeFileSync('src/app/api/connections/route.ts', file);
