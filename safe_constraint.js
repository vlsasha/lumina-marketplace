const fs = require('fs');
let code = fs.readFileSync('src/lib/db.ts', 'utf8');

code = code.replace(
  "await sql`ALTER TABLE user_connections ADD CONSTRAINT unique_provider_account UNIQUE(source_id, provider_account_id)`;",
  "try { await sql`ALTER TABLE user_connections ADD CONSTRAINT unique_provider_account UNIQUE(source_id, provider_account_id)`; } catch (e) {}"
);

fs.writeFileSync('src/lib/db.ts', code);
console.log('Made constraint addition safe');
