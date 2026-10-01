const fs = require('fs');
let c = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

const startStr = `<button
                                onClick={() => setConnections(prev => prev.filter(c => c.connectionId !== conn.connectionId))}
                                className="px-3 py-2 text-xs rounded-lg border border-vana-border hover:bg-vana-red/10 text-vana-text-muted hover:text-vana-red transition-colors"
                                title="Disconnect source"
                              >
                                Disconnect
                              </button>`;

if (c.includes(startStr)) {
  c = c.replace(startStr, '');
} else {
  console.log("Could not find exact string. Here is the block:");
  const idx = c.indexOf('Disconnect');
  console.log(c.substring(idx - 200, idx + 200));
}

fs.writeFileSync('src/app/dashboard/page.tsx', c);
