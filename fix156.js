const fs = require('fs');

let file = fs.readFileSync('src/components/DataQueryBuilder.tsx', 'utf8');

const useEffectBlock = `  useEffect(() => {
    const query = selectedSources.length > 0 ? \\\`?sources=\\\${selectedSources.join(',')}\\\` : '';
    fetch(\\\`/api/providers\\\${query}\\\`)
      .then(res => res.json())
      .then(data => {
        setValidProviders(data.providers);
        setTotalUsersAvailable(data.count); 
      })
      .catch(console.error);
  }, [selectedSources]);`;

// Find it using a literal replace (escaping backticks and dollar signs is annoying in string replace, let's use regex or slice)
const match = file.match(/useEffect\(\(\) => \{[\s\S]*?\}, \[selectedSources\]\);/);

if (match) {
  const extracted = match[0];
  file = file.replace(extracted + '\n', '');
  
  // Insert it after state declarations
  file = file.replace(
    `const [region, setRegion] = useState('Global');`,
    `const [region, setRegion] = useState('Global');\n\n  ${extracted}`
  );
  
  fs.writeFileSync('src/components/DataQueryBuilder.tsx', file);
} else {
  console.log("Could not match useEffect block");
}
