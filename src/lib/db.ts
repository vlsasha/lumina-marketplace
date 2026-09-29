import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL || 'postgresql://mock');

// Helper to initialize the DB table if it doesn't exist
export async function initDb() {
  if (!process.env.DATABASE_URL) return;
  await sql\
    CREATE TABLE IF NOT EXISTS vana_users (
      id SERIAL PRIMARY KEY,
      wallet_address VARCHAR(255) UNIQUE NOT NULL,
      connected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  \;
}

export default sql;
