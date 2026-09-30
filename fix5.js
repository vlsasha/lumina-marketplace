const fs = require('fs');
let c = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

const target = `<h2 className="text-lg font-semibold text-vana-text mb-4">Data Preview</h2>`;
const replacement = `<div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-vana-text">Data Preview</h2>
                    {dataPreview && (
                      <button 
                        onClick={() => {
                          const blob = new Blob([JSON.stringify(dataPreview, null, 2)], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = \`vana_data_\${dataPreview?.source || 'export'}.json\`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="px-3 py-1.5 text-xs rounded-lg border border-vana-primary text-vana-primary hover:bg-vana-primary/10 transition-colors cursor-pointer"
                      >
                        Download JSON
                      </button>
                    )}
                  </div>`;

c = c.replace(target, replacement);
fs.writeFileSync('src/app/dashboard/page.tsx', c);
