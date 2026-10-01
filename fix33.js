const fs = require('fs');
let c = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

c = c.replace(
  'fetch(/api/connections?wallet=&t=)',
  'fetch(`/api/connections?wallet=${address}&t=${Date.now()}`)'
);

fs.writeFileSync('src/app/dashboard/page.tsx', c);
