const fs = require('fs');

let c = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

const regex = /  useEffect\(\(\) => \{\n    \/\/ Load from localStorage on mount\n    const saved = localStorage\.getItem\('Lumina_connections'\);[\s\S]*?  \}, \[connections\]\);/m;

const replacement = `  useEffect(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem('Lumina_connections');
    if (saved) {
      try {
        setConnections(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved connections');
      }
    }
  }, []);

  // Sync with DB if wallet is connected
  useEffect(() => {
    if (address) {
      fetch(\`/api/connections?wallet=\${address}&t=\${Date.now()}\`)
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
              localStorage.setItem('Lumina_connections', JSON.stringify(merged));
              return merged;
            });
          }
        })
        .catch(console.error);
    }
  }, [address]);

  // Save to localStorage whenever connections change
  useEffect(() => {
    if (connections.length > 0) {
      localStorage.setItem('Lumina_connections', JSON.stringify(connections));
    }
  }, [connections]);`;

if (regex.test(c)) {
  c = c.replace(regex, replacement);
  fs.writeFileSync('src/app/dashboard/page.tsx', c);
  console.log("Success");
} else {
  console.log("Failed");
}
