const fs = require('fs');

let file = fs.readFileSync('src/components/SourcesGrid.tsx', 'utf8');

file = file.replace(/import \{ useSession \} from 'next-auth\/react';\r?\n/, '');
file = file.replace(/const sessionObj = useSession\(\);\r?\n/, '');
file = file.replace(/const isAuthenticated = isConnected \|\| sessionObj\?\.status === 'authenticated';/, 'const isAuthenticated = isConnected;');

fs.writeFileSync('src/components/SourcesGrid.tsx', file);
console.log("SourcesGrid updated.");
