/**
 * Database Reset Script
 * Run this to completely reset all tables
 */

require('dotenv').config();
const { Pool } = require('pg');

async function resetDatabase() {
  console.log('🔄 Resetting database...');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    const client = await pool.connect();
    
    console.log('📦 Dropping all tables...');
    
    // Drop tables in correct order
    await client.query(`DROP TABLE IF EXISTS tasks CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS projects CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS users CASCADE;`);
    
    console.log('✅ All tables dropped successfully');
    
    client.release();
    await pool.end();
    
    console.log('🎉 Database reset complete! Now run npm run dev to recreate tables.');
    
  } catch (error) {
    console.error('❌ Error resetting database:', error.message);
  }
}

resetDatabase();