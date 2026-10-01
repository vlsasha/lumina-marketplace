const fs = require('fs');
let c = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

const targetString = `{conn?.qualityScore != null && (
                                  <span className={\`shrink-0 ml-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1.5 backdrop-blur-sm transition-all \${getTierStyle(conn.qualityScore)}\`} title="Data Quality Score">
                                    <span className="text-[10px]">&#128142;</span>
                                    <span className="tracking-wide">TIER {getTierLabel(conn.qualityScore)}</span>
                                    <span className="opacity-60 font-medium text-[9px] ml-0.5">({conn.qualityScore})</span>
                                  </span>
                                )}`;

const replacement = `{conn?.qualityScore != null && (
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
                                )}`;

if (c.indexOf(targetString) !== -1) {
  c = c.replace(targetString, replacement);
  fs.writeFileSync('src/app/dashboard/page.tsx', c);
  console.log('Success string matched');
} else {
  console.log('String did not match. Trying fallback regex.');
  // Fallback if whitespace differs
  const lines = c.split('\\n');
  let newLines = [];
  for(let i=0; i<lines.length; i++) {
    if (lines[i].includes('{conn?.qualityScore != null && (')) {
       // found it
       newLines.push(lines[i]);
       newLines.push(lines[i+1].replace('<span', '<><span')); // the span
       newLines.push(lines[i+2]);
       newLines.push(lines[i+3]);
       newLines.push(lines[i+4]);
       newLines.push(lines[i+5]); // </span>
       newLines.push(`                                  <span className="ml-2 text-[11px] font-semibold text-vana-green/90 bg-vana-green/10 px-2 py-0.5 rounded-md border border-vana-green/20">`);
       newLines.push(`                                    +\${(conn.qualityScore * 0.15).toFixed(2)} USDC`);
       newLines.push(`                                  </span></>`);
       newLines.push(lines[i+6]); // )}
       i += 6;
    } else {
       newLines.push(lines[i]);
    }
  }
  fs.writeFileSync('src/app/dashboard/page.tsx', newLines.join('\\n'));
}

