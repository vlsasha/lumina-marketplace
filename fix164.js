const fs = require('fs');
let file = fs.readFileSync('src/components/DataQueryBuilder.tsx', 'utf8');

file = file.replace(
  `{availableInventory.toLocaleString()} Profiles Available`,
  `{availableInventory.toLocaleString()} Datasets Available`
);

fs.writeFileSync('src/components/DataQueryBuilder.tsx', file);
