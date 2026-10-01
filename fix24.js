const fs = require('fs');

let c = fs.readFileSync('src/app/api/connections/route.ts', 'utf8');
if (!c.includes('export const dynamic')) {
  c = "export const dynamic = 'force-dynamic';\n" + c;
}
fs.writeFileSync('src/app/api/connections/route.ts', c);

let d = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');
const target = `{conn.qualityScore !== undefined && (`;
const replace = `{conn.qualityScore != null && (`;
d = d.replace(target, replace);
fs.writeFileSync('src/app/dashboard/page.tsx', d);
