const fs = require('fs');

let c = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

// 1. Bust fetch cache
c = c.replace(
  'fetch(`/api/connections?wallet=${address}`)',
  'fetch(`/api/connections?wallet=${address}&t=${Date.now()}`)'
);

// 2. Fix the corrupted emoji
c = c.replace(/\?'\? Tier/g, '&#128142; Tier'); // 💎 emoji HTML entity

fs.writeFileSync('src/app/dashboard/page.tsx', c);
