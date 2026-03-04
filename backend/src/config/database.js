/**
 * Database Configuration
 * PostgreSQL connection setup using pg pool
 */

const { Pool } = require('pg');

let pool = null;

const connectDB = async () => {
  try {
    console.log('🔄 Connecting to PostgreSQL...');
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not defined in .env file');
    }

    // Create connection pool
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false // Required for Neon.tech
      },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    // Test connection
    const client = await pool.connect();
    console.log('✅ PostgreSQL Connected Successfully');
    
    // Create tables in correct order
    await createTables(client);
    
    client.release();
    
    pool.on('error', (err) => {
      console.error('Unexpected PostgreSQL pool error:', err);
    });

    return pool;
  } catch (error) {
    console.error('❌ PostgreSQL Connection Error:', error.message);
    console.error('Please check your DATABASE_URL in .env file');
    process.exit(1);
  }
};

const createTables = async (client) => {
  try {
    console.log('📦 Creating database tables...');

    // Enable UUID extension
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    // Drop tables if they exist (in reverse order of dependencies)
    await client.query(`DROP TABLE IF EXISTS tasks CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS projects CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS users CASCADE;`);
    
    console.log('✅ Existing tables dropped');

    // Create users table (no dependencies)
    await client.query(`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        avatar VARCHAR(500),
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Users table created');

    // Create projects table (depends on users)
    await client.query(`
      CREATE TABLE projects (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(200) NOT NULL,
        description TEXT,
        color VARCHAR(50) DEFAULT '#6366f1',
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Projects table created');

    // Create tasks table (depends on users and projects)
    await client.query(`
      CREATE TABLE tasks (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(300) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        priority VARCHAR(50) DEFAULT 'medium',
        due_date DATE,
        project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP WITH TIME ZONE
      );
    `);
    console.log('✅ Tasks table created');

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
      CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
      CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
      CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
      CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
    `);
    console.log('✅ Indexes created');

  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    throw error;
  }
};

const getPool = () => {
  if (!pool) {
    throw new Error('Database not initialized. Call connectDB() first.');
  }
  return pool;
};

const closePool = async () => {
  if (pool) {
    await pool.end();
    console.log('Database connection pool closed');
  }
};

module.exports = { connectDB, getPool, closePool };