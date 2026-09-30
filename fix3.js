const fs = require('fs');
let content = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

const target = `                        {(conn?.status === 'approved' || conn?.status === 'completed') && (
                          <button
                            onClick={() => handleReadData(source.source)}
                            disabled={isLoading}
                            className="px-4 py-2 text-xs rounded-lg bg-vana-green/10 hover:bg-vana-green/20 text-vana-green font-medium transition-colors disabled:opacity-50"
                          >
                            {isLoading ? 'Reading...' : 'Read Data'}
                          </button>
                        )}`;

const replacement = `                        {(conn?.status === 'approved' || conn?.status === 'completed') && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => setConnections(prev => prev.filter(c => c.connectionId !== conn.connectionId))}
                              className="px-3 py-2 text-xs rounded-lg border border-vana-border hover:bg-vana-red/10 text-vana-text-muted hover:text-vana-red transition-colors"
                              title="Disconnect source"
                            >
                              Disconnect
                            </button>
                            <button
                              onClick={() => handleReadData(source.source)}
                              disabled={isLoading}
                              className="px-4 py-2 text-xs rounded-lg bg-vana-green/10 hover:bg-vana-green/20 text-vana-green font-medium transition-colors disabled:opacity-50"
                            >
                              {isLoading ? 'Reading...' : 'Read Data'}
                            </button>
                          </div>
                        )}`;

content = content.replace(target, replacement);
fs.writeFileSync('src/app/dashboard/page.tsx', content);
