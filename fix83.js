const fs = require('fs');
let c = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

c = c.replace(
  `  // Calculate projected earnings based on data quality scores
  const totalQualityScore = connections.reduce((acc, c) => acc + (c.qualityScore || 0), 0);
  const displayBalance = (totalQualityScore * 0.15).toFixed(2);
  const displayPoC = pocScoreData ? Number(pocScoreData) : totalQualityScore;
  const [connections, setConnections] = useState<ConnectedSource[]>([]);`,
  `  const [connections, setConnections] = useState<ConnectedSource[]>([]);
  // Calculate projected earnings based on data quality scores
  const totalQualityScore = connections.reduce((acc, c) => acc + (c.qualityScore || 0), 0);
  const displayBalance = (totalQualityScore * 0.15).toFixed(2);
  const displayPoC = pocScoreData ? Number(pocScoreData) : totalQualityScore;`
);

fs.writeFileSync('src/app/dashboard/page.tsx', c);
