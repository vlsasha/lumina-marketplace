const fs = require('fs');
let c = fs.readFileSync('src/components/SourcesGrid.tsx', 'utf8');

c = c.replace(/return \(\s+return \(/g, 'return (');

fs.writeFileSync('src/components/SourcesGrid.tsx', c);
