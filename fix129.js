const fs = require('fs');

let c = fs.readFileSync('src/components/MonetizeInfoSection.tsx', 'utf8');
c = c.replace(`bg-[#0a0a0a]`, `bg-transparent`);
fs.writeFileSync('src/components/MonetizeInfoSection.tsx', c);
