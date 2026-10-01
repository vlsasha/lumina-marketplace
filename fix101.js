const fs = require('fs');
let c2 = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

const target = `<div
                      key={source.id}
                      className="p-5 rounded-xl border border-vana-border bg-vana-card hover:bg-vana-card-hover transition-colors"
                    >`;

const targetCRLF = `<div\r\n                      key={source.id}\r\n                      className="p-5 rounded-xl border border-vana-border bg-vana-card hover:bg-vana-card-hover transition-colors"\r\n                    >`;

const replace = `<div
                      key={source.id}
                      id={\`source-\${source.id}\`}
                      className="p-5 rounded-xl border border-vana-border bg-vana-card hover:bg-vana-card-hover transition-colors scroll-mt-24"
                    >`;

if (c2.includes(target)) c2 = c2.replace(target, replace);
else if (c2.includes(targetCRLF)) c2 = c2.replace(targetCRLF, replace);
else {
  // regex fallback
  c2 = c2.replace(/key=\{source\.id\}\s*className="p-5 rounded-xl border border-vana-border bg-vana-card/g, 'key={source.id} id={`source-${source.id}`} className="p-5 rounded-xl border border-vana-border bg-vana-card hover:bg-vana-card-hover transition-colors scroll-mt-24"');
}

fs.writeFileSync('src/app/dashboard/page.tsx', c2);
