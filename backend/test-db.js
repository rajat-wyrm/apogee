// Simple database connection test
require('dotenv').config();
const { Pool } = require('pg');

async function testConnection() {
  console.log('🔍 Testing database connection...');
  console.log('📊 Connection string:', process.env.DATABASE_URL?.replace(/:[^:]*@/, ':****@'));
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    const client = await pool.connect();
    console.log('✅✅✅ SUCCESS! Connected to database');
    
    const result = await client.query('SELECT version() as version');
    console.log('📅 PostgreSQL version:', result.rows[0].version);
    
    client.release();
    await pool.end();
    console.log('👋 Connection closed');
    return true;
  } catch (error) {
    console.error('❌❌❌ FAILED:', error.message);
    return false;
  }
}

testConnection();