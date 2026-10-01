const fs = require('fs');
let c = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

const regex = /<span className="shrink-0 px-2 py-0\.5 rounded text-\[10px\] font-bold bg-\[#111\] text-amber-400 border border-\[#333\]" title="Data Quality Score">[\s\S]*?<\/span>/;

const replace = `<span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold bg-[#111] text-amber-400 border border-[#333]" title="Data Quality Score">
  &#128142; Tier {conn.qualityScore >= 80 ? 'S' : conn.qualityScore >= 60 ? 'A' : conn.qualityScore >= 40 ? 'B' : 'C'} ({conn.qualityScore}/100)
</span>`;

if (regex.test(c)) {
  c = c.replace(regex, replace);
  fs.writeFileSync('src/app/dashboard/page.tsx', c);
  console.log("Success");
} else {
  console.log("Failed to match span");
}
