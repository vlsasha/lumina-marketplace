const fs = require('fs');

// 1. Update dashboard/page.tsx
let c1 = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');
c1 = c1.replace(
  `const getTierLabel = (score: number) => {
  if (score >= 80) return 'S';
  if (score >= 60) return 'A';
  if (score >= 40) return 'B';
  return 'C';
};`,
  `const getTierLabel = (score: number) => {
  if (score >= 80) return 'A';
  if (score >= 60) return 'B';
  if (score >= 40) return 'C';
  return 'D';
};`
);
fs.writeFileSync('src/app/dashboard/page.tsx', c1);

// 2. Update SourceCard.tsx
let c2 = fs.readFileSync('src/components/SourceCard.tsx', 'utf8');
c2 = c2.replace(
  `const getTierLabel = (score: number) => {
  if (score >= 80) return 'S';
  if (score >= 60) return 'A';
  if (score >= 40) return 'B';
  return 'C';
};`,
  `const getTierLabel = (score: number) => {
  if (score >= 80) return 'A';
  if (score >= 60) return 'B';
  if (score >= 40) return 'C';
  return 'D';
};`
);
fs.writeFileSync('src/components/SourceCard.tsx', c2);

// 3. Update docs/page.tsx
let c3 = fs.readFileSync('src/app/docs/page.tsx', 'utf8');
c3 = c3.replace(`Tier S (Premium)`, `Tier A (Premium)`);
c3 = c3.replace(`Tier A (High Quality)`, `Tier B (High Quality)`);
c3 = c3.replace(`Tier B (Standard)`, `Tier C (Standard)`);
c3 = c3.replace(`Tier C (Low / Any)`, `Tier D (Low / Any)`);
fs.writeFileSync('src/app/docs/page.tsx', c3);
