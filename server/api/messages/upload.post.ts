// import { defineEventHandler, readMultipartFormData, createError } from 'h3';
// import { writeFile } from 'fs/promises';
// import { join, extname } from 'path';
// import pool from '~/server/utils/db';
// import type { ResultSetHeader } from 'mysql2/promise';

// export default defineEventHandler(async (event) => {
//   // 1. ดึงค่า runtime config
//   const config = useRuntimeConfig();

//   // 2. ส่ง config ที่ได้มาเป็น argument ตัวที่สองให้กับ useSession
//   const session = await useSession(event, config.session);

//   // --- DEBUGGING ---
//   console.log('--- DEBUGGING in /api/messages/upload ---');
//   console.log('Session data from useSession:', JSON.stringify(session.data, null, 2));
//   console.log('--- END DEBUGGING ---');

//   // ข้อมูลผู้ใช้จะอยู่ใน session.data.user
//   const userEmail = session.data.user?.email;

//   if (!userEmail) {
//     throw createError({ statusCode: 401, statusMessage: 'ไม่ได้รับอนุญาต (Unauthorized)' });
//   }

//   const formData = await readMultipartFormData(event);

//   if (!formData || !Array.isArray(formData)) {
//     throw createError({ statusCode: 400, statusMessage: 'ไม่สามารถอ่านข้อมูลฟอร์มได้ หรือข้อมูลที่ส่งมาไม่ถูกต้อง' });
//   }

//   const captionPart = formData.find(p => p && p.name === 'caption');
//   const imagePart = formData.find(p => p && p.name === 'image');

//   if (!captionPart || !imagePart || !imagePart.data || !imagePart.filename) {
//     throw createError({ 
//       statusCode: 400, 
//       statusMessage: 'ข้อมูลไม่ครบถ้วน: กรุณาส่งทั้ง caption และ image' 
//     });
//   }

//   const caption = captionPart.data.toString();
//   const fileExtension = extname(imagePart.filename);
//   const newFilename = `img_${Date.now()}${fileExtension}`;
//   const uploadDir = join(process.cwd(), 'public', 'uploads');
//   const filePath = join(uploadDir, newFilename);

//   await writeFile(filePath, imagePart.data);

//   const db = await pool.getConnection();
//   try {
//     const [result] = await db.execute<ResultSetHeader>(
//       'INSERT INTO messages (caption, image_filename, email) VALUES (?, ?, ?)',
//       [caption, newFilename, userEmail]
//     );

//     if (result.affectedRows === 0) {
//       throw createError({ statusCode: 500, statusMessage: 'ไม่สามารถบันทึกข้อมูลลงฐานข้อมูลได้' });
//     }

//     return { success: true, message: 'อัปโหลดสำเร็จ' };
//   } catch (error) {
//     console.error('Database insert error:', error);
//     throw createError({ statusCode: 500, statusMessage: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
//   } finally {
//     db.release();
//   }
// });

import { defineEventHandler, readMultipartFormData, createError } from 'h3';
import { writeFile } from 'fs/promises';
import { join, extname } from 'path';
import pool from '~/server/utils/db';
import type { ResultSetHeader } from 'mysql2/promise';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const session = await useSession(event, config.session);
  const userEmail = session.data.user?.email;

  if (!userEmail) {
    throw createError({ statusCode: 401, message: 'ไม่ได้รับอนุญาต (Unauthorized)' });
  }

  const formData = await readMultipartFormData(event);

  if (!formData || !Array.isArray(formData)) {
    throw createError({ statusCode: 400, message: 'ไม่สามารถอ่านข้อมูลฟอร์มได้' });
  }

  const captionPart = formData.find(p => p && p.name === 'caption');
  const imagePart = formData.find(p => p && p.name === 'image');

  if (!captionPart || !imagePart || !imagePart.data || !imagePart.filename) {
    throw createError({ statusCode: 400, message: 'ข้อมูลไม่ครบถ้วน: กรุณาส่งทั้ง caption และ image' });
  }

  const caption = captionPart.data.toString();
  const fileExtension = extname(imagePart.filename);
  const newFilename = `img_${Date.now()}${fileExtension}`;
  const uploadDir = join(process.cwd(), 'public', 'uploads');
  const filePath = join(uploadDir, newFilename);

  await writeFile(filePath, imagePart.data);

  const db = await pool.getConnection();
  try {
    await db.execute<ResultSetHeader>(
      'INSERT INTO messages (caption, image_filename, email) VALUES (?, ?, ?)',
      [caption, newFilename, userEmail]
    );
    return { success: true };
  } catch (error) {
    console.error('[Upload Error]', error);
    throw createError({ statusCode: 500, message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
  } finally {
    db.release();
  }
});