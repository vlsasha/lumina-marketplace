import { neon } from '@neondatabase/serverless';

// Create the connection only if the variable exists
export const sql = process.env.DATABASE_URL 
  ? neon(process.env.DATABASE_URL) 
  : null;

// Helper to initialize the DB table if it doesn't exist
export async function initDb() {
  if (!sql) return;
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
  await sql`
    CREATE TABLE IF NOT EXISTS downloaded_data (
      id SERIAL PRIMARY KEY,
      connection_id VARCHAR(255) UNIQUE NOT NULL,
      data JSONB NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

export default sql;
