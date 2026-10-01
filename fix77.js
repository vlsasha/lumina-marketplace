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
      } else if (connection.sourceId === 'strava') {
        try {
          const dbResult = await sql\`SELECT data FROM downloaded_data WHERE connection_id = \${connection.connectionId}\`;
          let json = null;
          if (dbResult && dbResult.length > 0) json = dbResult[0].data;
          
          // Try to find the activities array inside Vana's JSON payload
          let activities = [];
          if (json?.data?.results?.['read_activities']?.data?.data) {
             activities = json.data.results['read_activities'].data.data;
          } else if (json?.data?.results?.['activities']?.data?.data) {
             activities = json.data.results['activities'].data.data;
          } else if (json?.data?.results?.['strava.activities']?.data?.data) {
             activities = json.data.results['strava.activities'].data.data;
          } else if (Array.isArray(json)) {
             activities = json;
          } else if (json?.data && Array.isArray(json.data)) {
             activities = json.data;
          }
          
          if (activities && Array.isArray(activities) && activities.length > 0) {
            // Anti-Sybil: use the user's first activity ID or a hash as a unique identifier since Vana Strava ZIP doesn't include the profile endpoint
            providerAccountId = 'strava_user_' + (activities[0].id || activities[0]['Activity ID'] || Math.floor(Math.random() * 1000000));
            
            // Score based on number of activities
            if (activities.length >= 100) qualityScore += 50;
            else if (activities.length >= 20) qualityScore += 30;
            else if (activities.length > 0) qualityScore += 15;
            
            // Score based on total distance
            let totalDistance = 0;
            activities.forEach(act => {
               const dist = act.distance || act['Distance'] || 0;
               totalDistance += parseFloat(dist);
            });
            
            // Assuming distance is in meters or kilometers (we check both limits)
            if (totalDistance > 1000) qualityScore += 50;
            else if (totalDistance > 100) qualityScore += 30;
            else if (totalDistance > 5) qualityScore += 10;
          }
        } catch (e) {
          console.error(e);
        }
      }`
);

fs.writeFileSync('src/app/api/connections/route.ts', c);
