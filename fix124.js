const fs = require('fs');
let c = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');

c = c.replace(
  `Power the future of AI.`,
  `Turn your data into a real asset.`
);

fs.writeFileSync('src/components/HeroSection.tsx', c);
