const fs = require('fs');

let c = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

const targetStr = `              // Fetch data preview automatically
              const dataRes = await fetch(\`/api/vana/data?source=\${sourceId}&connectionId=\${data.connectionId}\`);
              const previewData = await dataRes.json();
              setDataPreview(previewData);
              if (!previewData.error) {
                // If we successfully read data, mark as completed
                setConnections((prev) =>
                  prev.map((c) =>
                    c.sourceId === sourceId
                      ? { ...c, status: 'completed' }
                      : c
                  )
                );
              }`;

const replaceStr = `              // Fetch data preview automatically
              const dataRes = await fetch(\`/api/vana/data?source=\${sourceId}&connectionId=\${data.connectionId}\`);
              const previewData = await dataRes.json();
              setDataPreview(previewData);
              
              // Sync to our DB
              if (address) {
                await fetch('/api/connections', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    wallet: address,
                    connection: {
                      sourceId,
                      connectionId: data.connectionId,
                      status: previewData.error ? 'approved' : 'completed',
                      scopesApproved: statusData.scopes || []
                    }
                  })
                });
                
                // Immediately re-fetch from DB to get the calculated qualityScore
                const refreshRes = await fetch(\`/api/connections?wallet=\${address}&t=\${Date.now()}\`);
                const refreshData = await refreshRes.json();
                if (refreshData.connections && refreshData.connections.length > 0) {
                  setConnections(prev => {
                    const merged = [...refreshData.connections];
                    prev.forEach(p => {
                      if (!merged.find(m => m.sourceId === p.sourceId)) merged.push(p);
                    });
                    return merged;
                  });
                }
              }

              if (!previewData.error) {
                // If we successfully read data, mark as completed
                setConnections((prev) =>
                  prev.map((c) =>
                    c.sourceId === sourceId && !c.qualityScore // Only update if DB didn't just update it
                      ? { ...c, status: 'completed' }
                      : c
                  )
                );
              }`;

if (c.includes(targetStr)) {
  c = c.replace(targetStr, replaceStr);
  fs.writeFileSync('src/app/dashboard/page.tsx', c);
  console.log("Replaced successfully in dashboard");
} else {
  console.log("Could not find target string in dashboard");
}
