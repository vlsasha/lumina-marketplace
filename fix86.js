const fs = require('fs');
let c = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

c = c.replace(
  /\{DATA_SOURCES\.map\(\(source\) => \{/g,
  `{
                [...DATA_SOURCES].sort((a, b) => {
                  const connA = getConnection(a.source);
                  const connB = getConnection(b.source);
                  const aConnected = connA?.status === 'approved' || connA?.status === 'completed';
                  const bConnected = connB?.status === 'approved' || connB?.status === 'completed';
                  if (aConnected && !bConnected) return -1;
                  if (!aConnected && bConnected) return 1;
                  if (aConnected && bConnected) {
                     return (connB?.qualityScore || 0) - (connA?.qualityScore || 0);
                  }
                  return 0;
                }).map((source) => {`
);

const targetBadge = `<span className="opacity-60 font-medium text-[9px] ml-0.5">({conn.qualityScore})</span>
                                  </span>
                                )}`;

const replaceBadge = `<span className="opacity-60 font-medium text-[9px] ml-0.5">({conn.qualityScore})</span>
                                    </span>
                                    <span className="ml-2 text-[11px] font-semibold text-vana-green/90 bg-vana-green/10 px-2 py-0.5 rounded-md border border-vana-green/20">
                                      +\${(conn.qualityScore * 0.15).toFixed(2)} USDC
                                    </span>
                                  </>
                                )}`;

c = c.replace(targetBadge, replaceBadge);
c = c.replace(
  `{conn?.qualityScore != null && (
                                  <span`,
  `{conn?.qualityScore != null && (
                                  <>
                                    <span`
);

fs.writeFileSync('src/app/dashboard/page.tsx', c);
