const fs = require('fs');
let file = fs.readFileSync('src/components/DataQueryBuilder.tsx', 'utf8');

// 1. Add state for sourceCounts
file = file.replace(
  `const [totalUsersAvailable, setTotalUsersAvailable] = useState(0);`,
  `const [totalUsersAvailable, setTotalUsersAvailable] = useState(0);\n  const [sourceCounts, setSourceCounts] = useState<Record<string, number>>({});`
);

// 2. Fetch sourceCounts on mount
const effectToReplace = `  useEffect(() => {
    const query = selectedSources.length > 0 ? \`?sources=\${selectedSources.join(',')}\` : '';
    fetch(\`/api/providers\${query}\`)
      .then(res => res.json())
      .then(data => {
        setValidProviders(data.providers);
        setTotalUsersAvailable(data.count); 
      })
      .catch(console.error);
  }, [selectedSources]);`;

const newEffect = `  useEffect(() => {
    const query = selectedSources.length > 0 ? \`?sources=\${selectedSources.join(',')}\` : '';
    fetch(\`/api/providers\${query}\`)
      .then(res => res.json())
      .then(data => {
        setValidProviders(data.providers);
        setTotalUsersAvailable(data.count); 
      })
      .catch(console.error);
  }, [selectedSources]);

  // Fetch individual source counts
  useEffect(() => {
    fetch('/api/inventory/sources')
      .then(res => res.json())
      .then(data => setSourceCounts(data.counts || {}))
      .catch(console.error);
  }, []);`;

file = file.replace(effectToReplace, newEffect);

// 3. Render count on cards
const cardContentToReplace = `                    <div className="min-w-0 flex-1">
                      <div className={\`text-xs font-semibold truncate \${isSelected ? 'text-white' : 'text-gray-400'}\`}>
                        {source.name}
                      </div>
                      <div className={\`text-[10px] font-mono \${isSelected ? 'text-vana-primary' : 'text-gray-600'}\`}>
                        +\${price.toFixed(2)}
                      </div>
                    </div>`;

const newCardContent = `                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-center gap-2">
                        <div className={\`text-xs font-semibold truncate \${isSelected ? 'text-white' : 'text-gray-400'}\`}>
                          {source.name}
                        </div>
                        <div className="flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded text-[9px] font-mono text-gray-500">
                          <svg className="w-2.5 h-2.5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" fillRule="evenodd" /></svg>
                          {sourceCounts[source.id] || 0}
                        </div>
                      </div>
                      <div className={\`text-[10px] font-mono mt-0.5 \${isSelected ? 'text-vana-primary' : 'text-gray-500'}\`}>
                        +\${price.toFixed(2)}
                      </div>
                    </div>`;

file = file.replace(cardContentToReplace, newCardContent);

fs.writeFileSync('src/components/DataQueryBuilder.tsx', file);
