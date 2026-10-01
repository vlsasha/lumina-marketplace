const fs = require('fs');
let c = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

// Replace standard balance with projected calculated value from the connections
c = c.replace(
  `const displayBalance = balanceData ? Number(formatUnits(balanceData as bigint, MARKETPLACE_CONFIG.paymentToken.decimals)).toFixed(2) : "0.00";`,
  `// Calculate projected earnings based on data quality scores
  const totalQualityScore = connections.reduce((acc, c) => acc + (c.qualityScore || 0), 0);
  const displayBalance = (totalQualityScore * 0.15).toFixed(2);`
);

// Replace standard PoC with calculated total score
c = c.replace(
  `const displayPoC = pocScoreData ? Number(pocScoreData) : 0;`,
  `const displayPoC = pocScoreData ? Number(pocScoreData) : totalQualityScore;`
);

fs.writeFileSync('src/app/dashboard/page.tsx', c);
console.log("Dashboard updated with dynamic calculations.");
