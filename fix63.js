const fs = require('fs');
let c = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

c = c.replace(
  `}
                    });
                    
                    // Immediately re-fetch`,
  `}
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
                    
                    // Immediately re-fetch`
);

c = c.replace(
  `}
            });
            
            // Re-fetch`,
  `}
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
            
            // Re-fetch`
);

fs.writeFileSync('src/app/dashboard/page.tsx', c);
