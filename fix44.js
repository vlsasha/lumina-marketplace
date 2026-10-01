const fs = require('fs');

let c = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

const target = `    const handleReadData = async (sourceId: string) => {
      const connection = connections.find((c) => c.sourceId === sourceId);
      if (!connection) return;

      setLoading(sourceId);
      try {
        const res = await fetch(
          \`/api/vana/data?source=\${sourceId}&connectionId=\${connection.connectionId}\`
        );
        const data = await res.json();
        setDataPreview(data);
      } catch {
        console.error('Failed to read data');
      } finally {
        setLoading(null);
      }
    };`;

const replace = `    const handleReadData = async (sourceId: string) => {
      const connection = connections.find((c) => c.sourceId === sourceId);
      if (!connection) return;

      setLoading(sourceId);
      try {
        const res = await fetch(
          \`/api/vana/data?source=\${sourceId}&connectionId=\${connection.connectionId}\`
        );
        const data = await res.json();
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
        }
      } catch {
        console.error('Failed to read data');
      } finally {
        setLoading(null);
      }
    };`;

if (c.includes('const data = await res.json();\n        setDataPreview(data);')) {
  // Use a targeted regex just in case whitespace is slightly off
  const regex = /    const handleReadData = async \([\s\S]*?setDataPreview\(data\);\n      \} catch \{\n        console\.error\('Failed to read data'\);\n      \} finally \{\n        setLoading\(null\);\n      \}\n    \};/;
  c = c.replace(regex, replace);
  fs.writeFileSync('src/app/dashboard/page.tsx', c);
  console.log("Success");
} else {
  console.log("Failed");
}
