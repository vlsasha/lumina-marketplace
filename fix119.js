const fs = require('fs');
let c = fs.readFileSync('src/components/SourcesGrid.tsx', 'utf8');

c = c.replace(
  `href="https://vana.org/desktop"`,
  `href="https://app.vana.org/download"`
);

fs.writeFileSync('src/components/SourcesGrid.tsx', c);
