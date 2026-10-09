import sql, { initDb } from './src/lib/db';
async function run() {
  await initDb();
  const columns = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'purchases'`;
  console.log(columns);
  process.exit(0);
}
run();
