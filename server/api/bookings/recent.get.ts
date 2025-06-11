// server/api/bookings/recent.get.ts
import db from '../../utils/db';
import { createError, defineEventHandler } from 'h3';
import type { RowDataPacket } from 'mysql2/promise'; // 1. นำเข้า Type ที่จำเป็น

export default defineEventHandler(async (event) => {
  try {
    // 2. ระบุ Type ของผลลัพธ์ที่เราคาดหวัง (<RowDataPacket[]>)
    const [rows] = await db.query<RowDataPacket[]>(`
      SELECT 
        id, 
        name, 
        booking_date, 
        guests, 
        status 
      FROM 
        bookings 
      ORDER BY 
        booking_date DESC 
      LIMIT 10
    `);

    // 3. ตรวจสอบเพื่อความปลอดภัยว่าผลลัพธ์เป็น Array จริงๆ
    // และคืนค่าเป็น Array ว่างหากเกิดกรณีที่ไม่คาดคิด
    if (!Array.isArray(rows)) {
        return { bookings: [] };
    }

    return {
      bookings: rows
    };
    
  } catch (error) {
    console.error('Error fetching recent bookings:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error: Could not fetch bookings'
    });
  }
});