const fs = require('fs');
let page = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

// The layout definition
page = page.replace(
  `<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">`,
  `<div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-10">`
);

// The left column (Sources list)
page = page.replace(
  `<div className="lg:col-span-2 space-y-3">`,
  `<div className="xl:col-span-7 space-y-3">`
);

// The right column (Earnings Table & Data Preview)
page = page.replace(
  `            {/* Data Preview */}
            <div className="space-y-4">`,
  `            {/* Data Preview */}
            <div className="xl:col-span-5 space-y-4">`
);

fs.writeFileSync('src/app/dashboard/page.tsx', page);
