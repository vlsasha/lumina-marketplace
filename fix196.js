const fs = require('fs');

let file = fs.readFileSync('src/components/DataQueryBuilder.tsx', 'utf8');

// Add key to range input to force browser repaint when max changes
file = file.replace(
  /<input\s*type="range"\s*min="0"\s*max=\{Math\.max\(0, availableInventory\)\}/,
  `<input 
                  key={\`slider-\${availableInventory}\`}
                  type="range" 
                  min="0" 
                  max={Math.max(0, availableInventory)}`
);

fs.writeFileSync('src/components/DataQueryBuilder.tsx', file);
