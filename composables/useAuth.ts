// File: composables/useAuth.ts

import { readonly, useState, computed } from '#imports' // 1. เพิ่ม computed
import type { User } from '../types'

export const useAuth = () => {
  const userState = useState<User | null>('user', () => null)

  // 2. สร้าง computed property สำหรับเช็คสถานะล็อกอิน
  const isLoggedIn = computed(() => !!userState.value)

  const login = (user: User) => {
    userState.value = user
  }

  const logout = async () => {
    // เรียก API เพื่อเคลียร์ session cookie และเคลียร์ state
    await $fetch('/api/auth/logout', { method: 'POST' })
    userState.value = null
    await navigateTo('/', { external: true })
  }

  return {
    user: readonly(userState),
    isLoggedIn, // 3. เพิ่ม isLoggedIn เข้าไปใน return
    login,
    logout
  }
}