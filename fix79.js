const fs = require('fs');
const filePath = 'src/lib/data-sources.ts';
let c = fs.readFileSync(filePath, 'utf8');

// Combine Health categories
c = c.replace(/category: 'Health'/g, "category: 'Health & Fitness'");

fs.writeFileSync(filePath, c);
console.log("Categories merged.");
