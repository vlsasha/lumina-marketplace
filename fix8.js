const fs = require('fs');
let c = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

const target = `  const handleRemove = (sourceId: string) => {
    const newConns = connections.filter((c) => c.sourceId !== sourceId);
    setConnections(newConns);
    localStorage.setItem('vana_connections', JSON.stringify(newConns));
  };`;

const replacement = `  const handleRemove = (sourceId: string) => {
    const conn = connections.find(c => c.sourceId === sourceId);
    if (conn) {
      localStorage.removeItem(\`vana_data_\${conn.connectionId}\`);
    }
    const newConns = connections.filter((c) => c.sourceId !== sourceId);
    setConnections(newConns);
    localStorage.setItem('vana_connections', JSON.stringify(newConns));
    if (dataPreview?.source === sourceId) {
      setDataPreview(null);
    }
  };`;

c = c.replace(target, replacement);
fs.writeFileSync('src/app/dashboard/page.tsx', c);
