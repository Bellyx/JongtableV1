// middleware/auth-admin.ts

export default defineNuxtRouteMiddleware((to, from) => {
  // ในตัวอย่างนี้ เราจะจำลองการตรวจสอบสิทธิ์
  // ในโปรเจกต์จริง ควรใช้ state management (เช่น Pinia) หรือ cookie
  // เพื่อเก็บข้อมูลการล็อกอินของผู้ใช้
  const user = { role: 'admin' }; // <<-- ส่วนนี้ให้เปลี่ยนเป็น Logic การดึงข้อมูลผู้ใช้จริง

  // ตรวจสอบว่าผู้ใช้มีสิทธิ์เป็น 'admin' หรือไม่
  if (user.role !== 'admin') {
    // หากไม่มีสิทธิ์ ให้ redirect ไปยังหน้าล็อกอิน หรือหน้าหลัก
    // return navigateTo('/auth/signin');
    // หรือแสดงหน้า 404 Not Found
    return abortNavigation();
  }

  // หากมีสิทธิ์ ให้เข้าสู่หน้าต่อไปได้
})