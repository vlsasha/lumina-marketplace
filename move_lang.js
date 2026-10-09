const fs = require('fs');

let content = fs.readFileSync('src/lib/i18n/dictionaries.ts', 'utf8');

// I want to move RU right before ZH.
// It's a JS array. I will parse the exact text out.

const ruBlock = `  {
    "code": "ru",
    "name": "RU - Русский"
  },
`;

// Remove RU from current position
content = content.replace(ruBlock, '');

// Insert RU before ZH
const zhBlock = `  {
    "code": "zh",
    "name": "ZH - 中文"
  }`;

content = content.replace(zhBlock, ruBlock + zhBlock);

fs.writeFileSync('src/lib/i18n/dictionaries.ts', content);
console.log('Moved RU before ZH.');
