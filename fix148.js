const fs = require('fs');
let page = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

// The right column (Earnings Table & Data Preview)
page = page.replace(
  /{\/\* Data Preview \*\/}\s*<div className="space-y-4">/,
  `{/* Data Preview */}\n            <div className="xl:col-span-5 space-y-4">`
);

fs.writeFileSync('src/app/dashboard/page.tsx', page);
