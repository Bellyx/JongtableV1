export default defineNuxtPlugin(async (nuxtApp) => {
  const { user, login } = useAuth()

  // ถ้ามีข้อมูล user ใน state อยู่แล้ว (เช่น เปลี่ยนหน้าแบบปกติ) ไม่ต้องทำอะไร
  if (user.value) {
    return
  }

  try {
    // ลองดึงข้อมูลผู้ใช้จาก session cookie ผ่าน API /api/auth/me
    const data = await $fetch('/api/auth/me')

    // ถ้าดึงข้อมูลสำเร็จ ให้เรียกฟังก์ชัน login เพื่ออัปเดต state
    if (data.user) {
      login(data.user)
    }
  } catch (error) {
    // หากเกิด error ไม่ต้องทำอะไร ปล่อยให้ state เป็น null ไป
    console.error('Could not fetch user session:', error)
  }
})