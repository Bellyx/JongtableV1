// File: server/api/bookings/recent.get.ts

import { defineEventHandler, createError,  useSession } from 'h3';
import  db  from '~/server/utils/db';
import type { Booking, SessionData } from '~/types';

export default defineEventHandler(async (event) => {
  // 1. เรียกใช้ useRuntimeConfig() **โดยไม่ต้องใส่ Argument**
  const config = useRuntimeConfig();

  // 2. ส่ง config.session เป็น Argument ที่สองให้กับ useSession
  const session = await useSession<SessionData>(event, config.session);

  // 3. เข้าถึงข้อมูลผู้ใช้ที่อยู่ใน session.data
  const user = session.data?.user;

  // 4. ตรวจสอบสิทธิ์
  if (!user || !user.email) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  // 5. เตรียมคำสั่ง SQL
  const sql = `
    SELECT 
      ID,
      NAME,
      email,
      booking_ref,
      booking_date,
      guests,
      deposit_amount,
      payment_amount,
      slip_url,
      payment_timestamp,
      created_at,
      expires_at,
      status
    FROM 
      bookings 
    WHERE 
      email = ? 
    ORDER BY 
      booking_date DESC
    LIMIT 2
  `;

  try {
    // 6. เรียกใช้ Query
    const [rows] = await db.query(sql, [user.email]);
    const bookings = rows as Booking[];
    
    return {
      bookings: bookings
    };
    
  } catch (error) {
    console.error('Error fetching recent bookings:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error: Could not fetch bookings'
    });
  }
});