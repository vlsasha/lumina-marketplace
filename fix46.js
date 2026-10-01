const fs = require('fs');
let c = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

const regex = /        const data = await res\.json\(\);\s*setDataPreview\(data\);/;
const replace = `        const data = await res.json();
        setDataPreview(data);
        
        // Self-heal: Sync this connection to DB to calculate qualityScore if missing
        if (address && connection.qualityScore == null) {
          await fetch('/api/connections', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              wallet: address,
              connection: {
                sourceId,
                connectionId: connection.connectionId,
                status: data.error ? 'approved' : 'completed',
                scopesApproved: connection.scopesApproved || []
              }
            })
          });
          
          // Re-fetch from DB
          const refreshRes = await fetch(\`/api/connections?wallet=\${address}&t=\${Date.now()}\`);
          const refreshData = await refreshRes.json();
          if (refreshData.connections && refreshData.connections.length > 0) {
            setConnections(prev => {
              const merged = [...refreshData.connections];
              prev.forEach(p => {
                if (!merged.find(m => m.sourceId === p.sourceId)) merged.push(p);
              });
              localStorage.setItem('Lumina_connections', JSON.stringify(merged));
              return merged;
            });
          }
        }`;

c = c.replace(regex, replace);
fs.writeFileSync('src/app/dashboard/page.tsx', c);
