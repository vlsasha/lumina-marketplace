const fs = require('fs');

let file = fs.readFileSync('src/app/api/connections/route.ts', 'utf8');

file = file.replace(
  `            if (playlists >= 10) qualityScore += 30;
            else if (playlists >= 3) qualityScore += 15;
          }
        } catch (e) {`,
  `            if (playlists >= 10) qualityScore += 30;
            else if (playlists >= 3) qualityScore += 15;
        } catch (e) {`
);

fs.writeFileSync('src/app/api/connections/route.ts', file);
