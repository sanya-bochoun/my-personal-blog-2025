const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'my_blog_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'admin'
});

// ฟังก์ชันสำหรับทดสอบการเชื่อมต่อกับฐานข้อมูล
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ เชื่อมต่อกับฐานข้อมูลสำเร็จ!');
    client.release();
    return true;
  } catch (error) {
    console.error('❌ ไม่สามารถเชื่อมต่อกับฐานข้อมูล:', error.message);
    return false;
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  testConnection
}; 