const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || 'postgres://default:A6uF8WvKzIfL@ep-spring-breeze-a4fkytt3-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require'
});

async function check() {
  try {
    const res = await pool.query('SELECT * FROM user_connections');
    console.log('User Connections:', res.rows);
    
    const dl = await pool.query('SELECT connection_id FROM downloaded_data');
    console.log('Downloaded Data:', dl.rows);
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
check();
