// import { defineEventHandler, createError } from 'h3';
// import pool from '~/server/utils/db'; // อ้างอิงจาก server/utils/db.ts
// import type { RowDataPacket } from 'mysql2/promise';

// // เพิ่ม email ใน interface
// interface ImageRecord {
//   id: number;
//   caption: string;
//   image_filename: string;
//   email: string | null; // email อาจจะเป็นค่าว่างได้
//   created_at: string;
// }

// export default defineEventHandler(async (event) => {
//   const db = await pool.getConnection();
//   try {
//     // เพิ่ม email ใน query
//     const [rows] = await db.query<RowDataPacket[]>(
//       'SELECT id, caption, image_filename, email, created_at FROM messages ORDER BY created_at DESC'
//     );
    
//     const images: ImageRecord[] = Array.isArray(rows) ? rows as ImageRecord[] : [];

//     return { images };

//   } catch (error) {
//     console.error('Gallery fetch error:', error);
//     throw createError({ statusCode: 500, statusMessage: 'ไม่สามารถดึงข้อมูลรูปภาพได้' });
//   } finally {
//     db.release();
//   }
// });
import { defineEventHandler } from 'h3';
import pool from '~/server/utils/db';
import type { RowDataPacket } from 'mysql2/promise';

export default defineEventHandler(async () => {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT id, caption, image_filename, email, created_at, votes FROM messages ORDER BY created_at DESC'
  );
  return { images: rows };
});