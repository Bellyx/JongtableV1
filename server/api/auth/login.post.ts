// server/api/auth/login.post.ts
import pool from '../../utils/db';
import bcrypt from 'bcrypt';
import { defineEventHandler, readBody, createError, useSession } from 'h3';
import type { RowDataPacket } from 'mysql2';
import type { SessionData } from '~/types';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password: plainTextPassword } = body;

  if (!email || !plainTextPassword) {
    throw createError({ statusCode: 400, statusMessage: 'กรุณากรอกอีเมลและรหัสผ่าน' });
  }

  const db = await pool.getConnection();
  try {
    const [rows] = await db.execute<RowDataPacket[]>('SELECT id, name, email, role, password AS hashedPassword FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    const isPasswordMatch = await bcrypt.compare(plainTextPassword, user.hashedPassword);

    if (!isPasswordMatch) {
      throw createError({ statusCode: 401, statusMessage: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }
    const config = useRuntimeConfig();
    const session = await useSession<SessionData>(event, {
      password: "b9203d36e81c0074043393910ede8456d2ca9f57787b191aaf9282210c471d91d0a8cf9d84e9615a285f4917c4afce4e",
      maxAge: 60 * 60 * 24 * 7 // 7 วัน
    });
 
    await session.update({
      user: {
        id: user.id,
        email: user.email, // <-- เพิ่มบรรทัดนี้
        role: user.role,
      }
    });

    const userProfile = { id: user.id, name: user.name, email: user.email, role: user.role };
    return { success: true, user: userProfile };

  } catch (error: any) {
    if (!error.statusCode) {
      console.error('[Login] Unexpected Server Error:', error);
    }
    throw error;
  } finally {
    db.release();
  }
});