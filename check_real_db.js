import sql, { initDb } from './src/lib/db';

async function check() {
  await initDb();
  if (!sql) throw new Error('No DB');
  const res = await sql`SELECT * FROM user_connections`;
  console.log('User Connections:', res);
  
  const dl = await sql`SELECT connection_id FROM downloaded_data`;
  console.log('Downloaded Data connection IDs:', dl);
  
  process.exit(0);
}

check();
