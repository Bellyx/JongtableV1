// server/api/auth/logout.post.ts
import { defineEventHandler, useSession } from 'h3';

export default defineEventHandler(async (event) => {
  const session = await useSession(event, {
    // ---- ใช้ Key เดียวกันกับไฟล์ login.post.ts ----
    password: "b9203d36e81c0074043393910ede8456d2ca9f57787b191aaf9282210c471d91d0a8cf9d84e9615a285f4917c4afce4e",
  });

  await session.clear();
  
  return { success: true, message: 'Logged out successfully' };
});