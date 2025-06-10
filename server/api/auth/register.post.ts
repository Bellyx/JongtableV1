// server/api/auth/register.post.ts
// import pool from '~/server/utils/db';
import pool from '../../utils/db';
import bcrypt from 'bcrypt';
import { defineEventHandler, readBody, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, phone, email, password } = body;

  // 1. ตรวจสอบข้อมูลที่รับเข้ามา
  if (!name || !phone || !email || !password) {
    throw createError({
      statusCode: 400, // Bad Request
      statusMessage: 'กรุณากรอกข้อมูลให้ครบถ้วน',
    });
  }

  const db = await pool.getConnection();
  try {
    // 2. ตรวจสอบว่ามีอีเมลนี้ในระบบแล้วหรือยัง
    const [existingUsers] = await db.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      throw createError({
        statusCode: 409, // Conflict
        statusMessage: 'อีเมลนี้ถูกใช้งานแล้ว',
      });
    }

    // 3. เข้ารหัสรหัสผ่านด้วย bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. เพิ่มผู้ใช้ใหม่ลงในฐานข้อมูล
    // role จะเป็น 'user' โดยอัตโนมัติตามค่า DEFAULT ของตาราง
    const [result] = await db.execute(
      'INSERT INTO users (name, phone, email, password) VALUES (?, ?, ?, ?)',
      [name, phone, email, hashedPassword]
    );

    // 5. ส่งข้อความกลับเมื่อสำเร็จ
    return {
      success: true,
      message: 'สมัครสมาชิกสำเร็จ!',
      userId: result.insertId,
    };

  } catch (error) {
    // จัดการ Error ที่อาจเกิดขึ้น
    if (error.statusCode === 409) {
      throw error; // ส่ง error อีเมลซ้ำกลับไปให้ client
    }
    console.error("Register API Error:", error);
    throw createError({
      statusCode: 500, // Internal Server Error
      statusMessage: 'เกิดข้อผิดพลาดในการสมัครสมาชิก',
    });
  } finally {
    db.release(); // คืน connection กลับสู่ pool
  }
});
