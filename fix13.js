const fs = require('fs');
let c = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

c = c.replace(/<button[^>]*title="Disconnect source"[^>]*>\s*Disconnect\s*<\/button>/, '');

fs.writeFileSync('src/app/dashboard/page.tsx', c);
