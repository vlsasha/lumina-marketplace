const fs = require('fs');
let c = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

c = c.replace(/\{\(conn\?\.status === 'approved' \|\| conn\?\.status === 'completed'\) && \(\s*<button\s*onClick=\{\(\) => handleReadData\(source\.source\)\}/, `{(conn?.status === 'approved' || conn?.status === 'completed') && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => setConnections(prev => prev.filter(c => c.connectionId !== conn.connectionId))}
                              className="px-3 py-2 text-xs rounded-lg border border-vana-border hover:bg-vana-red/10 text-vana-text-muted hover:text-vana-red transition-colors"
                              title="Disconnect source"
                            >
                              Disconnect
                            </button>
                            <button
                              onClick={() => handleReadData(source.source)}`);

c = c.replace(/\{isLoading \? 'Reading\.\.\.' : 'Read Data'\}\s*<\/button>\s*\)\}/, `{isLoading ? 'Reading...' : 'Read Data'}
                            </button>
                          </div>
                        )}`);

fs.writeFileSync('src/app/dashboard/page.tsx', c);
