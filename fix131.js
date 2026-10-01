const fs = require('fs');

// StatsSection
let stats = fs.readFileSync('src/components/StatsSection.tsx', 'utf8');
stats = stats.replace(
  `<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl mx-auto bg-vana-primary/5 blur-[150px] pointer-events-none rounded-[100%]" />`,
  `<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-white/5 blur-[120px] pointer-events-none rounded-[100%]" />\n      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/5 blur-[100px] pointer-events-none rounded-full" />`
);
fs.writeFileSync('src/components/StatsSection.tsx', stats);

// MonetizeInfoSection
let monetize = fs.readFileSync('src/components/MonetizeInfoSection.tsx', 'utf8');
monetize = monetize.replace(
  `<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-vana-primary opacity-5 blur-[120px] rounded-full pointer-events-none" />`,
  `<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />\n      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] pointer-events-none rounded-full" />`
);
fs.writeFileSync('src/components/MonetizeInfoSection.tsx', monetize);

// HowItWorks
let how = fs.readFileSync('src/components/HowItWorks.tsx', 'utf8');
how = how.replace(
  `<section id="how-it-works" className="py-16 sm:py-24 border-t border-vana-border">`,
  `<section id="how-it-works" className="py-16 sm:py-24 border-t border-[#111] relative overflow-hidden bg-transparent">\n      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-white/5 blur-[120px] pointer-events-none rounded-full" />\n      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-vana-primary/5 blur-[100px] pointer-events-none rounded-full" />`
);
fs.writeFileSync('src/components/HowItWorks.tsx', how);
