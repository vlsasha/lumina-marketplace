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
      } else if (connection.sourceId === 'icloud_notes') {
        try {
          const dbResult = await sql\`SELECT data FROM downloaded_data WHERE connection_id = \${connection.connectionId}\`;
          let json = null;
          if (dbResult && dbResult.length > 0) json = dbResult[0].data;
          
          const notesData = json?.data?.results?.['icloud.notes']?.data?.data || json;
          const foldersData = json?.data?.results?.['icloud.folders']?.data?.data;
          
          if (notesData?.userName) {
            providerAccountId = 'icloud_' + notesData.userName.replace(/\\s+/g, '_');
            
            const notesCount = notesData.total || notesData.notes?.length || 0;
            if (notesCount >= 100) qualityScore += 80;
            else if (notesCount >= 10) qualityScore += 40;
            else if (notesCount > 0) qualityScore += 15;
            
            const foldersCount = foldersData?.total || foldersData?.folders?.length || 0;
            if (foldersCount >= 5) qualityScore += 20;
          }
        } catch (e) {
          console.error(e);
        }
      }`
);

fs.writeFileSync('src/app/api/connections/route.ts', c);
