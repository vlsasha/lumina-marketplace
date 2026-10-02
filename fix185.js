const fs = require('fs');

let file = fs.readFileSync('src/components/DataQueryBuilder.tsx', 'utf8');

// Replace using regex that ignores the weird dot character
file = file.replace(
  /<span className="text-gray-400">Target Audience<\/span>\s*<span className="text-white font-medium">\{ageRange\} yrs . \{region\}<\/span>/,
  `<span className="text-gray-400">Quality Tier</span>\n                <span className="text-white font-medium">{selectedTier === 'Any' ? 'All Data' : 'Tier ' + selectedTier}</span>`
);

fs.writeFileSync('src/components/DataQueryBuilder.tsx', file);
