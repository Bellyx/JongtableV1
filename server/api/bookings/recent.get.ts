import db from '../../utils/db';

export default defineEventHandler(async (event) => {
  try {
    // ผมจะสมมติว่าตารางของคุณชื่อ 'bookings' และมีคอลัมน์ตามนี้นะครับ
    // หากชื่อตารางหรือคอลัมน์ต่างไป สามารถแก้ไข query ตรงนี้ได้เลย
    const [rows] = await db.query(`
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
    `)

    return {
      bookings: rows
    }
  } catch (error) {
    console.error('Error fetching recent bookings:', error)
    // ส่ง response แสดงข้อผิดพลาดกลับไป
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error: Could not fetch bookings'
    })
  }
})