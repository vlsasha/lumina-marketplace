const { neon } = require('@neondatabase/serverless');
require('dotenv').config({path: '.env.local'});
const sql = neon(process.env.DATABASE_URL);
sql`SELECT * FROM user_connections`.then(res => {
  console.log('user_connections:', res);
}).catch(console.error);
