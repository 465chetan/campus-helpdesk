const db = require('./config/db');

async function test() {
  try {
    const [rows] = await db.query('SELECT 1+1 as result');
    console.log('✅ Database connected successfully!', rows);
    process.exit(0);
  } catch (err) {
    console.log('❌ Database connection failed:', err.message);
    process.exit(1);
  }
}

test();