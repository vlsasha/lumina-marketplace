const fs = require('fs');

let file = fs.readFileSync('src/components/DataQueryBuilder.tsx', 'utf8');

// 1. Add import for EARNINGS_RATES
file = file.replace(
  `import { DATA_SOURCES } from '@/lib/data-sources';`,
  `import { DATA_SOURCES, EARNINGS_RATES } from '@/lib/data-sources';`
);

// 2. Remove the hardcoded EARNINGS_RATES dictionary
const hardcodedRates = /const EARNINGS_RATES: Record<string, number> = {[\s\S]*?spotify: 0\.004\s*};/;
file = file.replace(hardcodedRates, '');

// 3. Fix costPerUser calculation
file = file.replace(
  `const costPerUser = selectedSources.reduce((sum, id) => sum + (EARNINGS_RATES[id] || 0), 0);`,
  `const costPerUser = selectedSources.reduce((sum, id) => {
    const rate = EARNINGS_RATES.find(r => r.id === id);
    return sum + (rate ? rate.price : 0);
  }, 0);`
);

// 4. Fix mapping logic inside DATA_SOURCES.map
file = file.replace(
  `const price = EARNINGS_RATES[source.id] || 0;`,
  `const rate = EARNINGS_RATES.find(r => r.id === source.id);\n                const price = rate ? rate.price : 0;`
);

// 5. Fix price formatting in UI (from .toFixed(3) to .toFixed(2))
file = file.replace(/\+\$\{price\.toFixed\(3\)\}/g, `+\${price.toFixed(2)}`);
file = file.replace(/\$\{costPerUser\.toFixed\(3\)\}/g, `\${costPerUser.toFixed(2)}`);

fs.writeFileSync('src/components/DataQueryBuilder.tsx', file);
