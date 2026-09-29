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
}

export default sql;
