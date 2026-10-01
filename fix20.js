const fs = require('fs');
let c = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

c = c.replace(
  'scopesApproved: string[];\n}',
  'scopesApproved: string[];\n  qualityScore?: number;\n}'
);

const targetBadge = `{conn?.status === 'approved' || conn?.status === 'completed' ? (
                          <span className="shrink-0 px-3 py-1 rounded-full text-xs font-medium bg-vana-green/10 text-vana-green border border-vana-green/20">
                            Connected
                          </span>
                        ) : conn?.status === 'pending' ? (`;

const replaceBadge = `{conn?.status === 'approved' || conn?.status === 'completed' ? (
                          <div className="flex flex-col items-end gap-1">
                            <span className="shrink-0 px-3 py-1 rounded-full text-xs font-medium bg-vana-green/10 text-vana-green border border-vana-green/20">
                              Connected
                            </span>
                            {conn.qualityScore !== undefined && (
                              <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold bg-[#111] text-amber-400 border border-[#333]" title="Data Quality Score">
                                💎 Tier {conn.qualityScore >= 80 ? 'S' : conn.qualityScore >= 60 ? 'A' : conn.qualityScore >= 40 ? 'B' : 'C'} ({conn.qualityScore}/100)
                              </span>
                            )}
                          </div>
                        ) : conn?.status === 'pending' ? (`;

c = c.replace(targetBadge, replaceBadge);
fs.writeFileSync('src/app/dashboard/page.tsx', c);
