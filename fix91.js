const fs = require('fs');
let c = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

// Normalize line endings to \n for regex matching
c = c.replace(/\\r\\n/g, '\\n');

c = c.replace(
  `({conn.qualityScore})</span>\\n                                  </span>\\n                                )}`,
  `({conn.qualityScore})</span>\\n                                  </span>\\n                                  <span className="ml-2 text-[11px] font-semibold text-vana-green/90 bg-vana-green/10 px-2 py-0.5 rounded-md border border-vana-green/20">\\n                                    +\${(conn.qualityScore * 0.15).toFixed(2)} USDC\\n                                  </span>\\n                                  </>\\n                                )}`
);

c = c.replace(
  `{conn?.qualityScore != null && (\\n                                  <span`,
  `{conn?.qualityScore != null && (\\n                                  <>\\n                                    <span`
);

fs.writeFileSync('src/app/dashboard/page.tsx', c);
