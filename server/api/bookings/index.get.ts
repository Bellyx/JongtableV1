import pool from '~/server/utils/db';
import { defineEventHandler, getQuery, createError } from 'h3';
import type { RowDataPacket } from 'mysql2';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const currentPage = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 20;
  const filterDate = query.date as string;

  const offset = (currentPage - 1) * limit;

  let whereClauses = [];
  let params = [];

  if (filterDate) {
    whereClauses.push('DATE(booking_date) = ?');
    params.push(filterDate);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const db = await pool.getConnection();
  try {
    // --- จุดแก้ไข ---
    // กลับมาใช้ SELECT * เพราะ Key ที่ได้จาก DB เป็นตัวพิมพ์เล็กที่ถูกต้องอยู่แล้ว
    const bookingsSql = `
      SELECT *
      FROM bookings 
      ${whereSql}
      ORDER BY booking_ref DESC 
      LIMIT ? OFFSET ?
    `;
    const bookingsParams = [...params, limit, offset];
    const [bookingsRows] = await db.query<RowDataPacket[]>(bookingsSql, bookingsParams);

    const countSql = `SELECT COUNT(id) as total FROM bookings ${whereSql}`;
    const [countRows] = await db.query<RowDataPacket[]>(countSql, params);
    const totalBookings = countRows[0].total;
    
    return {
      bookings: bookingsRows,
      total: totalBookings
    };

  } catch (error) {
    console.error('API Error in /api/bookings/index.get.ts:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    });
  } finally {
    db.release();
  }
});