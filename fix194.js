const fs = require('fs');

let file = fs.readFileSync('src/components/DataQueryBuilder.tsx', 'utf8');

// 1. Add multiplier calculation
file = file.replace(
  /const costPerUser = selectedSource \? \(EARNINGS_RATES\.find\(r => r\.id === selectedSource\)\?\.price \|\| 0\) : 0;/,
  `const basePrice = selectedSource ? (EARNINGS_RATES.find(r => r.id === selectedSource)?.price || 0) : 0;
  
  const getTierMultiplier = (tier: string) => {
    if (tier === 'A') return 2.0; // Premium (+100%)
    if (tier === 'B') return 1.5; // High (+50%)
    if (tier === 'D') return 0.5; // Basic (-50%)
    return 1.0; // Standard / Any
  };
  
  const tierMultiplier = getTierMultiplier(selectedTier);
  const costPerDataset = basePrice * tierMultiplier;`
);

// 2. Change costPerUser variable everywhere below it
file = file.replace(/costPerUser/g, 'costPerDataset');

// 3. Update Order Summary UI to show the multiplier
const orderSummaryRegex = /<div className="flex justify-between items-center text-sm border-t border-\[\#222\] pt-4">\s*<span className="text-gray-400">Cost per Dataset<\/span>\s*<span className="text-white font-mono">\$[^<]+<\/span>\s*<\/div>/;

const newOrderSummary = `
              <div className="flex justify-between items-center text-sm border-t border-[#222] pt-4 mt-4">
                <span className="text-gray-400">Base Price</span>
                <span className="text-white font-mono">\${basePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-3">
                <span className="text-gray-400">Quality Multiplier</span>
                <span className={\`font-mono font-medium \${tierMultiplier > 1 ? 'text-vana-green' : tierMultiplier < 1 ? 'text-red-400' : 'text-gray-400'}\`}>
                  x{tierMultiplier.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm mt-3">
                <span className="text-gray-400">Final Cost per Dataset</span>
                <span className="text-white font-mono">\${costPerDataset.toFixed(2)}</span>
              </div>
`;

file = file.replace(orderSummaryRegex, newOrderSummary);

fs.writeFileSync('src/components/DataQueryBuilder.tsx', file);
