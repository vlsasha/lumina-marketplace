const fs = require('fs');

let code = fs.readFileSync('src/components/SourcesGrid.tsx', 'utf8');

if (!code.includes('const [searchQuery, setSearchQuery] = useState')) {
  // Add state
  code = code.replace(
    "const [activeCategory, setActiveCategory] = useState<string>('All');",
    "const [activeCategory, setActiveCategory] = useState<string>('All');\n  const [searchQuery, setSearchQuery] = useState('');\n  const [sortBy, setSortBy] = useState('status');"
  );

  // Update filtering logic
  const search = `    // Filter sources based on active category
    const filteredSources = activeCategory === 'All' 
      ? availableSources 
      : availableSources.filter(s => s.category === activeCategory);
  
    const sortedFilteredSources = [...filteredSources].sort((a, b) => {
      if (a.status === 'connected' && b.status !== 'connected') return -1;
      if (a.status !== 'connected' && b.status === 'connected') return 1;
      if (a.status === 'connected' && b.status === 'connected') {
         return (b.qualityScore || 0) - (a.qualityScore || 0);
      }
      return 0;
    });`;

  const replace = `    // Advanced filtering
    let filteredSources = availableSources;
    if (activeCategory !== 'All') {
      filteredSources = filteredSources.filter(s => s.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filteredSources = filteredSources.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
    }
  
    const sortedFilteredSources = [...filteredSources].sort((a, b) => {
      if (sortBy === 'status') {
        if (a.status === 'connected' && b.status !== 'connected') return -1;
        if (a.status !== 'connected' && b.status === 'connected') return 1;
        return 0;
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'popular') {
        // Mock popularity sorting for UX demonstration
        return (b.scopes?.length || 0) - (a.scopes?.length || 0);
      }
      return 0;
    });`;

  code = code.replace(search, replace);

  // Inject UI
  const searchUI = `            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center xl:justify-start">`;

  const replaceUI = `            {/* Advanced Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  placeholder={locale === 'ru' ? "Поиск коннекторов..." : "Search data sources..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#111] border border-[#333] rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-vana-primary outline-none transition-colors"
                />
                <svg className="absolute left-3 top-3 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <div className="w-full sm:w-48">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-[#111] border border-[#333] rounded-xl px-4 py-2.5 text-white focus:border-vana-primary outline-none transition-colors appearance-none"
                >
                  <option value="status">{locale === 'ru' ? 'Сначала подключенные' : 'Connected First'}</option>
                  <option value="name">{locale === 'ru' ? 'По алфавиту (А-Я)' : 'Alphabetical (A-Z)'}</option>
                  <option value="popular">{locale === 'ru' ? 'По популярности' : 'By Popularity'}</option>
                </select>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center xl:justify-start">`;

  code = code.replace(searchUI, replaceUI);

  fs.writeFileSync('src/components/SourcesGrid.tsx', code);
}
