const fs = require('fs');
let c = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

const str = `                              <button
                                onClick={() => setConnections(prev => prev.filter(c => c.connectionId !== conn.connectionId))}
                                className="px-3 py-2 text-xs rounded-lg border border-vana-border hover:bg-vana-red/10 text-vana-text-muted hover:text-vana-red transition-colors"
                                title="Disconnect source"
                              >
                                Disconnect
                              </button>`;

if (c.includes(str)) {
  c = c.replace(str, '');
} else {
  const t = c.indexOf('Disconnect source');
  const start = c.lastIndexOf('<button', t);
  const end = c.indexOf('</button>', t) + 9;
  c = c.substring(0, start) + c.substring(end);
}

fs.writeFileSync('src/app/dashboard/page.tsx', c);
