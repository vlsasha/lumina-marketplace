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
      } else if (connection.sourceId === 'spotify') {
        try {
          const dbResult = await sql\`SELECT data FROM downloaded_data WHERE connection_id = \${connection.connectionId}\`;
          let json = null;
          if (dbResult && dbResult.length > 0) json = dbResult[0].data;
          
          const profile = json?.data?.results?.['spotify.profile']?.data?.data || json;
          if (profile?.id) {
            providerAccountId = 'spotify_' + profile.id;
            
            // Score based on followers
            const followers = profile.followers || 0;
            if (followers >= 100) qualityScore += 30;
            else if (followers >= 10) qualityScore += 15;
            
            // Score based on saved tracks
            const tracksData = json?.data?.results?.['spotify.savedTracks']?.data?.data;
            const tracks = tracksData?.total || tracksData?.savedTracks?.length || 0;
            if (tracks >= 500) qualityScore += 40;
            else if (tracks >= 100) qualityScore += 20;
            
            // Score based on playlists
            const playlistData = json?.data?.results?.['spotify.playlists']?.data?.data;
            const playlists = playlistData?.total || playlistData?.playlists?.length || 0;
            if (playlists >= 10) qualityScore += 30;
            else if (playlists >= 3) qualityScore += 15;
          }
        } catch (e) {
          console.error(e);
        }
      }`
);

fs.writeFileSync('src/app/api/connections/route.ts', c);
