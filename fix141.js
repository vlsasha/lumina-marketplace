const fs = require('fs');

let page = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

// 1. Import EARNINGS_RATES
page = page.replace(
  `import { DATA_SOURCES } from '@/lib/data-sources';`,
  `import { DATA_SOURCES, EARNINGS_RATES } from '@/lib/data-sources';`
);

// 2. Fix the global displayBalance
// We need to calculate based on connected sources and their prices
const oldLogic = `const totalQualityScore = connections.reduce((acc, c) => acc + (c.qualityScore || 0), 0);
  const displayBalance = (totalQualityScore * 0.15).toFixed(2);`;

const newLogic = `const totalQualityScore = connections.reduce((acc, c) => acc + (c.qualityScore || 0), 0);
  
  // Calculate earnings based on specific sources and their quality score multiplier (Score / 100)
  const totalEarnings = connections.reduce((acc, conn) => {
    if (conn.status !== 'approved' && conn.status !== 'completed') return acc;
    const rate = EARNINGS_RATES.find(r => r.id === conn.sourceId)?.price || 0;
    const multiplier = (conn.qualityScore || 0) / 100;
    return acc + (rate * multiplier);
  }, 0);
  
  const displayBalance = totalEarnings.toFixed(2);`;

page = page.replace(oldLogic, newLogic);

// 3. Fix the individual card earnings "+$12.00 USDC"
// Search for `(conn.qualityScore * 0.15).toFixed(2)` and replace with the new dynamic logic
// To make it easy, we can calculate it right there in the JSX
page = page.replace(
  `+$\{(conn.qualityScore * 0.15).toFixed(2)} USDC`,
  `+$\{((EARNINGS_RATES.find(r => r.id === conn.sourceId)?.price || 0) * (conn.qualityScore / 100)).toFixed(2)} USDC`
);

fs.writeFileSync('src/app/dashboard/page.tsx', page);
