import { defineEventHandler } from 'h3';
import pool from '~/server/utils/db';
import type { ResultSetHeader } from 'mysql2/promise';

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing ID' });
  }
  
  const [result] = await pool.execute<ResultSetHeader>(
    'UPDATE messages SET votes = votes + 1 WHERE id = ?',
    [id]
  );

  if (result.affectedRows === 0) {
    throw createError({ statusCode: 404, message: 'Message not found to update' });
  }

  return { success: true };
});