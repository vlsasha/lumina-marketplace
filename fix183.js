const fs = require('fs');

let file = fs.readFileSync('src/components/DataQueryBuilder.tsx', 'utf8');

// Replace the UI section using string splitting
const startMarker = '{/* Audience Filters */}';
const endMarker = '<div className="space-y-4 mb-6">';

const startIndex = file.indexOf(startMarker);
const endIndex = file.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const before = file.substring(0, startIndex);
  const after = file.substring(endIndex);
  
  const replacement = `{/* Quality Tier Filter */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Data Quality Tier</h3>
                
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
              
              `;
  file = before + replacement + after;
}

// Second replacement for the summary
const summaryStartMarker = '<span className="text-gray-400">Target Audience</span>';
const summaryStartIndex = file.indexOf(summaryStartMarker);
if (summaryStartIndex !== -1) {
  const summaryEndIndex = file.indexOf('</div>', summaryStartIndex);
  const summaryBefore = file.substring(0, summaryStartIndex);
  const summaryAfter = file.substring(summaryEndIndex);
  
  const summaryReplacement = `<span className="text-gray-400">Quality Tier</span>
                  <span className="text-white font-medium">{selectedTier === 'Any' ? 'All Data' : 'Tier ' + selectedTier}</span>\n                `;
                  
  file = summaryBefore + summaryReplacement + summaryAfter;
}

fs.writeFileSync('src/components/DataQueryBuilder.tsx', file);
