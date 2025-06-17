import pool from '~/server/utils/db';
import { defineEventHandler, readBody, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const bookingId = event.context.params?.id;
  const { status } = await readBody(event);

  if (!bookingId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Booking ID is required',
    });
  }

  if (!status) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Status is required',
    });
  }
  
  // ตรวจสอบว่า status ที่ส่งมาถูกต้องตามที่กำหนดหรือไม่
  const allowedStatuses = ['PENDING_PAYMENT', 'PENDING_VERIFICATION', 'CONFIRMED', 'CANCELLED'];
  if (!allowedStatuses.includes(status)) {
    throw createError({
      statusCode: 400,
      statusMessage: `ค่าสถานะไม่ถูกต้อง ค่าที่อนุญาตคือ: ${allowedStatuses.join(', ')}`,
    });
  }


  const db = await pool.getConnection();
  try {
    const [result] = await db.query(
      'UPDATE bookings SET status = ? WHERE id = ?',
      [status, bookingId]
    );

    // ตรวจสอบว่ามีการอัปเดตแถวข้อมูลจริงหรือไม่
    if ((result as any).affectedRows === 0) {
        throw createError({
        statusCode: 404,
        statusMessage: 'ไม่พบการจองหรือสถานะเป็นเหมือนเดิมแล้ว.',
      });
    }

    return { success: true, message: 'อัปเดตสถานะการจองสำเร็จแล้ว.' };

  } catch (error) {
    console.error(`เกิดข้อผิดพลาดในการอัปเดตสถานะสำหรับรหัสการจอง: ${bookingId}:`, error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    });
  } finally {
    db.release();
  }
});