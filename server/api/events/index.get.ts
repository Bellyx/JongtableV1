// server/api/events/index.get.ts

import { eventHandler, getQuery } from 'h3'
import pool from '../../utils/db';

export default eventHandler(async (event) => {
  try {
    const db = await pool.getConnection();
    const query = getQuery(event)
    const scope = query.scope || 'admin' // ค่า default คือ 'admin'

    let sql = 'SELECT *, NOW() as currentTime FROM events'
    const params: any[] = []

    if (scope === 'public') {
      // สำหรับผู้ใช้ทั่วไป: ดึงเฉพาะกิจกรรมที่อยู่ในช่วงเวลาแสดงผล
      sql += ' WHERE status != "ENDED" AND NOW() BETWEEN display_start_time AND display_end_time'
    }
    
    sql += ' ORDER BY event_date DESC'

    const [rows] = await db.query(sql, params)

    // เพิ่ม "Calculated Status" เพื่อให้ frontend ใช้งานง่าย
    const events = (rows as any[]).map(ev => {
        const now = new Date(ev.currentTime);
        const eventDate = new Date(ev.event_date);
        let calculatedStatus = ev.status;

        if (ev.status !== 'ENDED' && now > eventDate) {
            calculatedStatus = 'กิจกรรมจบลงแล้ว';
        } else if (ev.status === 'ONGOING') {
            calculatedStatus = 'กิจกรรมกำลังเริ่ม';
        } else {
            calculatedStatus = 'เร็วๆ นี้';
        }

        return {
            ...ev,
            calculatedStatus
        }
    });


    return events
  } catch (error: any) {
    console.error('Error fetching events:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' })
  }
})