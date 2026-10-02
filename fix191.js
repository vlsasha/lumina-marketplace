const fs = require('fs');

let file = fs.readFileSync('src/components/DataQueryBuilder.tsx', 'utf8');

// 1. Fix source counts color and size
file = file.replace(
  /className="flex items-center gap-1 bg-black\/40 px-1\.5 py-0\.5 rounded text-\[9px\] font-mono text-gray-500"/g,
  `className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded text-[11px] font-mono font-bold text-white"`
);

// 2. Fix slider min/max numbers color and size
file = file.replace(
  /<div className="flex justify-between mt-2 text-\[10px\] text-gray-600 font-mono">/g,
  `<div className="flex justify-between mt-2 text-xs text-gray-400 font-mono font-medium">`
);

fs.writeFileSync('src/components/DataQueryBuilder.tsx', file);
