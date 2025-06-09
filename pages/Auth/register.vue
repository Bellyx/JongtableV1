<template>
  <form @submit.prevent="register" class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md space-y-4">
    <h2 class="text-2xl font-semibold text-center">สมัครสมาชิก</h2>

    <input v-model="form.username" type="text" placeholder="ชื่อ" class="input" required />
    <input v-model="form.phone" type="tel" placeholder="เบอร์โทร" class="input" required />
    <input v-model="form.email" type="email" placeholder="อีเมล" class="input" required />
    <input v-model="form.password" type="password" placeholder="รหัสผ่าน" class="input" required />

    <button type="submit" class="btn">สมัครสมาชิก</button>

    <button type="button" @click="loginWithGoogle" class="btn-outline">
      <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-5 h-5" />
      สมัครด้วย Google
    </button>
  </form>
</template>

<script setup>
const form = reactive({
  username: '',
  phone: '',
  email: '',
  password: ''
})

const register = async () => {
  await $fetch('http://localhost:3001/api/register', {
    method: 'POST',
    body: form
  })
  alert('สมัครสมาชิกสำเร็จ')
}

const { $supabase } = useNuxtApp()

const loginWithGoogle = async () => {
  const { error } = await $supabase.auth.signInWithOAuth({
    provider: 'google'
  })
  if (error) console.error(error)
}
</script>

<style scoped>
.input {
  @apply w-full px-4 py-2 border rounded-md focus:outline-none;
}
.btn {
  @apply w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md;
}
.btn-outline {
  @apply w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md;
}
</style>
