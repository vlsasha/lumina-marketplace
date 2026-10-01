const fs = require('fs');
let c = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

const targetLine = `<span className="opacity-60 font-medium text-[9px] ml-0.5">({conn.qualityScore})</span>`;
if (c.indexOf(targetLine) > -1) {
  c = c.replace(targetLine, `${targetLine}
                                  </span>
                                  <span className="ml-2 text-[11px] font-semibold text-vana-green/90 bg-vana-green/10 px-2 py-0.5 rounded-md border border-vana-green/20">
                                    +\${(conn.qualityScore * 0.15).toFixed(2)} USDC
                                  </span>
                                  <!-- BADGE END -->
`);
  // Remove the old closing span that was pushed down
  c = c.replace(/<!-- BADGE END -->\\s*<\\/span>/g, '');
}

// Add fragment
c = c.replace(/\{conn\?\.qualityScore != null && \(/g, '{conn?.qualityScore != null && (<>');
c = c.replace(/USDC\s*<\/span>\s*\)\}/g, 'USDC</span></>)}');

fs.writeFileSync('src/app/dashboard/page.tsx', c);
