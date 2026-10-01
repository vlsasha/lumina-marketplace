const fs = require('fs');
let c = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

c = c.replace('scopesApproved: string[];', 'scopesApproved: string[];\n  qualityScore?: number;');

fs.writeFileSync('src/app/dashboard/page.tsx', c);
