const fs = require('fs');
let c = fs.readFileSync('src/components/SourcesGrid.tsx', 'utf8');

const target1 = `import { useState } from 'react';
import { DATA_SOURCES } from '@/lib/data-sources';`;

const replacement1 = `import { useState, useEffect } from 'react';
import { DATA_SOURCES } from '@/lib/data-sources';
import { useAccount } from 'wagmi';`;

c = c.replace(target1, replacement1);

const target2 = `  const availableSources = DATA_SOURCES;

  // Extract unique categories`;

const replacement2 = `  const { address } = useAccount();
  const [connections, setConnections] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('vana_connections');
    if (saved) {
      setConnections(JSON.parse(saved));
    }
    
    if (address) {
      fetch(\`/api/connections?wallet=\${address}\`)
        .then(res => res.json())
        .then(data => {
          if (data.connections) {
            setConnections(data.connections);
          }
        })
        .catch(console.error);
    }
  }, [address]);

  const availableSources = DATA_SOURCES.map(source => {
    const conn = connections.find(c => c.sourceId === source.id);
    if (conn && (conn.status === 'completed' || conn.status === 'approved')) {
      return { ...source, status: 'connected' as const };
    }
    return source;
  });

  // Extract unique categories`;

c = c.replace(target2, replacement2);
fs.writeFileSync('src/components/SourcesGrid.tsx', c);
