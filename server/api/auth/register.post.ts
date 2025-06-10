// server/api/auth/register.post.ts

import pool from '../../utils/db';
import bcrypt from 'bcrypt';
import { defineEventHandler, readBody, createError, H3Error } from 'h3';
// VVV แก้ไข: เพิ่ม 'type' เข้าไปใน import ตามกฎ verbatimModuleSyntax
import type { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, phone, email, password } = body;

  if (!name || !phone || !email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'กรุณากรอกข้อมูลให้ครบถ้วน',
    });
  }

  const db = await pool.getConnection();
  try {
    const [existingUsers] = await db.execute<RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      throw createError({
        statusCode: 409, // Conflict
        statusMessage: 'อีเมลนี้ถูกใช้งานแล้ว',
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [result] = await db.execute<ResultSetHeader>(
      'INSERT INTO users (name, phone, email, password) VALUES (?, ?, ?, ?)',
      [name, phone, email, hashedPassword]
    );

    return {
      success: true,
      message: 'สมัครสมาชิกสำเร็จ!',
      userId: result.insertId,
    };

  } catch (error) {
    if (error instanceof H3Error && error.statusCode === 409) {
      throw error;
    }
    console.error("Register API Error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: 'เกิดข้อผิดพลาดในการสมัครสมาชิก',
    });
  } finally {
    db.release();
  }
});