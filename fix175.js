const fs = require('fs');

let file = fs.readFileSync('src/app/api/connections/route.ts', 'utf8');

file = file.replace(
  /const profile = json\?\.data\?\.results\?\.\['spotify\.profile'\]\?\.data\?\.data \|\| json;\s*if \(profile\?\.id\) \{\s*providerAccountId = 'spotify_' \+ profile\.id;\s*[\s\S]*?\/\/ Score based on followers/,
  `const profile = json?.data?.results?.['spotify.profile']?.data?.data || json;
          if (profile?.id) {
            providerAccountId = 'spotify_' + profile.id;
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
          }
          // Score based on followers`
);

fs.writeFileSync('src/app/api/connections/route.ts', file);
