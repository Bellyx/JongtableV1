// server/api/auth/login.post.ts
// import pool from '~/server/utils/db';
import pool from '../../utils/db';
import bcrypt from 'bcrypt';
import { defineEventHandler, readBody, createError } from 'h3';
import type { RowDataPacket } from 'mysql2';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password: plainTextPassword } = body;

  if (!email || !plainTextPassword) {
    throw createError({
      statusCode: 400,
      statusMessage: 'กรุณากรอกอีเมลและรหัสผ่าน',
    });
  }

  const db = await pool.getConnection();
  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      'SELECT id, name, email, role, password AS hashedPassword FROM users WHERE email = ?',
      [email]
    );

    const user = rows[0];

    // --- DEBUGGING START ---
    console.log('--- Login Attempt ---');
    console.log('Email:', email);
    console.log('User found in DB:', user); // แสดงข้อมูล user ทั้งหมดที่เจอ
    // --- DEBUGGING END ---

    if (!user) {
      console.log('Result: User not found.');
      return { success: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' };
    }
    
    // --- MORE DEBUGGING ---
    // ตรวจสอบข้อมูล hashedPassword ที่ได้จาก DB
    console.log('Hashed password from DB:', user.hashedPassword);
    console.log('Type of hashed password:', typeof user.hashedPassword);
    // --- DEBUGGING END ---

    // ตรวจสอบให้แน่ใจว่า hashedPassword เป็น string ก่อนเปรียบเทียบ
    if (typeof user.hashedPassword !== 'string') {
        console.error('Error: Hashed password is not a string! It might be a Buffer.');
        throw new Error('Database configuration or driver issue.');
    }

    const isPasswordMatch = await bcrypt.compare(plainTextPassword, user.hashedPassword);

    // --- FINAL DEBUGGING ---
    console.log('Result of bcrypt.compare:', isPasswordMatch); // ผลลัพธ์ควรเป็น true ถ้าถูกต้อง
    // --- DEBUGGING END ---

    if (!isPasswordMatch) {
      return { success: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' };
    }

    const userProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return { success: true, user: userProfile };

  } catch (error) {
    if (typeof error === 'object' && error !== null && 'statusCode' in error){
        console.error('Login API Error:', error);
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์',
    });
  } finally {
    db.release();
  }
});
