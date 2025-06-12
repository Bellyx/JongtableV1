// server/api/events/index.post.ts

import { eventHandler, readMultipartFormData } from 'h3'
import { promises as fs } from 'fs'
import path from 'path'
import pool from '../../utils/db';

export default eventHandler(async (event) => {
  try {
    const db = await pool.getConnection();
    const multipartFormData = await readMultipartFormData(event)

    let coverImageUrl: string | null = null
    let detailsImageUrl: string | null = null
    const data: Record<string, any> = {}

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'events')
    await fs.mkdir(uploadDir, { recursive: true })

    for (const part of multipartFormData || []) {
      if (part.name && part.data) {
        if (part.filename) {
          const timestamp = Date.now()
          const uniqueFilename = `${timestamp}-${part.filename}`
          const filePath = path.join(uploadDir, uniqueFilename)
          await fs.writeFile(filePath, part.data)
          const fileUrl = `/uploads/events/${uniqueFilename}`
          if (part.name === 'cover_image') coverImageUrl = fileUrl
          else if (part.name === 'details_image') detailsImageUrl = fileUrl
        } else {
          data[part.name] = part.data.toString('utf-8') || null
        }
      }
    }
    
    // รับข้อมูลใหม่จากฟอร์ม
    const { name, description, event_date, location, status, display_start_time, display_end_time } = data
    if (!name || !event_date) {
      throw createError({ statusCode: 400, statusMessage: 'Missing required fields: name, event_date' })
    }

    // บันทึกข้อมูลลงฐานข้อมูล
    const sql = `
      INSERT INTO events 
      (name, cover_image_url, details_image_url, description, event_date, location, status, display_start_time, display_end_time) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    const [result] = await db.execute(sql, [
        name, coverImageUrl, detailsImageUrl, description, 
        event_date, location, status, display_start_time, display_end_time
    ])

    return { statusCode: 201, message: 'Event created successfully' }
  } catch (error: any) {
    console.error('Error creating event:', error)
    throw createError({ statusCode: 500, statusMessage: error.message || 'Internal Server Error' })
  }
})