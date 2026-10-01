const fs = require('fs');
let c = fs.readFileSync('src/components/SourceCard.tsx', 'utf8');

// Add useAccount import
c = c.replace(`import type { DataSource } from '@/lib/data-sources';`, `import type { DataSource } from '@/lib/data-sources';\nimport { useAccount } from 'wagmi';`);

// Add useAccount hook
c = c.replace(`  const [isConnecting, setIsConnecting] = useState(false);`, `  const [isConnecting, setIsConnecting] = useState(false);\n  const { address } = useAccount();`);

// Fix localStorage key and sync to DB
const targetSync = `              // Save to local storage
              const saved = localStorage.getItem('Lumina_connections');
              const connections = saved ? JSON.parse(saved) : [];
              connections.push({
                sourceId: source.id,
                connectionId: data.connectionId,
                status: 'approved',
                connectedAt: new Date().toISOString()
              });
              localStorage.setItem('Lumina_connections', JSON.stringify(connections));
              
              // Redirect to dashboard to see results
              window.location.href = '/dashboard';`;

const replaceSync = `              // Save to local storage
              const saved = localStorage.getItem('vana_connections');
              const connections = saved ? JSON.parse(saved) : [];
              const newConn = {
                sourceId: source.id,
                connectionId: data.connectionId,
                status: 'completed',
                scopesApproved: source.scopes.map(s => s.id)
              };
              connections.push(newConn);
              localStorage.setItem('vana_connections', JSON.stringify(connections));
              
              if (address) {
                await fetch('/api/connections', {
                  method: 'POST',
                  body: JSON.stringify({ wallet: address, connection: newConn })
                });
                await fetch('/api/providers', {
                  method: 'POST',
                  body: JSON.stringify({ wallet_address: address })
                });
              }
              
              // Redirect to dashboard to see results
              window.location.href = '/dashboard';`;

c = c.replace(targetSync, replaceSync);

// Add scopes display
const targetScopes = `<p className="text-sm text-gray-400 line-clamp-2 leading-relaxed flex-grow">{source.description}</p>`;
const replaceScopes = `<p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">{source.description}</p>
        
        {source.scopes && source.scopes.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3 mb-1 flex-grow items-start content-start">
            {source.scopes.map(s => (
              <span key={s.id} className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#111] text-gray-400 border border-[#222]">
                {s.name}
              </span>
            ))}
          </div>
        )}`;

c = c.replace(targetScopes, replaceScopes);

fs.writeFileSync('src/components/SourceCard.tsx', c);
