const fs = require('fs');

let uiFile = fs.readFileSync('src/components/DataQueryBuilder.tsx', 'utf8');

// 1. Update State
uiFile = uiFile.replace(
  /const \[ageRange, setAgeRange\] = useState\('Any'\);\n  const \[region, setRegion\] = useState\('Global'\);/,
  `const [selectedTier, setSelectedTier] = useState('Any');`
);

// 2. Update Fetch Effects
uiFile = uiFile.replace(
  /if \(region !== 'Global'\) queryParams\.append\('region', region\);\n    if \(ageRange !== 'Any'\) queryParams\.append\('age', ageRange\);/g,
  `if (selectedTier !== 'Any') queryParams.append('tier', selectedTier);`
);

uiFile = uiFile.replace(/region, ageRange/g, `selectedTier`);

// 3. Update the UI section
const oldUiSection = `<div className="mb-8">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Target Audience</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Age Range</label>
                  <select 
                    value={ageRange}
                    onChange={(e) => setAgeRange(e.target.value)}
                    className="w-full bg-black border border-[#333] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-vana-primary transition-colors appearance-none"
                  >
                    <option value="18-24">18-24</option>
                    <option value="25-31">25-31</option>
                    <option value="32-38">32-38</option>
                    <option value="39-45">39-45</option>
                    <option value="45+">45+</option>
                    <option value="Any">Any Age</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Region</label>
                  <select 
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full bg-black border border-[#333] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-vana-primary transition-colors appearance-none"
                  >
                    <option value="Global">Global</option>
                    <option value="US">North America</option>
                    <option value="EU">Europe</option>
                    <option value="Asia">Asia</option>
                  </select>
                </div>
              </div>
            </div>`;

const newUiSection = `<div className="mb-8">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Data Quality Tier</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Select Target Quality</label>
                  <select 
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(e.target.value)}
                    className="w-full bg-black border border-[#333] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-vana-primary transition-colors appearance-none"
                  >
                    <option value="Any">Any Tier (All Data)</option>
                    <option value="A">Tier A (Premium: >80 pts)</option>
                    <option value="B">Tier B (High: 50-79 pts)</option>
                    <option value="C">Tier C (Standard: 20-49 pts)</option>
                    <option value="D">Tier D (Basic: <20 pts)</option>
                  </select>
                </div>
              </div>
            </div>`;

uiFile = uiFile.replace(oldUiSection, newUiSection);

fs.writeFileSync('src/components/DataQueryBuilder.tsx', uiFile);
