const fs = require('fs');
let c = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');
c = c.replace(`overflow-hidden transparent"`, `overflow-hidden bg-transparent"`);
fs.writeFileSync('src/components/HeroSection.tsx', c);
