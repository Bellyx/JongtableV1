// server/api/auth/me.get.ts (เวอร์ชันตรวจสอบ)
import pool from '../../utils/db';
import { defineEventHandler, useSession } from 'h3';
import type { RowDataPacket } from 'mysql2';
import type { SessionData, User } from '~/types';

export default defineEventHandler(async (event) => {
  console.log('--- [/api/auth/me] เริ่มทำงาน ---');

  const session = await useSession<SessionData>(event, {
    password: "b9203d36e81c0074043393910ede8456d2ca9f57787b191aaf9282210c471d91d0a8cf9d84e9615a285f4917c4afce4e",
  });

  // --- เพิ่ม Log เพื่อดูข้อมูลดิบใน Session ---
  console.log('--- [/api/auth/me] ข้อมูลดิบใน Session ที่อ่านได้:', JSON.stringify(session.data, null, 2));

  if (!session.data?.user?.id) {
    console.log('--- [/api/auth/me] ตรวจสอบไม่ผ่าน: ไม่พบ user.id ใน session.data');
    return { user: null };
  }

  console.log(`--- [/api/auth/me] ตรวจสอบผ่าน: พบ user.id: ${session.data.user.id}`);
  const db = await pool.getConnection();
  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      'SELECT id, name, email, phone, role FROM users WHERE id = ?',
      [session.data.user.id]
    );
    const user = rows[0] as User | undefined;

    if (!user) {
      await session.clear();
      return { user: null };
    }
    return { user };
  } catch (error) {
    console.error("Me API Error:", error);
    await session.clear();
    return { user: null };
  } finally {
    db.release();
  }
});