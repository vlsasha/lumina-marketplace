const fs = require('fs');

let c = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

const target1 = `                          <div>
                            <h3 className="font-medium text-vana-text">{source.name}</h3>
                            <p className="text-xs text-vana-text-muted">`;

const replace1 = `                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-vana-text">{source.name}</h3>
                              {conn?.qualityScore != null && (
                                <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold bg-[#111] text-amber-400 border border-[#333]" title="Data Quality Score">
                                  &#128142; Tier {conn.qualityScore >= 80 ? 'S' : conn.qualityScore >= 60 ? 'A' : conn.qualityScore >= 40 ? 'B' : 'C'} ({conn.qualityScore}/100)
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-vana-text-muted">`;

c = c.replace(target1, replace1);

const target2 = `                              <div className="flex flex-col items-end gap-1">
                                <span className="flex items-center gap-1 text-xs text-vana-green px-2 py-1 rounded-lg bg-vana-green/10">
                                  <span className="w-1.5 h-1.5 rounded-full bg-vana-green" />
                                  Connected
                                </span>
                                {conn.qualityScore != null && (
                                  <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold bg-[#111] text-amber-400 border border-[#333]" title="Data Quality Score">
                                    &#128142; Tier {conn.qualityScore >= 80 ? 'S' : conn.qualityScore >= 60 ? 'A' : conn.qualityScore >= 40 ? 'B' : 'C'} ({conn.qualityScore}/100)
                                  </span>
                                )}
                              </div>`;

const replace2 = `                              <span className="flex items-center gap-1 text-xs text-vana-green px-2 py-1 rounded-lg bg-vana-green/10">
                                <span className="w-1.5 h-1.5 rounded-full bg-vana-green" />
                                Connected
                              </span>`;

c = c.replace(target2, replace2);

fs.writeFileSync('src/app/dashboard/page.tsx', c);
