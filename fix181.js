const fs = require('fs');

let file = fs.readFileSync('src/components/DataQueryBuilder.tsx', 'utf8');

// Replace both useState declarations with just selectedTier
file = file.replace(
  /const \[ageRange, setAgeRange\] = useState\('Any'\);[\s\S]*?const \[region, setRegion\] = useState\('Global'\);/,
  `const [selectedTier, setSelectedTier] = useState('Any');`
);

// Also check handlePurchase if it still uses region/age
file = file.replace(
  /if \(region !== 'Global'\) queryParams\.append\('region', region\);[\s\S]*?if \(ageRange !== 'Any'\) queryParams\.append\('age', ageRange\);/g,
  `if (selectedTier !== 'Any') queryParams.append('tier', selectedTier);`
);

fs.writeFileSync('src/components/DataQueryBuilder.tsx', file);
