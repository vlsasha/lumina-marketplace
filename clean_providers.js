const fs = require('fs');

let file = fs.readFileSync('src/app/providers.tsx', 'utf8');

file = file.replace(/import \{ SessionProvider \} from 'next-auth\/react';\r?\n/, '');
file = file.replace(/<SessionProvider>\r?\n\s*/, '');
file = file.replace(/\s*<\/SessionProvider>/, '');

fs.writeFileSync('src/app/providers.tsx', file);
console.log("Providers updated.");
