const fs = require('fs');
let c = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

c = c.replace(
  `{conn?.qualityScore != null && (
                                  <span className={\`shrink-0 ml-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1.5 backdrop-blur-sm transition-all \${getTierStyle(conn.qualityScore)}\`} title="Data Quality Score">
                                    <span className="text-[10px]">&#128142;</span>
                                    <span className="tracking-wide">TIER {getTierLabel(conn.qualityScore)}</span>
                                    <span className="opacity-60 font-medium text-[9px] ml-0.5">({conn.qualityScore})</span>
                                  </span>
                                )}`,
  `{conn?.qualityScore != null && (
                                  <>
                                    <span className={\`shrink-0 ml-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1.5 backdrop-blur-sm transition-all \${getTierStyle(conn.qualityScore)}\`} title="Data Quality Score">
                                      <span className="text-[10px]">&#128142;</span>
                                      <span className="tracking-wide">TIER {getTierLabel(conn.qualityScore)}</span>
                                      <span className="opacity-60 font-medium text-[9px] ml-0.5">({conn.qualityScore})</span>
                                    </span>
                                    <span className="ml-2 text-[11px] font-semibold text-vana-green/90 bg-vana-green/10 px-2 py-0.5 rounded-md border border-vana-green/20">
                                      +\${(conn.qualityScore * 0.15).toFixed(2)} USDC
                                    </span>
                                  </>
                                )}`
);

fs.writeFileSync('src/app/dashboard/page.tsx', c);
