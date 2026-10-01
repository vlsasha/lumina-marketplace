const fs = require('fs');
let c = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');

c = c.replace(
  `Connect, validate, and monetize data from Web2 platforms through a unified decentralized API. Built natively on the Vana protocol.`,
  `Connect your digital accounts once, and let your data work for you. Secure, private, and fully decentralized on the Vana protocol.`
);

fs.writeFileSync('src/components/HeroSection.tsx', c);
