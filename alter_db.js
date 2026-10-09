import sql, { initDb } from './src/lib/db';
async function run() {
  await initDb();
  await sql`ALTER TABLE purchases ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'completed'`;
  console.log('Added status column');
  process.exit(0);
}
run();
