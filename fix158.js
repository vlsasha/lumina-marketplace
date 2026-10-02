const fs = require('fs');

let file = fs.readFileSync('src/components/DataQueryBuilder.tsx', 'utf8');

// The block to remove is exactly this:
const blockToRemove = `  useEffect(() => {
    const query = selectedSources.length > 0 ? \`?sources=\${selectedSources.join(',')}\` : '';
    fetch(\`/api/providers\${query}\`)
      .then(res => res.json())
      .then(data => {
        setValidProviders(data.providers);
        setTotalUsersAvailable(data.count); 
      })
      .catch(console.error);
  }, [selectedSources]);`;

// Replace the first occurrence only
file = file.replace(blockToRemove, '');

fs.writeFileSync('src/components/DataQueryBuilder.tsx', file);
