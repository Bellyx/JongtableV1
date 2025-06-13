// server/api/events/index.get.ts (เวอร์ชันแก้ไข)

import { eventHandler, getQuery } from 'h3'
import pool from '../../utils/db'
import type { PoolConnection } from 'mysql2/promise' // Import Type เพื่อความถูกต้อง

export default eventHandler(async (event) => {
  // 1. ประกาศตัวแปร connection ไว้นอก try
  let db: PoolConnection | undefined; 
  
  try {
    // 2. ยืม connection มาใช้เหมือนเดิม
    db = await pool.getConnection();
    
    const query = getQuery(event)
    const scope = query.scope || 'admin'

    let sql = 'SELECT *, NOW() as currentTime FROM events'
    const params: any[] = []

    if (scope === 'public') {
      sql += ' WHERE status != "ENDED" AND NOW() BETWEEN display_start_time AND display_end_time'
    }
    
    sql += ' ORDER BY event_date DESC'

    const [rows] = await db.query(sql, params)

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
  } finally {
    // 3. ส่วนที่สำคัญที่สุด: คืน connection กลับสู่ pool
    // บล็อก finally จะทำงานเสมอ ไม่ว่าจะสำเร็จหรือเกิด error
    if (db) {
      db.release();
      console.log("Database connection released."); // เพิ่ม log เพื่อให้เห็นว่าคืนแล้ว
    }
  }
})