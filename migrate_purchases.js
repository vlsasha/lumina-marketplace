const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || 'postgres://default:A6uF8WvKzIfL@ep-spring-breeze-a4fkytt3-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require'
});

async function migrate() {
  try {
    await pool.query('ALTER TABLE purchases ADD COLUMN IF NOT EXISTS provider_wallets JSONB DEFAULT \'[]\'::jsonb;');
    console.log('Migration successful');
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
migrate();
