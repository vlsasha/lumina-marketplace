const fs = require('fs');
let c2 = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

c2 = c2.replace(/key=\{source\.id\} id=\{\`source-\$\{source\.id\}\`\} className="p-5 rounded-xl border border-vana-border bg-vana-card hover:bg-vana-card-hover transition-colors scroll-mt-24" hover:bg-vana-card-hover transition-colors"/g, 
  'key={source.id}\n                    id={`source-${source.id}`}\n                    className="p-5 rounded-xl border border-vana-border bg-vana-card hover:bg-vana-card-hover transition-colors scroll-mt-24"');

fs.writeFileSync('src/app/dashboard/page.tsx', c2);
