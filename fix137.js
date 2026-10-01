const fs = require('fs');

let c = fs.readFileSync('src/components/SourcesGrid.tsx', 'utf8');
c = c.replace(
  `className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8"`,
  `className="w-full 2xl:px-12 mx-auto px-4 sm:px-6 lg:px-8"`
);
fs.writeFileSync('src/components/SourcesGrid.tsx', c);
