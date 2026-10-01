const fs = require('fs');

// 1. Update SourceCard.tsx
let c1 = fs.readFileSync('src/components/SourceCard.tsx', 'utf8');
c1 = c1.replace(
  `window.location.href = '/dashboard';`,
  `window.location.href = '/dashboard#source-' + source.id;`
);
c1 = c1.replace(
  `<a href="/dashboard" className="`,
  `<a href={\`/dashboard#source-\${source.id}\`} className="`
);
fs.writeFileSync('src/components/SourceCard.tsx', c1);

// 2. Update dashboard/page.tsx
let c2 = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');
c2 = c2.replace(
  `                    <div\r\n                      key={source.id}\r\n                      className="p-5 rounded-xl border border-vana-border bg-vana-card hover:bg-vana-card-hover transition-colors"\r\n                    >`,
  `                    <div\r\n                      key={source.id}\r\n                      id={\`source-\${source.id}\`}\r\n                      className="p-5 rounded-xl border border-vana-border bg-vana-card hover:bg-vana-card-hover transition-colors scroll-mt-24"\r\n                    >`
);
// Fallback if \r\n fails
c2 = c2.replace(
  `                    <div\n                      key={source.id}\n                      className="p-5 rounded-xl border border-vana-border bg-vana-card hover:bg-vana-card-hover transition-colors"\n                    >`,
  `                    <div\n                      key={source.id}\n                      id={\`source-\${source.id}\`}\n                      className="p-5 rounded-xl border border-vana-border bg-vana-card hover:bg-vana-card-hover transition-colors scroll-mt-24"\n                    >`
);
fs.writeFileSync('src/app/dashboard/page.tsx', c2);

