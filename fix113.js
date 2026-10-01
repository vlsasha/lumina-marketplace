const fs = require('fs');
let c = fs.readFileSync('src/components/SourceCard.tsx', 'utf8');

c = c.replace(
  `<div className="flex items-center gap-2">
                <h3 className="text-white font-bold text-lg tracking-tight truncate group-hover:text-vana-primary transition-colors duration-300">{source.name}</h3>`,
  `<div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                <h3 className="text-white font-bold text-[17px] leading-tight tracking-tight group-hover:text-vana-primary transition-colors duration-300">{source.name}</h3>`
);

// Also let's reduce the status badge size slightly to save space
c = c.replace(
  `px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest`,
  `px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider`
);

fs.writeFileSync('src/components/SourceCard.tsx', c);
