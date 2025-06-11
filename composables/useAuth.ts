import type { User } from '../types'

export const useAuth = () => {
  // สร้าง state 'user' โดยใช้ useState ของ Nuxt เพื่อให้เป็น state ที่แชร์กันได้ทั้งแอป
  const userState = useState<User | null>('user', () => null)

  /**
   * ฟังก์ชันสำหรับอัปเดต state เมื่อผู้ใช้ล็อกอินสำเร็จ
   * @param user - ข้อมูลผู้ใช้ที่ได้มาจาก API
   */
  const login = (user: User) => {
    userState.value = user
  }

  /**
   * ฟังก์ชันสำหรับเคลียร์ state เมื่อผู้ใช้ล็อกเอาท์
   */
  const logout = async () => {
    // เรียก API เพื่อเคลียร์ session cookie ฝั่ง server
    await $fetch('/api/auth/logout', { method: 'POST' })
    // เคลียร์ state ฝั่ง client
    userState.value = null
    // อาจจะเด้งไปหน้าแรกหลัง logout
    await navigateTo('/')
  }

  return {
    // ส่งค่า user ออกไปแบบอ่านอย่างเดียว (readonly) เพื่อป้องกันการแก้ไขโดยตรงจากภายนอก
    // การแก้ไขจะทำผ่านฟังก์ชัน login และ logout เท่านั้น
    user: readonly(userState),
    login,
    logout
  }
}