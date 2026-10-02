const fs = require('fs');

let file = fs.readFileSync('src/components/DataQueryBuilder.tsx', 'utf8');

// Fix useEffect
file = file.replace(
  /useEffect\(\(\) => \{\s*if \(volume > availableInventory\) \{\s*setVolume\(Math\.max\(1, availableInventory\)\);\s*\}\s*\}, \[availableInventory, volume\]\);/,
  `useEffect(() => {
    if (volume > availableInventory) {
      setVolume(Math.max(0, availableInventory));
    }
  }, [availableInventory, volume]);`
);

// Fix slider attributes
file = file.replace(
  /type="range"[\s\S]*?min="1"[\s\S]*?max=\{Math\.max\(1, availableInventory\)\}/,
  `type="range" \n                  min="0" \n                  max={Math.max(0, availableInventory)}`
);

// Disable if 0
file = file.replace(
  /className="w-full h-1\.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-vana-primary"\s*\/>/,
  `className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-vana-primary"
                  disabled={availableInventory === 0}
                />`
);

// Fix labels
file = file.replace(
  /<div className="flex justify-between mt-2 text-\[10px\] text-gray-600 font-mono">\s*<span>1<\/span>/,
  `<div className="flex justify-between mt-2 text-[10px] text-gray-600 font-mono">
                  <span>0</span>`
);

fs.writeFileSync('src/components/DataQueryBuilder.tsx', file);
