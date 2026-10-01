const fs = require('fs');
let c = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

c = c.replace(
  `{conn?.qualityScore != null && (
                                  <span`,
  `{conn?.qualityScore != null && (
                                  <>
                                    <span`
);

c = c.replace(
  `({conn.qualityScore})</span>
                                  </span>
                                )}`,
  `({conn.qualityScore})</span>
                                  </span>
                                  <span className="ml-2 text-[11px] font-semibold text-vana-green/90 bg-vana-green/10 px-2 py-0.5 rounded-md border border-vana-green/20">
                                    +\${(conn.qualityScore * 0.15).toFixed(2)} USDC
                                  </span>
                                  </>
                                )}`
);

fs.writeFileSync('src/app/dashboard/page.tsx', c);
