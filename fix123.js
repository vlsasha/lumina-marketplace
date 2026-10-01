const fs = require('fs');
let c = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');

c = c.replace(
  `The liquidity layer for <br className="hidden sm:block" />`,
  `Monetize your digital life. <br className="hidden sm:block" />`
);

c = c.replace(
  `user-owned AI data`,
  `Power the future of AI.`
);

fs.writeFileSync('src/components/HeroSection.tsx', c);
