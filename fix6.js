const fs = require('fs');
let c = fs.readFileSync('src/components/DataQueryBuilder.tsx', 'utf8');

c = c.replace(/return Math\.floor\(base \* sourcePenalty\);/, `const rawInventory = Math.floor(base * sourcePenalty);\n    return base > 0 ? Math.max(1, rawInventory) : 0;`);

fs.writeFileSync('src/components/DataQueryBuilder.tsx', c);

let api = fs.readFileSync('src/app/api/providers/route.ts', 'utf8');
if (!api.includes('force-dynamic')) {
  api = `export const dynamic = 'force-dynamic';\n` + api;
  fs.writeFileSync('src/app/api/providers/route.ts', api);
}
