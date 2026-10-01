const fs = require('fs');

let monetize = fs.readFileSync('src/components/MonetizeInfoSection.tsx', 'utf8');
monetize = monetize.replace(
  `<div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">`,
  `<div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-7xl mx-auto">`
);
fs.writeFileSync('src/components/MonetizeInfoSection.tsx', monetize);

let how = fs.readFileSync('src/components/HowItWorks.tsx', 'utf8');
how = how.replace(
  `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">`,
  `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">`
);
fs.writeFileSync('src/components/HowItWorks.tsx', how);
