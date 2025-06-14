import pg from 'pg';
const { Client } = pg;

// ใส่ DATABASE_URL ที่คุณได้จาก Supabase
const DATABASE_URL = 'postgresql://postgres.nodxtooixjyexvzldnwg:YOUR_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres';

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection...');
  
  try {
    const client = new Client({
      connectionString: DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    console.log('🔗 Connecting to Supabase...');
    await client.connect();
    
    console.log('✅ Connected successfully!');
    
    // ทดสอบ query
    const result = await client.query('SELECT NOW() as current_time, version() as postgres_version');
    console.log('⏰ Current time:', result.rows[0].current_time);
    console.log('🐘 PostgreSQL version:', result.rows[0].postgres_version);
    
    // ทดสอบดู tables ที่มี
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('📋 Tables in database:');
    if (tables.rows.length === 0) {
      console.log('   ❌ No tables found! This might be the problem.');
    } else {
      tables.rows.forEach(row => {
        console.log(`   ✅ ${row.table_name}`);
      });
    }
    
    await client.end();
    console.log('🎉 Test completed successfully!');
    
  } catch (error) {
    console.log('❌ Connection failed:');
    console.log('Error:', error.message);
    
    if (error.message.includes('password authentication failed')) {
      console.log('💡 Solution: Check your password in DATABASE_URL');
    } else if (error.message.includes('timeout')) {
      console.log('💡 Solution: Check your internet connection or Supabase status');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('💡 Solution: Check your DATABASE_URL format');
    }
  }
}

testSupabaseConnection(); 