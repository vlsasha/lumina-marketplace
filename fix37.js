const fs = require('fs');

let c = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

// 1. Add helper function outside the component
if (!c.includes('const getTierStyle')) {
  c = c.replace('export default function DashboardPage() {', `const getTierStyle = (score: number) => {
  if (score >= 80) return 'bg-amber-500/15 text-amber-400 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.25)]';
  if (score >= 60) return 'bg-purple-500/15 text-purple-400 border-purple-500/40';
  if (score >= 40) return 'bg-blue-500/15 text-blue-400 border-blue-500/40';
  return 'bg-gray-500/15 text-gray-400 border-gray-500/40';
};

const getTierLabel = (score: number) => {
  if (score >= 80) return 'S';
  if (score >= 60) return 'A';
  if (score >= 40) return 'B';
  return 'C';
};

export default function DashboardPage() {`);
}

// 2. Replace the ugly badge with the beautiful one
const badgeTargetRegex = /\{conn\?\.qualityScore != null && \([\s\S]*?<span className="shrink-0 px-2 py-0\.5 rounded text-\[10px\] font-bold bg-\[#111\] text-amber-400 border border-\[#333\]" title="Data Quality Score">[\s\S]*?<\/span>[\s\S]*?\)\}/;

const beautifulBadge = `{conn?.qualityScore != null && (
                                <span className={\`shrink-0 ml-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1.5 backdrop-blur-sm transition-all \${getTierStyle(conn.qualityScore)}\`} title="Data Quality Score">
                                  <span className="text-[10px]">&#128142;</span>
                                  <span className="tracking-wide">TIER {getTierLabel(conn.qualityScore)}</span>
                                  <span className="opacity-60 font-medium text-[9px] ml-0.5">({conn.qualityScore})</span>
                                </span>
                              )}`;

c = c.replace(badgeTargetRegex, beautifulBadge);

fs.writeFileSync('src/app/dashboard/page.tsx', c);
