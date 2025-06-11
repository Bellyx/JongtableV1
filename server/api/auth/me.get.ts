import  pool  from '../../utils/db'
export default defineEventHandler(async (event) => {
  // อ่านข้อมูลจาก Session
  const session = await useSession(event, {
    password: process.env.API_SECRET || 'your-super-secret-key-32-chars-long'
  })

  // ถ้าไม่มี session หรือไม่มีข้อมูล user ใน session ให้ส่งค่าว่างกลับไป
  if (!session.data?.user?.id) {
    return { user: null }
  }

  // ดึงข้อมูล user ทั้งหมดจากฐานข้อมูลโดยใช้ id จาก session
  const [rows]: any = await pool.query('SELECT id, name, email, phone, role FROM users WHERE id = ?', [session.data.user.id])
  const user = rows[0]

  if (!user) {
    // ถ้าไม่เจอ user ใน DB (อาจถูกลบไปแล้ว) ให้เคลียร์ session ทิ้ง
    await session.clear()
    return { user: null }
  }

  return { user }
})