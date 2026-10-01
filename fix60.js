const fs = require('fs');
let c = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

// 1. Toast State
const stateTarget = `    const [connections, setConnections] = useState<ConnectedSource[]>([]);`;
const stateReplace = `    const [connections, setConnections] = useState<ConnectedSource[]>([]);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error') => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 8000);
    };`;
c = c.replace(stateTarget, stateReplace);

// 2. handleConnect POST
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
                    });
                    
                    // Immediately re-fetch from DB to get the calculated qualityScore`;

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
                    }
                    
                    // Immediately re-fetch from DB to get the calculated qualityScore`;
c = c.replace(connectPostTarget, connectPostReplace);

// 3. handleReadData POST
const readPostTarget = `          // Self-heal: Sync this connection to DB to calculate qualityScore if missing
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
            
            // Re-fetch from DB`;

const readPostReplace = `          // Self-heal: Sync this connection to DB to calculate qualityScore if missing
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
            }
            
            // Re-fetch from DB`;
c = c.replace(readPostTarget, readPostReplace);

// 4. Toast HTML
const htmlTarget = `{/* Privacy Sandbox Modal */}`;
const htmlReplace = `{/* Toast Notification */}
      {toast && (
        <div className={\`fixed top-24 right-4 p-4 rounded-xl shadow-2xl z-50 animate-fade-in border text-sm font-bold flex items-center gap-3 \${
          toast.type === 'error' ? 'bg-[#2a0e0e] border-[#ff4444] text-[#ff6666]' : 'bg-[#0e2a14] border-[#44ff66] text-[#66ff88]'
        }\`}>
          <span className="text-xl">{toast.type === 'error' ? '🚫' : '✅'}</span>
          {toast.message}
        </div>
      )}

      {/* Privacy Sandbox Modal */}`;
c = c.replace(htmlTarget, htmlReplace);

fs.writeFileSync('src/app/dashboard/page.tsx', c);
