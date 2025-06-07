<template>
  <div class=" flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 px-4">
    <form
      @submit.prevent="handleLogin"
      class="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-6"
    >
      <h2 class="text-3xl font-bold text-center text-gray-800">🔐 เข้าสู่ระบบ</h2>

      <!-- Username -->
      <div class="relative">
        <span class="absolute left-3 top-3 text-gray-400">
          <i class="fas fa-user"></i>
        </span>
        <input
          v-model="form.username"
          type="text"
          placeholder="Username"
          required
          class="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <!-- Password -->
      <div class="relative">
        <span class="absolute left-3 top-3 text-gray-400">
          <i class="fas fa-lock"></i>
        </span>
        <input
          v-model="form.password"
          type="password"
          placeholder="Password"
          required
          class="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        class="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-md shadow hover:shadow-lg hover:brightness-110 transition"
      >
        เข้าสู่ระบบ
      </button>
<!-- Divider -->
<div class="relative text-center my-3">
  <span class="absolute inset-0 flex items-center justify-center">
    <span class="bg-white px-3 text-gray-500 text-sm">หรือ</span>
  </span>
  <div class="border-t border-gray-300"></div>
</div>

<!-- Google Sign-In -->
<button
  type="button"
  @click="signInWithGoogle"
  class="w-full flex items-center justify-center gap-3 py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-100 transition"
>
  <img
    src="https://www.svgrepo.com/show/475656/google-color.svg"
    alt="Google"
    class="w-5 h-5"
  />
  <span class="text-gray-700 font-medium">เข้าสู่ระบบด้วย Google</span>
</button>
      <!-- Error Message -->
      <p v-if="error" class="text-red-600 text-sm text-center">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const form = reactive({
  username: '',
  password: ''
})
const error = ref('')
const router = useRouter()

const handleLogin = async () => {
  error.value = ''
  try {
    // 🔧 Mock ตัวอย่าง login
    // เปลี่ยนส่วนนี้ให้เชื่อม API จริงกับ SQL backend ได้
    const res = await fakeLogin(form.username, form.password)

    if (res.role === 'admin') {
      router.push('/admin/dashboard')
    } else if (res.role === 'user') {
      router.push('/dashboard')
    } else {
      error.value = 'ไม่สามารถระบุบทบาทได้'
    }
  } catch (err) {
    error.value = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
  }
}
const signInWithGoogle = async () => {
  try {
    // 🧪 mock login ด้วย Gmail
    const googleUser = await fakeGoogleLogin()

    if (googleUser.role === 'admin') {
      router.push('/admin/dashboard')
    } else {
      router.push('/dashboard')
    }
  } catch (err) {
    error.value = 'เข้าสู่ระบบด้วย Google ล้มเหลว'
  }
}

// mock function จำลอง login ด้วย Google
const fakeGoogleLogin = async () => {
  // จำลองว่าล็อกอินสำเร็จและ backend ตรวจ role จาก email
  return {
    email: 'example@gmail.com',
    role: 'user'
  }
}

// 🧪 mock ฟังก์ชันเลียนแบบการ login และเช็ค role
const fakeLogin = async (username, password) => {
  // ปกติคุณจะ fetch จาก API backend ที่เชื่อม SQL
  if (username === 'admin' && password === 'admin123') {
    return { role: 'admin' }
  } else if (username === 'user' && password === 'user123') {
    return { role: 'user' }
  } else {
    throw new Error('invalid credentials')
  }
}
</script>

<!-- Font Awesome (ไอคอน) -->
<!-- ถ้ายังไม่มีในโครงการคุณ ให้เพิ่มใน `app.vue` หรือ layout.vue -->
<!-- หรือเปลี่ยนเป็น Heroicons หรือ SVG ก็ได้ -->
<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');
</style>
