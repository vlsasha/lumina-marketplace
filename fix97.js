const fs = require('fs');
let c = fs.readFileSync('src/components/SourceCard.tsx', 'utf8');

// 1. Update Props type
c = c.replace(
  `interface SourceCardProps {
  source: DataSource;`,
  `interface SourceCardProps {
  source: DataSource & { status?: string, qualityScore?: number };`
);

// 2. Remove Docs Button
c = c.replace(
  /<button className="p-2\.5 rounded-xl border border-vana-border hover:border-vana-border-hover text-vana-text-muted hover:text-vana-text transition-all" title="View API documentation">[\s\S]*?<\/button>/g,
  ''
);

// 3. Add Tier Badge next to Source name
const tierHelpers = `
const getTierStyle = (score: number) => {
  if (score >= 80) return 'bg-amber-500/15 text-amber-400 border-amber-500/40';
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
`;

c = c.replace(
  `export function SourceCard({ source, address, onConnect }: SourceCardProps) {`,
  `${tierHelpers}\nexport function SourceCard({ source, address, onConnect }: SourceCardProps) {`
);

// Note: `address` might not be in the function signature. Let's handle both.
c = c.replace(
  `export function SourceCard({ source, onConnect }: SourceCardProps) {`,
  `${tierHelpers}\nexport function SourceCard({ source, onConnect }: SourceCardProps) {`
);

c = c.replace(
  `<h3 className="text-white font-bold text-lg tracking-tight truncate group-hover:text-vana-primary transition-colors duration-300">{source.name}</h3>`,
  `<div className="flex items-center gap-2">
                <h3 className="text-white font-bold text-lg tracking-tight truncate group-hover:text-vana-primary transition-colors duration-300">{source.name}</h3>
                {source.qualityScore != null && (
                  <span className={\`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 backdrop-blur-sm transition-all \${getTierStyle(source.qualityScore)}\`}>
                    <span className="text-[9px]">&#128142;</span>
                    <span className="tracking-wide">TIER {getTierLabel(source.qualityScore)}</span>
                  </span>
                )}
              </div>`
);

fs.writeFileSync('src/components/SourceCard.tsx', c);
