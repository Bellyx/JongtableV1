export default defineEventHandler(async (event) => {
  // เคลียร์ Session
  const session = await useSession(event, {
    password: process.env.API_SECRET || 'your-super-secret-key-32-chars-long'
  })
  await session.clear()

  return { message: 'Logged out successfully' }
})