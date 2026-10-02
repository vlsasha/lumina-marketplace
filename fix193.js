const fs = require('fs');

let file = fs.readFileSync('src/components/DataQueryBuilder.tsx', 'utf8');

file = file.replace(
  /const \[selectedSources, setSelectedSources\] = useState<string\[\]>\(\[\]\);/,
  `const [selectedSource, setSelectedSource] = useState<string | null>(null);`
);

file = file.replace(
  /if \(selectedSources\.length > 0\) queryParams\.append\('sources', selectedSources\.join\(','\)\);/g,
  `if (selectedSource) queryParams.append('sources', selectedSource);`
);

file = file.replace(
  /const handleSourceToggle = \(id: string\) => \{\s*setSelectedSources\(prev =>\s*prev\.includes\(id\) \? prev\.filter\(s => s !== id\) : \[\.\.\.prev, id\]\s*\);\s*\};/m,
  `const handleSourceToggle = (id: string) => {\n    setSelectedSource(prev => prev === id ? null : id);\n  };`
);

file = file.replace(
  /const costPerUser = selectedSources\.reduce\(\(sum, id\) => \{\s*const rate = EARNINGS_RATES\.find\(r => r\.id === id\);\s*return sum \+ \(rate \? rate\.price : 0\);\s*\}, 0\);/m,
  `const costPerUser = selectedSource ? (EARNINGS_RATES.find(r => r.id === selectedSource)?.price || 0) : 0;`
);

file = file.replace(
  /if \(selectedSources\.length === 0\) \{\s*alert\('Please select at least one data source to acquire\.'\);\s*return;\s*\}/m,
  `if (!selectedSource) {\n      alert('Please select a data source to acquire.');\n      return;\n    }`
);

file = file.replace(
  /<span className="text-xs text-gray-500">\{selectedSources\.length\} selected<\/span>/,
  `<span className="text-xs text-gray-500">{selectedSource ? '1 selected' : '0 selected'}</span>`
);

file = file.replace(
  /const isSelected = selectedSources\.includes\(source\.id\);/g,
  `const isSelected = selectedSource === source.id;`
);

file = file.replace(
  /<span className="text-white font-medium">\{selectedSources\.length\} sources<\/span>/,
  `<span className="text-white font-medium">{selectedSource ? DATA_SOURCES.find(s=>s.id===selectedSource)?.name : 'None'}</span>`
);

// One more check for 'Selected Sources' label
file = file.replace(
  /<span className="text-gray-400">Selected Sources<\/span>/,
  `<span className="text-gray-400">Selected Source</span>`
);

// Another check for 'Required Data Sources' section header - maybe make it singular?
// <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Required Data Sources</h3>
file = file.replace(
  /<h3 className="text-sm font-semibold text-white uppercase tracking-wider">Required Data Sources<\/h3>/,
  `<h3 className="text-sm font-semibold text-white uppercase tracking-wider">Required Data Source</h3>`
);

fs.writeFileSync('src/components/DataQueryBuilder.tsx', file);
