import pool from '~/server/utils/db';
import { defineEventHandler, createError } from 'h3';
import type { RowDataPacket } from 'mysql2';

export default defineEventHandler(async (event) => {
  const bookingId = event.context.params?.id;

  if (!bookingId) {
    throw createError({ statusCode: 400, statusMessage: 'Booking ID is required' });
  }

  const db = await pool.getConnection();
  try {
    // --- จุดแก้ไข ---
    // กลับมาใช้ SELECT * เช่นกัน และเอา JOIN ที่ไม่จำเป็นออกก่อนเพื่อความเรียบง่าย
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT * FROM bookings WHERE id = ?`,
      [bookingId]
    );
    
    if (rows.length === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Booking not found' });
    }

    return rows[0];

  } catch (error) {
    console.error(`Error fetching booking ID ${bookingId}:`, error);
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
  } finally {
    db.release();
  }
});