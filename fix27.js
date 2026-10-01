const fs = require('fs');
let c = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

const regex = /<span className="flex items-center gap-1 text-xs text-vana-green px-2 py-1 rounded-lg bg-vana-green\/10">[\s\S]*?<span className="w-1\.5 h-1\.5 rounded-full bg-vana-green" \/>[\s\S]*?Connected[\s\S]*?<\/span>/m;

const replace = `<div className="flex flex-col items-end gap-1">
                              <span className="flex items-center gap-1 text-xs text-vana-green px-2 py-1 rounded-lg bg-vana-green/10">
                                <span className="w-1.5 h-1.5 rounded-full bg-vana-green" />
                                Connected
                              </span>
                              {conn.qualityScore != null && (
                                <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold bg-[#111] text-amber-400 border border-[#333]" title="Data Quality Score">
                                  💎 Tier {conn.qualityScore >= 80 ? 'S' : conn.qualityScore >= 60 ? 'A' : conn.qualityScore >= 40 ? 'B' : 'C'} ({conn.qualityScore}/100)
                                </span>
                              )}
                            </div>`;

if (regex.test(c)) {
  c = c.replace(regex, replace);
  fs.writeFileSync('src/app/dashboard/page.tsx', c);
  console.log('Regex matched and replaced');
} else {
  console.log('Regex did not match');
}
