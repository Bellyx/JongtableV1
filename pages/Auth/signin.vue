<!-- pages/Auth/signin.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
    <!-- Enhanced Background decoration -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-pulse"></div>
      <div class="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-pulse"></div>
      <div class="absolute top-1/3 left-1/3 w-72 h-72 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse"></div>
      <div class="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse"></div>
    </div>

    <!-- Floating elements -->
    <div class="absolute top-20 left-20 w-3 h-3 bg-white/30 rounded-full animate-bounce"></div>
    <div class="absolute top-32 right-32 w-2 h-2 bg-white/40 rounded-full animate-bounce delay-100"></div>
    <div class="absolute bottom-20 left-32 w-4 h-4 bg-white/20 rounded-full animate-bounce delay-200"></div>

    <!-- Login Container -->
    <div class="relative z-10 w-full max-w-md mx-4">
      <!-- Enhanced Logo/Brand Section -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-3xl shadow-2xl mb-4 transform hover:scale-110 transition-all duration-300 hover:rotate-3">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
        </div>
        <h1 class="text-2xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent mb-2">
          ยินดีต้อนรับ! 👋
        </h1>
        <p class="text-gray-600 text-sm">เข้าสู่ระบบเพื่อดำเนินการต่อ</p>
      </div>

      <!-- Alert Component -->
      <div v-if="alertMessage" class="mb-6 transform transition-all duration-300 ease-in-out">
        <div :class="[
          'flex items-center p-4 rounded-2xl shadow-lg border-l-4 backdrop-blur-sm',
          alertType === 'error' 
            ? 'bg-red-50/90 border-red-500 text-red-800' 
            : 'bg-green-50/90 border-green-500 text-green-800'
        ]">
          <div class="flex-shrink-0 mr-3">
            <svg v-if="alertType === 'error'" class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <svg v-else class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="flex-1">
            <p class="font-medium">{{ alertMessage }}</p>
          </div>
          <button @click="alertMessage = ''" class="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Enhanced Login Form -->
      <form @submit.prevent="handleLogin" class="bg-white/90 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/30 space-y-6 hover:shadow-3xl transition-all duration-300">
        
        <!-- Email Field -->
        <div class="space-y-2">
          <label class="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
            </svg>
            อีเมล
          </label>
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <input
              v-model="form.email"
              type="email"
              placeholder="กรอกอีเมลของคุณ"
              required
              :class="[
                'w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none transition-all duration-300 text-sm font-medium',
                emailError 
                  ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100 bg-red-50/50' 
                  : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white/70 hover:bg-white/90 focus:bg-white'
              ]"
              @blur="validateEmail"
              @input="emailError = ''"
            />
          </div>
          <p v-if="emailError" class="text-red-500 text-xs mt-1 flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {{ emailError }}
          </p>
        </div>

        <!-- Password Field -->
        <div class="space-y-2">
          <label class="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <svg class="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            รหัสผ่าน
          </label>
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="กรอกรหัสผ่านของคุณ"
              required
              :class="[
                'w-full pl-12 pr-12 py-4 border-2 rounded-2xl focus:outline-none transition-all duration-300 text-sm font-medium',
                passwordError 
                  ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100 bg-red-50/50' 
                  : 'border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 bg-white/70 hover:bg-white/90 focus:bg-white'
              ]"
              @blur="validatePassword"
              @input="passwordError = ''"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-all duration-300 hover:scale-110"
            >
              <svg v-if="showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
              </svg>
              <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
            </button>
          </div>
          <p v-if="passwordError" class="text-red-500 text-xs mt-1 flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {{ passwordError }}
          </p>
        </div>

        <!-- Enhanced Submit Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-4 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl hover:from-blue-600 hover:via-purple-700 hover:to-pink-600 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm flex items-center justify-center gap-3 group"
        >
          <svg v-if="isLoading" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
          </svg>
          {{ isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
        </button>

        <!-- Additional Links -->
        <div class="text-center pt-4 space-y-2">
          <p class="text-gray-600 text-sm">ลืมรหัสผ่าน? 
            <a href="#" class="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors">คลิกที่นี่</a>
          </p>
          <p class="text-gray-600 text-sm">ยังไม่มีบัญชี? 
            <a href="#" class="text-purple-600 hover:text-purple-800 font-semibold hover:underline transition-colors">สมัครสมาชิก</a>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'; 
import { useFetch, navigateTo, useHead, useToast, useAuth } from '#imports';
import type { LoginApiResponse } from '~/types'; // 1. นำเข้า Interface ใหม่
// Global state สำหรับเก็บข้อมูลผู้ใช้หลัง login
const { login } = useAuth();
const toast = useToast();

const form = ref({
  email: '',
  password: ''
});
const isLoading = ref(false);
const showPassword = ref(false);

// Alert system
const alertMessage = ref('');
const alertType = ref('error'); // 'error' | 'success'

// Validation errors
const emailError = ref('');
const passwordError = ref('');

// Validation functions
const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.value.email) {
    emailError.value = 'กรุณากรอกอีเมล';
  } else if (!emailRegex.test(form.value.email)) {
    emailError.value = 'รูปแบบอีเมลไม่ถูกต้อง';
  } else {
    emailError.value = '';
  }
};

const validatePassword = () => {
  if (!form.value.password) {
    passwordError.value = 'กรุณากรอกรหัสผ่าน';
  } else if (form.value.password.length < 6) {
    passwordError.value = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
  } else {
    passwordError.value = '';
  }
};

const showAlert = (message: string, type: 'error' | 'success' = 'error') => {
  alertMessage.value = message;
  alertType.value = type;
  
  // Auto hide alert after 5 seconds
  setTimeout(() => {
    alertMessage.value = '';
  }, 5000);
};

const handleLogin = async () => {
  // Validate form
  validateEmail();
  validatePassword();
  
  // ตรวจสอบข้อมูลเบื้องต้นก่อนส่ง
  if (!form.value.email || !form.value.password) {
    showAlert('กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน');
    toast.add({ title: 'Error', description: 'กรุณากรอกอีเมลและรหัสผ่าน', color: 'red', icon: 'i-heroicons-x-circle' });
    return;
  }

  // Check if there are validation errors
  if (emailError.value || passwordError.value) {
    showAlert('กรุณาแก้ไขข้อมูลที่ไม่ถูกต้อง');
    return;
  }
  
  isLoading.value = true;
  try {
    // เรียกใช้ API /api/auth/login ด้วย useFetch
   const { data, error } = await useFetch<LoginApiResponse>('/api/auth/login', {
      method: 'POST',
      body: {
        email: form.value.email,
        password: form.value.password
      },
    });

    if (error.value) {
      // ถ้ามี error จาก useFetch ให้ใช้ข้อความจาก error.value
      // ซึ่งมาจาก statusMessage ที่เรา throw ไว้ใน API
      const errorMessage = error.value.data?.message || error.value.data?.statusMessage || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
      showAlert(errorMessage);
      // toast.add({ title: 'Error', description: errorMessage, color: 'red', icon: 'i-heroicons-x-circle' });
      return;
    }

    if (!data.value?.success) {
      // กรณีที่ request สำเร็จแต่ server ตอบว่า success: false (กรณีเผื่อไว้)
      const errorMessage = 'เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง';
      showAlert(errorMessage);
      // toast.add({ title: 'Error', description: errorMessage, color: 'red', icon: 'i-heroicons-x-circle' });
      return;
    }

     // ถ้า Login สำเร็จ, เก็บข้อมูล user ไว้ใน state
      login(data.value.user);

      showAlert(`ยินดีต้อนรับคุณ, ${data.value.user.name}!`, 'success');

      toast.add({
        title: 'Success',
        description: `ยินดีต้อนรับคุณ, ${data.value.user.name}!`,
        icon: 'i-heroicons-check-circle'
      });

      // รอ 0.5 วินาทีก่อนเข้าสู่ระบบ
      await new Promise(resolve => setTimeout(resolve, 500));

      // นำทางไปยังหน้า Dashboard ตาม role ของ user
      if (data.value.user.role === 'admin') {
        await navigateTo('/admin/dashboard');
      } else {
        await navigateTo('/users/dashboard');
      }

  } catch (e) {
    console.error('An unexpected error occurred:', e);
    showAlert('เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง');
    toast.add({ title: 'Error', description: 'เกิดข้อผิดพลาดที่ไม่คาดคิด', color: 'red', icon: 'i-heroicons-x-circle' });
  } finally {
    isLoading.value = false;
  }
}

// สำหรับ Nuxt.js ตั้งค่า meta tags
useHead({
  title: 'เข้าสู่ระบบ | Jongtable',
  meta: [
    { name: 'description', content: 'เข้าสู่ระบบเพื่อจัดการการจองโต๊ะและดูข้อมูลร้าน' }
  ]
})


</script>

<style scoped>
/* Enhanced animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Prevent scroll bar */
html, body {
  overflow: hidden;
  height: 100%;
}

/* Custom shadow */
.shadow-3xl {
  box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
}
</style>