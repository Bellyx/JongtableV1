// server/utils/db.ts
import mysql from 'mysql2/promise';

// ดึงค่า Config ที่เราตั้งไว้ใน nuxt.config.ts
const config = useRuntimeConfig();

// สร้าง Connection Pool เพื่อใช้เชื่อมต่อฐานข้อมูล
// การใช้ Pool จะมีประสิทธิภาพดีกว่าการสร้าง Connection ใหม่ทุกครั้ง
const pool = mysql.createPool({
  host: config.dbHost,
  user: config.dbUser,
  password: config.dbPassword,
  database: config.dbDatabase,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log("MySQL Connection Pool created.");

export default pool;