import sql, { initDb } from './src/lib/db';

async function checkDb() {
  await initDb();
  if (!sql) throw new Error('No DB');
  
  const records = await sql`SELECT d.*, u.source_id FROM downloaded_data d JOIN user_connections u ON d.connection_id = u.connection_id`;
  console.log('Downloaded Data:', JSON.stringify(records, null, 2));
  
  const connections = await sql`SELECT * FROM user_connections`;
  console.log('Connections:', JSON.stringify(connections, null, 2));
  
  process.exit(0);
}

checkDb();
