const fs = require('fs');
let file = fs.readFileSync('src/components/DataQueryBuilder.tsx', 'utf8');

// The first fetch in DataQueryBuilder
const firstEffect = `  useEffect(() => {
    const query = selectedSources.length > 0 ? \`?sources=\${selectedSources.join(',')}\` : '';
    fetch(\`/api/providers\${query}\`)`;

const firstEffectReplace = `  useEffect(() => {
    const queryParams = new URLSearchParams();
    if (selectedSources.length > 0) queryParams.append('sources', selectedSources.join(','));
    if (region !== 'Global') queryParams.append('region', region);
    if (ageRange !== 'Any') queryParams.append('age', ageRange);
    
    fetch(\`/api/providers?\${queryParams.toString()}\`)`;

file = file.replace(firstEffect, firstEffectReplace);
// add region and ageRange to dependency array
file = file.replace(`}, [selectedSources]);`, `}, [selectedSources, region, ageRange]);`);

// The handlePurchase fetch
const purchaseFetch = `      const query = selectedSources.length > 0 ? \`?sources=\${selectedSources.join(',')}\` : '';
      const response = await fetch(\`/api/providers\${query}\`);`;

const purchaseFetchReplace = `      const queryParams = new URLSearchParams();
      if (selectedSources.length > 0) queryParams.append('sources', selectedSources.join(','));
      if (region !== 'Global') queryParams.append('region', region);
      if (ageRange !== 'Any') queryParams.append('age', ageRange);
      const response = await fetch(\`/api/providers?\${queryParams.toString()}\`);`;

file = file.replace(purchaseFetch, purchaseFetchReplace);

fs.writeFileSync('src/components/DataQueryBuilder.tsx', file);
