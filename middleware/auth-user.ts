// // File: middleware/auth-user.ts
// import type { MeApiResponse } from '~/types'; // 1. นำเข้า Interface ใหม่
// export default defineNuxtRouteMiddleware((to, from) => {
//   // 1. ดึงสถานะการล็อกอินจาก useAuth() composable
//   const { isLoggedIn } = useAuth();

//   // 2. ตรวจสอบว่าผู้ใช้ล็อกอินแล้วหรือยัง
//   // isLoggedIn เป็น computed property ที่จะคืนค่า true หากมีข้อมูลผู้ใช้ในระบบ
//   if (!isLoggedIn.value) {
//     // 3. ถ้ายังไม่ได้ล็อกอิน ให้ redirect ไปยังหน้า Sign In
//     // ใช้ { replace: true } เพื่อไม่ให้ผู้ใช้กดปุ่ม back กลับมายังหน้าที่ป้องกันไว้ได้
//     return navigateTo('/Auth/signin', { replace: true });
//   }

//   // ถ้าล็อกอินแล้ว ไม่ต้องทำอะไร ปล่อยให้เข้าไปยังหน้าที่ต้องการได้เลย
// });

// middleware/auth-admin.ts

import { useAuth } from '~/composables/useAuth';
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, login } = useAuth();

  // หากใน State มีข้อมูล user อยู่แล้ว (เช่นการเปลี่ยนหน้าปกติ)
  // ให้ตรวจสอบ role และอนุญาตให้ผ่านได้เลย ไม่ต้องทำอะไรเพิ่ม
  if (user.value) {
    // ถ้าไม่ใช่  user ให้ไปหน้าหลัก
    if (user.value.role !== 'user') {
      return navigateTo('/'); 
    }
    // ถ้าเป็น user ให้ผ่าน
    return;
  }

  // โค้ดส่วนนี้จะทำงาน "เฉพาะตอนรีเฟรช" ที่ State ว่างเปล่า
  // ซึ่งการรีเฟรชจะทำงานบน Server เสมอ
  if (process.server) {
    try {
      // เราจะส่ง 'cookie' ของผู้ใช้จากเบราว์เซอร์แนบไปกับ request ที่จะยิงไปหา /api/auth/me
      // เพื่อให้ /api/auth/me รู้ว่าเราเป็นใคร
      const headers = useRequestHeaders(['cookie']);
      
      const { user: userFromApi } = await $fetch('/api/auth/me', {
        headers, // ส่ง cookie ไปด้วย
      });

      // ถ้าได้ข้อมูล user กลับมา ให้เติมลง State
      if (userFromApi) {
        login(userFromApi);
      }
    } catch (e) {
      console.error('Middleware fetch error:', e);
      // หากเกิด error ไม่ต้องทำอะไร user.value จะยังคงเป็น null
    }
  }

  // --- ตรวจสอบครั้งสุดท้าย ---
  // หลังจากพยายามดึงข้อมูลจาก server แล้ว (หรือไม่ได้ดึงเพราะอยู่ฝั่ง client)
  // ให้เช็ค state ล่าสุด ถ้ายังไม่มี user หรือไม่ใช่ admin ให้ไปหน้า login
  // นี่คือปราการด่านสุดท้าย
  if (!user.value || user.value.role !== 'user') {
    return navigateTo('/auth/signin');
  }
});