const fs = require('fs');
let c = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

c = c.replace(/<button[^>]*title="Disconnect source"[\s\S]*?<\/button>/, '');
c = c.replace(/const handleRemove = [\s\S]*?catch\(console\.error\);\n    }\n  };\n/, '');

fs.writeFileSync('src/app/dashboard/page.tsx', c);
