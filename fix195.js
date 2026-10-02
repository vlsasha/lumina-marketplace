const fs = require('fs');

let file = fs.readFileSync('src/components/DataQueryBuilder.tsx', 'utf8');

// Replace multiplier logic
const oldMultiplierLogic = /const getTierMultiplier = \(tier: string\) => \{\s*if \(tier === 'A'\) return 2\.0; \/\/ Premium \(\+100\%\)\s*if \(tier === 'B'\) return 1\.5; \/\/ High \(\+50\%\)\s*if \(tier === 'D'\) return 0\.5; \/\/ Basic \(-50\%\)\s*return 1\.0; \/\/ Standard \/ Any\s*\};/;

const newMultiplierLogic = `const getTierMultiplier = (tier: string) => {
    if (tier === 'A') return 1.0; // Premium (100% of max price)
    if (tier === 'B') return 0.5; // High (50% of max price)
    if (tier === 'C') return 0.2; // Standard (20% of max price)
    if (tier === 'D') return 0.05; // Basic (5% of max price)
    return 0.5; // Any (Blended average)
  };`;

file = file.replace(oldMultiplierLogic, newMultiplierLogic);

// Replace UI multiplier display
const oldUI = /<span className=\{\`font-mono font-medium \$\{tierMultiplier > 1 \? 'text-vana-green' : tierMultiplier < 1 \? 'text-red-400' : 'text-gray-400'\}\`\}>\s*x\{tierMultiplier\.toFixed\(1\)\}\s*<\/span>/;

const newUI = `<span className={\`font-mono font-medium \${tierMultiplier === 1.0 ? 'text-vana-green' : 'text-gray-400'}\`}>
                  x{tierMultiplier.toFixed(2)}
                </span>`;

file = file.replace(oldUI, newUI);

// Wait, replacing 'Base Price' with 'Max Price (Tier A)' to be clearer?
// Actually 'Base Price' is fine. Or 'Premium Price'.
file = file.replace(
  /<span className="text-gray-400">Base Price<\/span>/,
  `<span className="text-gray-400">Premium Price (Tier A)</span>`
);

fs.writeFileSync('src/components/DataQueryBuilder.tsx', file);
