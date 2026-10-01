const fs = require('fs');
let c = fs.readFileSync('src/app/api/connections/route.ts', 'utf8');

c = c.replace(
  'const convos = json?.conversations;',
  "const convos = json?.data?.results?.['chatgpt.conversations']?.data?.data?.conversations || json?.conversations;"
);

fs.writeFileSync('src/app/api/connections/route.ts', c);
