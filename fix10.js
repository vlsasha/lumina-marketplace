const fs = require('fs');
let c = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

const target1 = `  useEffect(() => {
    const saved = localStorage.getItem('vana_connections');
    if (saved) {
      setConnections(JSON.parse(saved));
    }
  }, []);`;

const replacement1 = `  useEffect(() => {
    const saved = localStorage.getItem('vana_connections');
    if (saved) {
      setConnections(JSON.parse(saved));
    }
    
    // Sync with DB if wallet is connected
    if (address) {
      fetch(\`/api/connections?wallet=\${address}\`)
        .then(res => res.json())
        .then(data => {
          if (data.connections && data.connections.length > 0) {
            setConnections(prev => {
              // Merge db connections with local, preferring DB
              const merged = [...data.connections];
              prev.forEach(p => {
                if (!merged.find(m => m.sourceId === p.sourceId)) {
                  merged.push(p);
                }
              });
              localStorage.setItem('vana_connections', JSON.stringify(merged));
              return merged;
            });
          }
        })
        .catch(console.error);
    }
  }, [address]);`;

c = c.replace(target1, replacement1);

const target2 = `        if (data.requestId) {
          const newConn = {
            sourceId,
            connectionId: data.requestId,
            status: 'pending' as ConnectionStatus,
          };
          const newConns = [...connections.filter((c) => c.sourceId !== sourceId), newConn];
          setConnections(newConns);
          localStorage.setItem('vana_connections', JSON.stringify(newConns));`;

const replacement2 = `        if (data.requestId) {
          const newConn = {
            sourceId,
            connectionId: data.requestId,
            status: 'pending' as ConnectionStatus,
          };
          const newConns = [...connections.filter((c) => c.sourceId !== sourceId), newConn];
          setConnections(newConns);
          localStorage.setItem('vana_connections', JSON.stringify(newConns));
          
          if (address) {
            fetch('/api/connections', {
              method: 'POST',
              body: JSON.stringify({ wallet: address, connection: newConn })
            }).catch(console.error);
          }`;

c = c.replace(target2, replacement2);

const target3 = `              if (statusData.status === 'approved') {
                clearInterval(pollInterval);
                const updatedConn = {
                  sourceId,
                  connectionId: data.connectionId,
                  status: 'completed' as ConnectionStatus,
                  scopesApproved: statusData.scope ? statusData.scope.split(' ') : [],
                };
                const newConns = [...connections.filter((c) => c.sourceId !== sourceId), updatedConn];
                setConnections(newConns);
                localStorage.setItem('vana_connections', JSON.stringify(newConns));`;

const replacement3 = `              if (statusData.status === 'approved') {
                clearInterval(pollInterval);
                const updatedConn = {
                  sourceId,
                  connectionId: data.connectionId,
                  status: 'completed' as ConnectionStatus,
                  scopesApproved: statusData.scope ? statusData.scope.split(' ') : [],
                };
                const newConns = [...connections.filter((c) => c.sourceId !== sourceId), updatedConn];
                setConnections(newConns);
                localStorage.setItem('vana_connections', JSON.stringify(newConns));
                
                if (address) {
                  fetch('/api/connections', {
                    method: 'POST',
                    body: JSON.stringify({ wallet: address, connection: updatedConn })
                  }).catch(console.error);
                  
                  // Also add them as a provider in the UI
                  fetch('/api/providers', {
                    method: 'POST',
                    body: JSON.stringify({ wallet_address: address })
                  }).catch(console.error);
                }`;

c = c.replace(target3, replacement3);
fs.writeFileSync('src/app/dashboard/page.tsx', c);
