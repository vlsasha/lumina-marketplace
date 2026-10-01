const fs = require('fs');

// 1. Remove grid-pattern from layout.tsx
let layout = fs.readFileSync('src/app/layout.tsx', 'utf8');
layout = layout.replace(`className="min-h-screen grid-pattern"`, `className="min-h-screen"`);
fs.writeFileSync('src/app/layout.tsx', layout);

// 2. Remove mask-image from page.tsx grid
let page = fs.readFileSync('src/app/page.tsx', 'utf8');
page = page.replace(`opacity-40 [mask-image:linear-gradient(to_bottom,black_20%,transparent_100%)]`, `opacity-40`);
fs.writeFileSync('src/app/page.tsx', page);

// 3. Remove border-t from all sections
let stats = fs.readFileSync('src/components/StatsSection.tsx', 'utf8');
stats = stats.replace(`border-t border-[#111] `, ``);
fs.writeFileSync('src/components/StatsSection.tsx', stats);

let how = fs.readFileSync('src/components/HowItWorks.tsx', 'utf8');
how = how.replace(`border-t border-[#111] `, ``);
fs.writeFileSync('src/components/HowItWorks.tsx', how);

// The MonetizeInfoSection didn't have border-t, but I'll double check.
