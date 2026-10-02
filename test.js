require('dotenv').config({ path: '.env.local' });
const postgres = require('postgres');

if (!process.env.POSTGRES_URL) {
  console.log("No POSTGRES_URL");
  process.exit(1);
}

const sql = postgres(process.env.POSTGRES_URL);

async function run() {
  try {
    const result = await sql`
        SELECT source_id, COUNT(DISTINCT wallet_address) as count 
        FROM user_connections 
        WHERE status IN ('approved', 'completed')
        GROUP BY source_id
      `;
    console.log(result);
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}
run();
