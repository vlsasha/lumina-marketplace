const fs = require('fs');
let c1 = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

c1 = c1.replace(
  /const getTierLabel = \(score: number\) => \{\s*if \(score >= 80\) return 'S';\s*if \(score >= 60\) return 'A';\s*if \(score >= 40\) return 'B';\s*return 'C';\s*\};/g,
  `const getTierLabel = (score: number) => {
  if (score >= 80) return 'A';
  if (score >= 60) return 'B';
  if (score >= 40) return 'C';
  return 'D';
};`
);

fs.writeFileSync('src/app/dashboard/page.tsx', c1);
