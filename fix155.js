const fs = require('fs');
let file = fs.readFileSync('src/components/DataQueryBuilder.tsx', 'utf8');

// Use regex to replace useEffect
const oldUseEffect = /useEffect\(\(\) => \{\s*fetch\('\/api\/providers'\)[\s\S]*?\}, \[\]\);/;
const newUseEffect = `useEffect(() => {
    const query = selectedSources.length > 0 ? \`?sources=\${selectedSources.join(',')}\` : '';
    fetch(\`/api/providers\${query}\`)
      .then(res => res.json())
      .then(data => {
        setValidProviders(data.providers);
        setTotalUsersAvailable(data.count); 
      })
      .catch(console.error);
  }, [selectedSources]);`;
file = file.replace(oldUseEffect, newUseEffect);

// Use regex to replace calculateInventory
const oldCalc = /\/\/ Simulate dynamic database inventory based on filters[\s\S]*?const availableInventory = calculateInventory\(\);/;
const newCalc = `// Real inventory from database
  const availableInventory = totalUsersAvailable;`;
file = file.replace(oldCalc, newCalc);

fs.writeFileSync('src/components/DataQueryBuilder.tsx', file);
