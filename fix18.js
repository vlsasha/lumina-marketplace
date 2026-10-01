const fs = require('fs');
let c = fs.readFileSync('src/lib/db.ts', 'utf8');

const target = `  await sql\`
    CREATE TABLE IF NOT EXISTS user_connections (
      id SERIAL PRIMARY KEY,
      wallet_address VARCHAR(255) NOT NULL,
      source_id VARCHAR(50) NOT NULL,
      connection_id VARCHAR(255) NOT NULL,
      status VARCHAR(50) NOT NULL,
      scopes_approved TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(wallet_address, source_id)
    )
  \`;`;

const replacement = `  await sql\`
    CREATE TABLE IF NOT EXISTS user_connections (
      id SERIAL PRIMARY KEY,
      wallet_address VARCHAR(255) NOT NULL,
      source_id VARCHAR(50) NOT NULL,
      connection_id VARCHAR(255) NOT NULL,
      status VARCHAR(50) NOT NULL,
      scopes_approved TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(wallet_address, source_id)
    )
  \`;
  
  // Migration: Add provider_account_id and quality_score
  try {
    await sql\`ALTER TABLE user_connections ADD COLUMN provider_account_id VARCHAR(255)\`;
  } catch (e) {
    // Column might already exist, ignore error
  }
  
  try {
    await sql\`ALTER TABLE user_connections ADD COLUMN quality_score INTEGER\`;
  } catch (e) {
    // Column might already exist, ignore error
  }
  
  try {
    await sql\`ALTER TABLE user_connections ADD CONSTRAINT unique_provider_account UNIQUE(source_id, provider_account_id)\`;
  } catch (e) {
    // Constraint might already exist, ignore error
  }`;

c = c.replace(target, replacement);
fs.writeFileSync('src/lib/db.ts', c);
