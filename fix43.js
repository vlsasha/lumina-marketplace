const fs = require('fs');

let c = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

const tinyTarget = "localStorage.setItem(`vana_data_${data.connectionId}`, JSON.stringify(previewData));\n                }";

const replace = `localStorage.setItem(\`vana_data_\${data.connectionId}\`, JSON.stringify(previewData));
                }
                
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
                }`;

if (c.includes("localStorage.setItem(`vana_data_${data.connectionId}`, JSON.stringify(previewData));")) {
  c = c.replace(/localStorage\.setItem\(`vana_data_\$\{data\.connectionId\}`\, JSON\.stringify\(previewData\)\);[\r\n\s]*\}/, replace);
  fs.writeFileSync('src/app/dashboard/page.tsx', c);
  console.log("Success");
} else {
  console.log("Failed completely");
}
