const fs = require('fs');
let c = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

c = c.replace(
  /<p className="text-sm text-vana-text-muted mt-2 max-w-lg">\s*Your datasets passed the Proof of Contribution check with high authenticity\.\s*Buyers accessed your data 53 times this month\.\s*<\/p>/m,
  ''
);

fs.writeFileSync('src/app/dashboard/page.tsx', c);
