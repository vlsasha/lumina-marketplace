const fs = require('fs');

let file = fs.readFileSync('src/components/DataQueryBuilder.tsx', 'utf8');

const regex = /<div>\s*<label className="block text-xs text-gray-500 mb-1\.5">Select Target Quality<\/label>[\s\S]*?<\/select>\s*<\/div>/;

const replacement = `<div className="space-y-2">
                {[
                  { id: 'Any', name: 'All Data', desc: 'No filters', icon: '🌐', activeClass: 'border-vana-primary bg-vana-primary/10 text-white' },
                  { id: 'A', name: 'Tier A', desc: 'Premium (>80 pts)', icon: '💎', activeClass: 'border-yellow-400 bg-yellow-400/10 text-yellow-400' },
                  { id: 'B', name: 'Tier B', desc: 'High (50-79 pts)', icon: '✨', activeClass: 'border-purple-400 bg-purple-400/10 text-purple-400' },
                  { id: 'C', name: 'Tier C', desc: 'Standard (20-49 pts)', icon: '⚡', activeClass: 'border-blue-400 bg-blue-400/10 text-blue-400' },
                  { id: 'D', name: 'Tier D', desc: 'Basic (<20 pts)', icon: '🔰', activeClass: 'border-gray-400 bg-gray-500/10 text-gray-200' }
                ].map(tier => (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedTier(tier.id)}
                    className={\`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all \${
                      selectedTier === tier.id 
                        ? tier.activeClass
                        : 'border-[#333] bg-black/50 text-gray-400 hover:border-[#555] hover:bg-black'
                    }\`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{tier.icon}</span>
                      <div>
                        <div className={\`text-sm font-bold \${selectedTier === tier.id ? '' : 'text-gray-300'}\`}>{tier.name}</div>
                        <div className="text-xs opacity-70 font-mono">{tier.desc}</div>
                      </div>
                    </div>
                    {selectedTier === tier.id && (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>`;

file = file.replace(regex, replacement);

fs.writeFileSync('src/components/DataQueryBuilder.tsx', file);
