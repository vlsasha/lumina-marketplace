const fs = require('fs');

let file = fs.readFileSync('src/app/api/connections/route.ts', 'utf8');

// YouTube region logic
file = file.replace(
  /if \(profile\?\.channelId\) \{\s*providerAccountId = profile\.channelId;\s*\}/g,
  `if (profile?.channelId) {\n              providerAccountId = profile.channelId;\n            }\n            if (profile?.country) {\n              region = profile.country;\n            }`
);

// Spotify region and age logic
file = file.replace(
  /const profile = json\?\.data\?\.results\?\.\['spotify\.profile'\]\?\.data\?\.data \|\| json;\s*if \(profile\?\.id\) \{\s*providerAccountId = profile\.id;\s*\}/g,
  `const profile = json?.data?.results?.['spotify.profile']?.data?.data || json;
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
            }`
);

// Insert statement
file = file.replace(
  /INSERT INTO user_connections \(wallet_address, source_id, connection_id, status, scopes_approved, provider_account_id, quality_score\) \n\s*VALUES \(\$\{wallet\}, \$\{connection\.sourceId\}, \$\{connection\.connectionId\}, \$\{connection\.status\}, \$\{scopesStr\}, \$\{providerAccountId\}, \$\{qualityScore\}\)/g,
  `INSERT INTO user_connections (wallet_address, source_id, connection_id, status, scopes_approved, provider_account_id, quality_score, region, age_group) \n        VALUES (\${wallet}, \${connection.sourceId}, \${connection.connectionId}, \${connection.status}, \${scopesStr}, \${providerAccountId}, \${qualityScore}, \${region}, \${ageGroup})`
);

// Update statement
file = file.replace(
  /provider_account_id = \$\{providerAccountId\}, \n\s*quality_score = \$\{qualityScore\}/g,
  `provider_account_id = \${providerAccountId}, \n            quality_score = \${qualityScore},\n            region = \${region},\n            age_group = \${ageGroup}`
);

fs.writeFileSync('src/app/api/connections/route.ts', file);
