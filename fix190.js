const fs = require('fs');

let file = fs.readFileSync('src/components/DataQueryBuilder.tsx', 'utf8');

const regex = /className="w-28 bg-black\/50 border border-\[\#333\] hover:border-\[\#555\] rounded-xl px-3 py-1\.5 text-right text-xl font-bold text-white focus:outline-none focus:border-vana-primary transition-colors appearance-none"/;
const replacement = `className="w-28 bg-black/50 border border-[#333] hover:border-[#555] rounded-xl px-3 py-1.5 text-right text-xl font-bold text-white focus:outline-none focus:border-vana-primary transition-colors [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield] appearance-none"`;

file = file.replace(regex, replacement);

fs.writeFileSync('src/components/DataQueryBuilder.tsx', file);
