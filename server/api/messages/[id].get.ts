import { defineEventHandler } from 'h3';
import pool from '~/server/utils/db';
import type { RowDataPacket } from 'mysql2/promise';

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing ID' });
  }
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM messages WHERE id = ?', [id]);
  if (rows.length === 0) {
    throw createError({ statusCode: 404, message: 'Message not found' });
  }
  return rows[0];
});