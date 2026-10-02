const fs = require('fs');
let file = fs.readFileSync('src/components/DataQueryBuilder.tsx', 'utf8');

const regex = /<div className="min-w-0 flex-1">[\s\S]*?\{source\.name\}[\s\S]*?<\/div>[\s\S]*?<\/div>/;

const replacement = `<div className="min-w-0 flex-1">
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

file = file.replace(regex, replacement);

fs.writeFileSync('src/components/DataQueryBuilder.tsx', file);
