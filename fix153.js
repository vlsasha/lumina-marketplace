const fs = require('fs');
let file = fs.readFileSync('src/app/api/providers/route.ts', 'utf8');

file = file.replace(
  `const result = await sql\`SELECT wallet_address FROM vana_users\`;`,
  `// Fetch unique users who have at least one valid connection
    const result = await sql\`SELECT DISTINCT wallet_address FROM user_connections WHERE status IN ('approved', 'completed')\`;`
);

fs.writeFileSync('src/app/api/providers/route.ts', file);
