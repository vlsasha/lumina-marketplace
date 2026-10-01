const fs = require('fs');

// StatsSection
let stats = fs.readFileSync('src/components/StatsSection.tsx', 'utf8');
stats = stats.replace(
  `<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-white/5 blur-[120px] pointer-events-none rounded-[100%]" />\n      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/5 blur-[100px] pointer-events-none rounded-full" />`,
  `<div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-vana-primary/10 blur-[120px] pointer-events-none rounded-[100%]" />\n      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] pointer-events-none rounded-full" />`
);
fs.writeFileSync('src/components/StatsSection.tsx', stats);

// MonetizeInfoSection
let monetize = fs.readFileSync('src/components/MonetizeInfoSection.tsx', 'utf8');
monetize = monetize.replace(
  `<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />\n      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] pointer-events-none rounded-full" />`,
  `<div className="absolute top-1/3 right-1/3 w-[600px] h-[600px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />\n      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-vana-primary/10 blur-[120px] pointer-events-none rounded-full" />`
);
fs.writeFileSync('src/components/MonetizeInfoSection.tsx', monetize);

// HowItWorks
let how = fs.readFileSync('src/components/HowItWorks.tsx', 'utf8');
how = how.replace(
  `<div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-white/5 blur-[120px] pointer-events-none rounded-full" />\n      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-vana-primary/5 blur-[100px] pointer-events-none rounded-full" />`,
  `<div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] pointer-events-none rounded-full" />\n      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] pointer-events-none rounded-full" />`
);
fs.writeFileSync('src/components/HowItWorks.tsx', how);
