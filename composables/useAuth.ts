import { readonly, useState } from '#imports'
import type { User } from '../types'

export const useAuth = () => {
  const userState = useState<User | null>('user', () => null)

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
    login,
    logout
  }
}
