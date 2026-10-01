const fs = require('fs');
let c = fs.readFileSync('src/components/SourcesGrid.tsx', 'utf8');

const target = `    if (address) {
      fetch(\`/api/connections?wallet=\${address}\`)
        .then(res => res.json())
        .then(data => {
          if (data.connections) {
            setConnections(data.connections);
          }
        })
        .catch(console.error);
    }`;

const replacement = `    if (address) {
      fetch(\`/api/connections?wallet=\${address}\`)
        .then(res => res.json())
        .then(data => {
          if (data.connections && data.connections.length > 0) {
            setConnections(prev => {
              const merged = [...data.connections];
              prev.forEach(p => {
                if (!merged.find(m => m.sourceId === p.sourceId)) {
                  merged.push(p);
                }
              });
              return merged;
            });
          }
        })
        .catch(console.error);
    }`;

c = c.replace(target, replacement);
fs.writeFileSync('src/components/SourcesGrid.tsx', c);
