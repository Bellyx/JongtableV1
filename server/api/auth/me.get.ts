// server/api/auth/me.get.ts
import pool from '../../utils/db';
import { defineEventHandler, useSession } from 'h3';
import type { RowDataPacket } from 'mysql2';
import type { SessionData, User } from '~/types';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const session = await useSession<SessionData>(event, config.session);

  if (!session.data?.user?.id) {
    return { user: null };
  }

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