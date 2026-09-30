const fs = require('fs');
let content = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

const target = `// Redirect to Vana DCR page
        window.open(data.approvalUrl || data.connectUrl, '_blank', 'noopener,noreferrer');
      }`;

const replacement = `// Open Vana in a new tab
        const popup = window.open(data.approvalUrl || data.connectUrl, '_blank', 'noopener,noreferrer');

        // Poll for completion automatically
        const pollInterval = setInterval(async () => {
          try {
            const statusRes = await fetch(\`/api/vana/status?source=\${sourceId}&connectionId=\${data.connectionId}\`);
            const statusData = await statusRes.json();
            
            if (statusData.status === 'approved' || statusData.status === 'completed') {
              clearInterval(pollInterval);
              
              // Trigger data read which will acknowledge and allow Vana to redirect/close
              await fetch(\`/api/vana/data?source=\${sourceId}&connectionId=\${data.connectionId}\`);
              
              // Update UI state
              setConnections((prev) =>
                prev.map((c) =>
                  c.sourceId === sourceId
                    ? { ...c, status: 'approved', connectedAt: new Date().toISOString(), scopesApproved: statusData.scopes || [] }
                    : c
                )
              );

              // Fetch data preview automatically
              const dataRes = await fetch(\`/api/vana/data?source=\${sourceId}&connectionId=\${data.connectionId}\`);
              const previewData = await dataRes.json();
              setDataPreview(previewData);

              // Try to close the popup if browser allows it
              if (popup && !popup.closed) popup.close();
            } else if (statusData.status === 'rejected' || (popup && popup.closed)) {
              clearInterval(pollInterval);
            }
          } catch (e) {
            console.error('Polling error', e);
          }
        }, 2000);
      }`;

content = content.replace(/\/\/ Open Vana in a new tab[\s\S]+?}, 2000\);\n      }/, target); // revert previous broken
content = content.replace(target, replacement);

fs.writeFileSync('src/app/dashboard/page.tsx', content);
