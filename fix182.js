const fs = require('fs');

let file = fs.readFileSync('src/components/DataQueryBuilder.tsx', 'utf8');

// Replace Audience Filters
file = file.replace(
  /<h3 className="text-sm font-semibold text-white uppercase tracking-wider">Target Audience<\/h3>[\s\S]*?<\/div>\s*<\/div>\s*<div className="space-y-4 mb-6">/,
  `<h3 className="text-sm font-semibold text-white uppercase tracking-wider">Data Quality Tier</h3>
              
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Select Target Quality</label>
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

            <div className="space-y-4 mb-6">`
);

// Replace Target Audience summary line
file = file.replace(
  /<span className="text-gray-400">Target Audience<\/span>\s*<span className="text-white font-medium">\{ageRange\} yrs \u00b7 \{region\}<\/span>/,
  `<span className="text-gray-400">Quality Tier</span>
                <span className="text-white font-medium">{selectedTier === 'Any' ? 'All Data' : 'Tier ' + selectedTier}</span>`
);

fs.writeFileSync('src/components/DataQueryBuilder.tsx', file);
