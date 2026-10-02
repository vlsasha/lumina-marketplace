const fs = require('fs');
let file = fs.readFileSync('src/components/DataQueryBuilder.tsx', 'utf8');

file = file.replace(/min="10"/, 'min="1"');
file = file.replace(/max=\{availableInventory > 10 \? availableInventory : 10\}/, 'max={Math.max(1, availableInventory)}');
file = file.replace(/step="10"/, 'step="1"');
file = file.replace(/<span>10<\/span>/, '<span>1</span>');

fs.writeFileSync('src/components/DataQueryBuilder.tsx', file);
