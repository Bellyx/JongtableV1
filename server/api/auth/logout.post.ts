import { defineEventHandler, useSession } from 'h3';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const session = await useSession(event, config.session);

  await session.clear();
  
  return { success: true, message: 'Logged out successfully' };
});