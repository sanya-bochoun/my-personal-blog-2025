import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

let pool;

// Try to use connection string first (Supabase/Production)
if (process.env.DATABASE_URL || process.env.SUPABASE_DB_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL || process.env.SUPABASE_DB_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
} else {
  // Fallback to individual params (Local development)
  pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'blog_db',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
}

export const query = (text, params) => pool.query(text, params);

export const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Successfully connected to PostgreSQL database!');
    console.log('Current database time:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Error connecting to the database:', error.message);
    return false;
  }
};

// Export connection pool
export default pool; 