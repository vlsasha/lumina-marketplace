import { neon } from '@neondatabase/serverless';

// Create the connection only if the variable exists
export const sql = process.env.DATABASE_URL 
  ? neon(process.env.DATABASE_URL) 
  : null;

// Helper to initialize the DB table if it doesn't exist
export async function initDb() {
  if (!sql) return;

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
      purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      provider_wallets JSONB
    )
  `;

  // Auto-migrate: add provider_wallets if missing (for legacy tables)
  try {
    await sql`ALTER TABLE purchases ADD COLUMN IF NOT EXISTS provider_wallets JSONB`;
  } catch (e) {
    // Ignore if already exists or other error
  } NOT NULL,
      dataset_id VARCHAR(255) NOT NULL,
      transaction_hash VARCHAR(255),
      format VARCHAR(10),
      size_bytes INTEGER,
      purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

}


export default sql;
