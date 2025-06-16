// server/api/bookings/create.post.ts

import pool from '~/server/utils/db';
import { generatePromptPayQrCode } from '~/server/utils/promptpay';
import type { RowDataPacket } from 'mysql2';

// กำหนดค่าคงที่
const DEPOSIT_AMOUNT = 1; // เงินมัดจำ 200 บาท
const PROMPTPAY_ID = '0863116240'; // <<-- !!! แก้ไขเป็นเบอร์ PromptPay ของร้านคุณ !!!
const PAYMENT_EXPIRY_HOURS = 1; // การจองหมดอายุใน 1 ชั่วโมง

/**
 * Helper function to format a JavaScript Date object into a MySQL DATETIME format string.
 * @param date The date to format.
 * @returns A string in 'YYYY-MM-DD HH:MI:SS' format.
 */
function toMySQLDateTime(date: Date): string {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

export default defineEventHandler(async (event) => {
  try {
    // 1. อ่านข้อมูลที่ส่งมาจาก Frontend
    const body = await readBody(event);
    const { name, email, booking_datetime, guests } = body;

    if (!name || !email || !booking_datetime || !guests) {
      throw createError({
        statusCode: 400,
        statusMessage: 'กรุณากรอกข้อมูลให้ครบถ้วน',
      });
    }

    const bookingDate = new Date(booking_datetime);
    if (isNaN(bookingDate.getTime())) {
      throw createError({
        statusCode: 400,
        statusMessage: 'รูปแบบวันที่และเวลาไม่ถูกต้อง',
      });
    }

    // 2. สร้างเลขที่การจอง (Booking Reference)
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const datePrefix = `${year}${month}${day}`;

    const [countResult] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) as count FROM bookings WHERE booking_ref LIKE ?",
      [`E${datePrefix}%`]
    );
    const runningNumber = countResult[0].count + 1;
    const paddedRunningNumber = runningNumber.toString().padStart(4, '0');
    
    const booking_ref = `E${datePrefix}${paddedRunningNumber}`;

    // 3. คำนวณยอดที่ต้องชำระ
    const payment_amount = DEPOSIT_AMOUNT + (runningNumber / 100);

    // 4. สร้าง QR Code
    const qrCodePayload = generatePromptPayQrCode(PROMPTPAY_ID, payment_amount);

    // 5. กำหนดเวลาหมดอายุ
    const expires_at = new Date();
    expires_at.setHours(expires_at.getHours() + PAYMENT_EXPIRY_HOURS);

    // 6. บันทึกข้อมูลลงฐานข้อมูล
    const sql = `
      INSERT INTO bookings 
        (name, email, booking_ref, booking_date, guests, deposit_amount, payment_amount, status, expires_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING_PAYMENT', ?)
    `;
    
    // *** จุดที่แก้ไข ***
    // ใช้ฟังก์ชัน toMySQLDateTime เพื่อแปลง format ของวันที่ก่อนส่งเข้า DB
    await pool.query(sql, [
      name,
      email,
      booking_ref,
      toMySQLDateTime(bookingDate),
      guests,
      DEPOSIT_AMOUNT,
      payment_amount,
      toMySQLDateTime(expires_at)
    ]);

    // 7. ส่งข้อมูลกลับไปให้ Frontend
    return {
      message: 'การจองถูกสร้างขึ้นเรียบร้อยแล้ว กรุณาชำระเงินมัดจำ',
      booking_ref: booking_ref,
      payment_amount: payment_amount,
      qr_code_payload: qrCodePayload,
      expires_at: expires_at.toISOString()
    };

  } catch (error: any) {
    // *** จุดที่แก้ไข ***
    // เพิ่มการ log error แบบละเอียด เพื่อให้เห็นข้อผิดพลาดจาก Database จริงๆ
    console.error('Error creating booking:', error.message);
    console.error('Original Error Stack:', error.stack);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'เกิดข้อผิดพลาดในระบบขณะบันทึกข้อมูล',
    });
  }
});