require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

async function run() {
  await sql`DELETE FROM user_connections WHERE connection_id = 'dcr_mock123'`;
  console.log('Deleted mock connection');
}
run();
