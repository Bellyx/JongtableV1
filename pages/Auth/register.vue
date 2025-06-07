<template>
  <form @submit.prevent="handleSubmit" class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md space-y-4">
    <h2 class="text-2xl font-semibold text-center">สมัครสมาชิก</h2>

    <!-- Username -->
    <div>
      <label for="username" class="block mb-1 font-medium">Username</label>
      <input
        v-model="form.username"
        type="text"
        id="username"
        class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
    </div>

    <!-- Phone -->
    <div>
      <label for="phone" class="block mb-1 font-medium">เบอร์โทรศัพท์</label>
      <input
        v-model="form.phone"
        type="tel"
        id="phone"
        class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
        required
      />
    </div>

    <!-- Password -->
    <div>
      <label for="password" class="block mb-1 font-medium">Password</label>
      <input
        v-model="form.password"
        type="password"
        id="password"
        class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
        required
      />
    </div>

    <!-- Submit -->
    <button
      type="submit"
      class="w-full py-2 px-4 bg-gradient-to-r from-green-400 to-emerald-600 text-white font-semibold rounded-md shadow hover:shadow-lg hover:brightness-110 transition"
    >
      สมัครสมาชิก
    </button>
      <button
  @click="handleGoogleSignIn"
  type="button"
  class="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition"
>
  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" class="w-5 h-5" />
  <span>สมัครด้วย Google</span>
</button>
  </form>

</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  username: '',
  phone: '',
  password: ''
})

const handleSubmit = () => {
  console.log('สมัครข้อมูล:', form)
  // TODO: ส่งข้อมูลไป API / สร้างบัญชี
  alert('สมัครเรียบร้อยแล้ว (ยังไม่เชื่อม API)')
}
</script>
