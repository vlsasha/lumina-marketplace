const fs = require('fs');
let c = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');

c = c.replace(
  `Monetize your digital life. <br className="hidden sm:block" />`,
  `Turn your personal data <br className="hidden sm:block" />`
);

c = c.replace(
  `<span className="text-transparent bg-clip-text bg-gradient-to-r from-vana-primary via-[#b9ff42] to-[#7fdb00]">Turn your data into a real asset.</span>`,
  `<span className="text-transparent bg-clip-text bg-gradient-to-r from-vana-primary via-[#b9ff42] to-[#7fdb00]">into a valuable asset</span>`
);

fs.writeFileSync('src/components/HeroSection.tsx', c);
