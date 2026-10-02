const fs = require('fs');
let file = fs.readFileSync('src/app/api/providers/route.ts', 'utf8');

file = file.replace(/\\\`/g, '\`');
file = file.replace(/\\\$/g, '$');

fs.writeFileSync('src/app/api/providers/route.ts', file);
