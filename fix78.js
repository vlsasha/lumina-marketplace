const fs = require('fs');
const filePath = 'src/app/dashboard/page.tsx';
let c = fs.readFileSync(filePath, 'utf8');

const targetStr = `
              {/* Connection log */}
              {connections.length > 0 && (
                <>
                  <h3 className="text-sm font-semibold text-vana-text">Activity Log</h3>
                  <div className="space-y-2">
                    {connections.map((conn) => {
                      const source = DATA_SOURCES.find((s) => s.source === conn.sourceId);
                      return (
                        <div key={conn.connectionId} className="p-3 rounded-lg border border-vana-border bg-vana-card text-xs">
                          <div className="flex items-center gap-2 mb-1">
                            <span>{source?.icon}</span>
                            <span className="text-vana-text font-medium">{source?.name}</span>
                          </div>
                          <code className="text-vana-text-muted block truncate">{conn.connectionId}</code>
                          <span className={\`text-[10px] font-medium \${
                            conn.status === 'approved' ? 'text-vana-green' :
                            conn.status === 'pending' ? 'text-vana-amber' :
                            conn.status === 'denied' ? 'text-vana-red' :
                            'text-vana-text-muted'
                          }\`}>
                            {conn.status.toUpperCase()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
`;

// Remove it, ignoring exact indentation
const pattern = /\{\/\*\s*Connection log\s*\*\/\}[\s\S]*?(?=\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/main>)/;
if (pattern.test(c)) {
  c = c.replace(pattern, '');
  fs.writeFileSync(filePath, c);
  console.log("Activity log removed.");
} else {
  console.log("Could not find the connection log block.");
}
