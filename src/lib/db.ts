import { neon } from '@neondatabase/serverless';

// Create the connection only if the variable exists
export const sql = process.env.DATABASE_URL 
  ? neon(process.env.DATABASE_URL) 
  : null;

// Helper to initialize the DB table if it doesn't exist
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
      UNIQUE(wallet_address, source_id)
    )
  `;
  
  // Migration: Add provider_account_id and quality_score
  try {
    await sql`ALTER TABLE user_connections ADD COLUMN provider_account_id VARCHAR(255)`;
  } catch (e) {
    // Column might already exist, ignore error
  }
  
  try {
    await sql`ALTER TABLE user_connections ADD COLUMN quality_score INTEGER`;
  } catch (e) {
    // Column might already exist, ignore error
  }
  
  try {
    await sql`ALTER TABLE user_connections ADD CONSTRAINT unique_provider_account UNIQUE(source_id, provider_account_id)`;
  } catch (e) {
    // Constraint might already exist, ignore error
  }
  await sql`
    CREATE TABLE IF NOT EXISTS downloaded_data (
      id SERIAL PRIMARY KEY,
      connection_id VARCHAR(255) UNIQUE NOT NULL,
      data JSONB NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
}


  await sql`
    CREATE TABLE IF NOT EXISTS api_keys (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) UNIQUE NOT NULL,
      key_hash VARCHAR(255) NOT NULL,
      prefix VARCHAR(20) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
      purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

export default sql;
