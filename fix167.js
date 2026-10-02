const fs = require('fs');
let file = fs.readFileSync('src/components/DataQueryBuilder.tsx', 'utf8');

const oldEffect = `  // Fetch individual source counts
  useEffect(() => {
    fetch('/api/inventory/sources')
      .then(res => res.json())
      .then(data => setSourceCounts(data.counts || {}))
      .catch(console.error);
  }, []);`;

const newEffect = `  // Fetch individual source counts
  useEffect(() => {
    const queryParams = new URLSearchParams();
    if (region !== 'Global') queryParams.append('region', region);
    if (ageRange !== 'Any') queryParams.append('age', ageRange);
    
    fetch(\`/api/inventory/sources?\${queryParams.toString()}\`)
      .then(res => res.json())
      .then(data => setSourceCounts(data.counts || {}))
      .catch(console.error);
  }, [region, ageRange]);`;

file = file.replace(oldEffect, newEffect);

fs.writeFileSync('src/components/DataQueryBuilder.tsx', file);
