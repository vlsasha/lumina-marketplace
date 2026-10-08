import { neon } from '@neondatabase/serverless';

export const sql = process.env.DATABASE_URL 
  ? neon(process.env.DATABASE_URL) 
  : null;

export async function initDb() {
  if (!sql) return;

  await sql`
    CREATE TABLE IF NOT EXISTS auth_codes (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      code VARCHAR(10) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      expires_at TIMESTAMP NOT NULL,
      used BOOLEAN DEFAULT FALSE
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS vana_users (
      id SERIAL PRIMARY KEY,
      wallet_address VARCHAR(255) UNIQUE NOT NULL,
      connected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS user_connections (
      id SERIAL PRIMARY KEY,
      wallet_address VARCHAR(255) NOT NULL,
      source_id VARCHAR(50) NOT NULL,
      connection_id VARCHAR(255) NOT NULL,
      status VARCHAR(50) NOT NULL,
      scopes_approved TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      provider_account_id VARCHAR(255),
      quality_score INTEGER,
      UNIQUE(wallet_address, source_id)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS downloaded_data (
      id SERIAL PRIMARY KEY,
      connection_id VARCHAR(255) UNIQUE NOT NULL,
      data JSONB NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS api_keys (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) UNIQUE NOT NULL,
      key_hash VARCHAR(255) NOT NULL,
      prefix VARCHAR(20) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      raw_key VARCHAR(255)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS purchases (
      id SERIAL PRIMARY KEY,
      buyer_id VARCHAR(255) NOT NULL,
      dataset_id VARCHAR(255) NOT NULL,
      transaction_hash VARCHAR(255),
      format VARCHAR(10),
      size_bytes INTEGER,
      purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      provider_wallets JSONB
    )
  `;

  try {
    await sql`ALTER TABLE purchases ADD COLUMN IF NOT EXISTS provider_wallets JSONB`;
    await sql`ALTER TABLE api_keys ADD COLUMN IF NOT EXISTS raw_key VARCHAR(255)`;
    await sql`ALTER TABLE user_connections ADD COLUMN IF NOT EXISTS provider_account_id VARCHAR(255)`;
    await sql`ALTER TABLE user_connections ADD COLUMN IF NOT EXISTS quality_score INTEGER`;
  } catch (e) {}
}

export default sql;
