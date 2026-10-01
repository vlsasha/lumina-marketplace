const fs = require('fs');
let c = fs.readFileSync('src/components/SourceCard.tsx', 'utf8');

c = c.replace(
  `<span className="text-[11px] uppercase tracking-wider font-semibold text-gray-500">{source.category}</span>`,
  `<span className="block truncate text-[11px] uppercase tracking-wider font-semibold text-gray-500">{source.category}</span>`
);

fs.writeFileSync('src/components/SourceCard.tsx', c);
