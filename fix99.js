const fs = require('fs');
let c = fs.readFileSync('src/components/SourcesGrid.tsx', 'utf8');

c = c.replace(
  'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6',
  'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-5 sm:gap-6'
);

fs.writeFileSync('src/components/SourcesGrid.tsx', c);
