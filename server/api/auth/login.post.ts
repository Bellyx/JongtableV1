// server/api/auth/login.post.ts
import pool from '../../utils/db'; // แก้ไข path ตามโครงสร้าง
import bcrypt from 'bcrypt';
import { defineEventHandler, readBody, createError, useSession } from 'h3';
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

    console.log('--- Login Attempt ---');
    console.log('Email:', email);
    console.log('User found in DB:', user);

    if (!user) {
      console.log('Result: User not found.');
      // ใช้ createError เพื่อให้ฝั่ง client จัดการ error ได้ง่าย
      throw createError({ statusCode: 401, statusMessage: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }
    
    console.log('Hashed password from DB:', user.hashedPassword);
    
    if (typeof user.hashedPassword !== 'string') {
        console.error('Error: Hashed password is not a string!');
        throw new Error('Database configuration issue.');
    }

    const isPasswordMatch = await bcrypt.compare(plainTextPassword, user.hashedPassword);

    console.log('Result of bcrypt.compare:', isPasswordMatch);

    if (!isPasswordMatch) {
      throw createError({ statusCode: 401, statusMessage: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    // --- ส่วนที่เพิ่มเข้ามาสำหรับการสร้าง Session ---
    const session = await useSession(event, {
      password: process.env.API_SECRET || 'your-super-secret-key-32-chars-long',
      maxAge: 60 * 60 * 24 * 7 // 7 วัน
    });
    await session.update({
      user: {
        id: user.id,
        role: user.role,
      }
    });
    // --- สิ้นสุดส่วนที่เพิ่มเข้ามา ---

    const userProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    
    // ส่งข้อมูลผู้ใช้กลับไปให้ client หลัง login สำเร็จ
    return { success: true, user: userProfile };

  } catch (error: any) {
    console.error('Login API Error:', error.message || error);
    // ส่งต่อ error ที่สร้างจาก createError หรือสร้าง error ใหม่
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์',
    });
  } finally {
    db.release();
  }
});