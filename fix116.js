const fs = require('fs');
let c = fs.readFileSync('src/components/SourceCard.tsx', 'utf8');

c = c.replace(
  `block truncate text-[11px]`,
  `text-[11px]`
);

c = c.replace(
  `text-sm text-gray-400 line-clamp-2 leading-relaxed`,
  `text-sm text-gray-400 leading-relaxed`
);

fs.writeFileSync('src/components/SourceCard.tsx', c);
