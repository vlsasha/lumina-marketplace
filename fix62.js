const fs = require('fs');

let c = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

c = c.replace(
  'const [connections, setConnections] = useState<ConnectedSource[]>([]);',
  `const [connections, setConnections] = useState<ConnectedSource[]>([]);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error') => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 8000);
    };`
);

const connectPostTarget = `                  // Sync to our DB
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
                    });`;

const connectPostReplace = `                  // Sync to our DB
                  if (address) {
                    const postRes = await fetch('/api/connections', {
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
                    
                    if (!postRes.ok) {
                      const errData = await postRes.json();
                      showToast(errData.error || 'Failed to sync database', 'error');
                      setConnections(prev => {
                        const filtered = prev.filter(c => c.sourceId !== sourceId);
                        localStorage.setItem('Lumina_connections', JSON.stringify(filtered));
                        return filtered;
                      });
                      clearInterval(pollInterval);
                      setLoading(null);
                      return;
                    } else {
                      showToast('Account connected and verified!', 'success');
                    }`;

c = c.replace(connectPostTarget, connectPostReplace);

const readPostTarget = `        // Self-heal: Sync this connection to DB to calculate qualityScore if missing
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
          });`;

const readPostReplace = `        // Self-heal: Sync this connection to DB to calculate qualityScore if missing
        if (address && connection.qualityScore == null) {
          const postRes = await fetch('/api/connections', {
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
          
          if (!postRes.ok) {
            const errData = await postRes.json();
            showToast(errData.error || 'Failed to sync database', 'error');
            setConnections(prev => {
              const filtered = prev.filter(c => c.sourceId !== sourceId);
              localStorage.setItem('Lumina_connections', JSON.stringify(filtered));
              return filtered;
            });
            setLoading(null);
            return;
          }`;

c = c.replace(readPostTarget, readPostReplace);

fs.writeFileSync('src/app/dashboard/page.tsx', c);
