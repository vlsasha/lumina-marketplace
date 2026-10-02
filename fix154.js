const fs = require('fs');
let file = fs.readFileSync('src/components/DataQueryBuilder.tsx', 'utf8');

// 1. Update the useEffect that fetches providers
const oldUseEffect = `  useEffect(() => {
    fetch('/api/providers')
      .then(res => res.json())
      .then(data => {
        setValidProviders(data.providers);
        // If it's just the Treasury wallet (1), consider real users as 0 for display
        setTotalUsersAvailable(data.count); 
      })
      .catch(console.error);
  }, []);`;

const newUseEffect = `  useEffect(() => {
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

// 2. Remove fake inventory logic
const oldCalculateInventory = `  // Simulate dynamic database inventory based on filters
  const calculateInventory = () => {
    let base = totalUsersAvailable; // Base total users from database
    
    // Region penalty
    if (region !== 'Global') base = base * 0.35;
    
    // Age penalty
    if (ageRange !== 'Any') base = base * 0.45;

    // Sources penalty (intersection logic: more sources = fewer people who have ALL of them)
    // E.g. finding someone with Oura AND Github AND Strava is rare
    const sourcePenalty = Math.pow(0.8, selectedSources.length);
    
    const rawInventory = Math.floor(base * sourcePenalty);
    return base > 0 ? Math.max(1, rawInventory) : 0;
  };

  const availableInventory = calculateInventory();`;

const newCalculateInventory = `  // Real inventory from database
  const availableInventory = totalUsersAvailable;`;

file = file.replace(oldCalculateInventory, newCalculateInventory);

// 3. Update handlePurchase fetch
file = file.replace(
  `const response = await fetch('/api/providers');`,
  `const query = selectedSources.length > 0 ? \`?sources=\${selectedSources.join(',')}\` : '';\n      const response = await fetch(\`/api/providers\${query}\`);`
);

fs.writeFileSync('src/components/DataQueryBuilder.tsx', file);
