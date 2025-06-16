// server/api/bookings/status/[ref].get.ts
import db from '~/server/utils/db';
import type { RowDataPacket } from 'mysql2';

export default defineEventHandler(async (event) => {
  try {
    const bookingRef = event.context.params?.ref;

    if (!bookingRef) {
      throw createError({ statusCode: 400, statusMessage: 'Booking reference is required' });
    }

    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT status FROM bookings WHERE booking_ref = ?",
      [bookingRef]
    );

    if (rows.length === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Booking not found' });
    }

    return { status: rows[0].status };

  } catch (error: any) {
    console.error("Error fetching booking status:", error);
    throw createError({ 
        statusCode: error.statusCode || 500, 
        statusMessage: error.data?.statusMessage || 'Failed to fetch status' 
    });
  }
});