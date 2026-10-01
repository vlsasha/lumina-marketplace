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

// handleConnect POST Replace
const connectRegex = /await fetch\('\/api\/connections',\s*\{\s*method: 'POST',[\s\S]*?body: JSON\.stringify\(\{\s*wallet: address,\s*connection: \{\s*sourceId,\s*connectionId: data\.connectionId,\s*status: previewData\.error \? 'approved' : 'completed',\s*scopesApproved: statusData\.scopes \|\| \[\]\s*\}\s*\}\)\s*\}\);/g;

c = c.replace(connectRegex, `const postRes = await fetch('/api/connections', {
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
                      showToast('Account successfully verified and synced!', 'success');
                    }`);

// handleReadData POST Replace
const readRegex = /await fetch\('\/api\/connections',\s*\{\s*method: 'POST',[\s\S]*?body: JSON\.stringify\(\{\s*wallet: address,\s*connection: \{\s*sourceId,\s*connectionId: connection\.connectionId,\s*status: data\.error \? 'approved' : 'completed',\s*scopesApproved: connection\.scopesApproved \|\| \[\]\s*\}\s*\}\)\s*\}\);/g;

c = c.replace(readRegex, `const postRes = await fetch('/api/connections', {
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
            }`);

fs.writeFileSync('src/app/dashboard/page.tsx', c);
