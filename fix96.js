const fs = require('fs');
let c = fs.readFileSync('src/components/SourcesGrid.tsx', 'utf8');

c = c.replace(
  `const availableSources = DATA_SOURCES.map(source => {
    const conn = connections.find(c => c.sourceId === source.id);
    if (conn && (conn.status === 'completed' || conn.status === 'approved')) {
      return { ...source, status: 'connected' as const };
    }
    return source;
  });`,
  `const availableSources = DATA_SOURCES.map(source => {
    const conn = connections.find(c => c.sourceId === source.source || c.sourceId === source.id);
    if (conn && (conn.status === 'completed' || conn.status === 'approved')) {
      return { ...source, status: 'connected' as const, qualityScore: conn.qualityScore };
    }
    return { ...source, qualityScore: conn?.qualityScore };
  });`
);

c = c.replace(
  `const filteredSources = activeCategory === 'All' 
    ? availableSources 
    : availableSources.filter(s => s.category === activeCategory);`,
  `const filteredSources = activeCategory === 'All' 
    ? availableSources 
    : availableSources.filter(s => s.category === activeCategory);

  const sortedFilteredSources = [...filteredSources].sort((a, b) => {
    if (a.status === 'connected' && b.status !== 'connected') return -1;
    if (a.status !== 'connected' && b.status === 'connected') return 1;
    if (a.status === 'connected' && b.status === 'connected') {
       return (b.qualityScore || 0) - (a.qualityScore || 0);
    }
    return 0;
  });`
);

c = c.replace(
  `{filteredSources.map((source) => (`,
  `{sortedFilteredSources.map((source) => (`
);

fs.writeFileSync('src/components/SourcesGrid.tsx', c);
