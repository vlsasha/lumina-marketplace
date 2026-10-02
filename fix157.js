const fs = require('fs');

let file = fs.readFileSync('src/components/DataQueryBuilder.tsx', 'utf8');

// I'll completely remove ALL occurrences of that useEffect
const effectRegex = /  useEffect\(\(\) => \{\n    const query = selectedSources\.length > 0 \? `\?sources=\$\{selectedSources\.join\(\',\)'\}` : '';\n    fetch\(`\/api\/providers\$\{query\}`\)\n      \.then\(res => res\.json\(\)\)\n      \.then\(data => \{\n        setValidProviders\(data\.providers\);\n        setTotalUsersAvailable\(data\.count\); \n      \}\)\n      \.catch\(console\.error\);\n  \}, \[selectedSources\]\);\n/g;

file = file.replace(effectRegex, '');

// Now I will insert ONE instance right after the states
const stateBlock = `  const [volume, setVolume] = useState<number>(1);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [ageRange, setAgeRange] = useState('Any');
  const [region, setRegion] = useState('Global');`;

const newEffect = `

  useEffect(() => {
    const query = selectedSources.length > 0 ? \`?sources=\${selectedSources.join(',')}\` : '';
    fetch(\`/api/providers\${query}\`)
      .then(res => res.json())
      .then(data => {
        setValidProviders(data.providers);
        setTotalUsersAvailable(data.count); 
      })
      .catch(console.error);
  }, [selectedSources]);
`;

file = file.replace(stateBlock, stateBlock + newEffect);

fs.writeFileSync('src/components/DataQueryBuilder.tsx', file);
