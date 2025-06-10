<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-4">
    <form @submit.prevent="handleRegister" class="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
      <!-- Header Section -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center">
        <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        </div>
        <h2 class="text-2xl font-bold text-white">สมัครสมาชิก</h2>
        <p class="text-blue-100 text-sm mt-1">เริ่มต้นการเดินทางกับเรา</p>
      </div>

      <!-- Form Section -->
      <div class="p-6 space-y-5">
        <div class="input-group">
          <label class="input-label">ชื่อ-นามสกุล</label>
          <div class="input-wrapper">
            <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            <input v-model="form.name" type="text" placeholder="กรอกชื่อ-นามสกุล" class="input" required />
          </div>
        </div>

        <div class="input-group">
          <label class="input-label">เบอร์โทรศัพท์</label>
          <div class="input-wrapper">
            <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
            <input v-model="form.phone" type="tel" placeholder="กรอกเบอร์โทรศัพท์" class="input" required />
          </div>
        </div>

        <div class="input-group">
          <label class="input-label">อีเมล</label>
          <div class="input-wrapper">
            <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
            <input v-model="form.email" type="email" placeholder="กรอกอีเมล" class="input" required />
          </div>
        </div>

        <div class="input-group">
          <label class="input-label">รหัสผ่าน</label>
          <div class="input-wrapper">
            <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            <input v-model="form.password" type="password" placeholder="อย่างน้อย 8 ตัวอักษร" class="input" required />
          </div>
        </div>
        
        <div class="input-group">
          <label class="input-label">ยืนยันรหัสผ่าน</label>
          <div class="input-wrapper">
            <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            <input v-model="form.passwordConfirm" type="password" placeholder="กรอกรหัสผ่านอีกครั้ง" class="input" required />
          </div>
        </div>

        <button type="submit" class="btn group" :disabled="isLoading">
            <svg v-if="isLoading" class="animate-spin h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <span>{{ isLoading ? 'กำลังดำเนินการ...' : 'สมัครสมาชิก' }}</span>
            <svg v-if="!isLoading" class="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
        </button>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 bg-gray-50/50 text-center border-t border-gray-200/50">
        <p class="text-sm text-gray-600">
          มีบัญชีอยู่แล้ว? 
          <NuxtLink to="/auth/signin" class="font-medium text-blue-600 hover:underline">
            เข้าสู่ระบบที่นี่
          </NuxtLink>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod';
import { useToast } from '#imports'; //
const toast = useToast();

const form = ref({
  name: '',
  phone: '',
  email: '',
  password: '',
  passwordConfirm: '',
});
const isLoading = ref(false);

// Zod Schema สำหรับตรวจสอบความถูกต้องของข้อมูลในฟอร์ม
const schema = z.object({
  name: z.string().min(2, 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร'),
  phone: z.string().min(9, 'เบอร์โทรศัพท์ไม่ถูกต้อง'),
  email: z.string().email('รูปแบบอีเมลไม่ถูกต้อง'),
  password: z.string().min(8, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'),
  passwordConfirm: z.string().min(8, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'),
}).refine(data => data.password === data.passwordConfirm, {
  message: 'รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน',
  path: ['passwordConfirm'], // ระบุ field ที่เกิด error
});

// ฟังก์ชันสำหรับจัดการการสมัครสมาชิก
const handleRegister = async () => {
  isLoading.value = true;

  const result = schema.safeParse(form.value);
  if (!result.success) {
    const firstError = result.error.errors[0];
    toast.add({
      title: 'ข้อมูลไม่ถูกต้อง',
      description: firstError.message,
      color: 'red',
      icon: 'i-heroicons-x-circle',
    });
    isLoading.value = false;
    return;
  }

  try {
      const { data, error, status } = await useFetch('/api/auth/register', {
        method: 'POST',
        body: {
          name: result.data.name,
          phone: result.data.phone,
          email: result.data.email,
          password: result.data.password,
        },
      });

      if (error.value) {
        // console.log('✅ เข้ามาในบล็อก if (error.value) แล้ว, ค่า error คือ:', error.value);
        const statusCode = error.value?.statusCode;
        const message =
          error.value?.data?.statusMessage || 'เกิดข้อผิดพลาดบางอย่าง';
        // console.log('ค่า statusCode ที่จะเช็คคือ:', statusCode, '| ประเภท:', typeof statusCode);
        if (statusCode === 409) {
          // console.log('เข้าเงื่อนไข statusCode === 409 สำเร็จ!');
          toast.add({
            title: 'สมัครไม่สำเร็จ',
            description: 'อีเมลนี้ถูกใช้งานแล้ว',
            color: 'red',
            icon: 'i-heroicons-exclamation-circle',
          });
        } else {
          // console.log('ไม่เข้าเงื่อนไข 409, เข้ามาที่ else แทน');
          toast.add({
            title: 'เกิดข้อผิดพลาด',
            description: message,
            color: 'red',
            icon: 'i-heroicons-x-circle',
          });
        }
      return;
    }
    toast.add({
      title: 'สำเร็จ',
      description: 'สมัครสมาชิกเรียบร้อยแล้ว! กรุณาเข้าสู่ระบบ',
      icon: 'i-heroicons-check-circle',
    });
    await navigateTo('/auth/signin');
  } catch (e) {
    console.error('Register page error:', e);
    toast.add({
      title: 'เกิดข้อผิดพลาด',
      description: 'ไม่สามารถสมัครสมาชิกได้ กรุณาลองใหม่อีกครั้ง',
      color: 'red',
      icon: 'i-heroicons-x-circle',
    });
  } finally {
    isLoading.value = false;
  }
};

useHead({
  title: 'สมัครสมาชิก | Jongtable',
  meta: [
    { name: 'description', content: 'สมัครสมาชิกเพื่อเริ่มใช้งานระบบจองโต๊ะ' }
  ]
});

</script>

<style scoped>
.input-group {
  margin-bottom: 1.25rem;
}
.input-group:last-of-type {
  margin-bottom: 0;
}
.input-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
}
.input-wrapper {
  position: relative;
}
.input-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #9CA3AF;
  transition: color 0.2s ease;
}
.input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #E5E7EB;
  border-radius: 0.75rem;
  background-color: rgba(249, 250, 251, 0.5);
  transition: all 0.2s ease;
  outline: none;
}
.input:focus {
  background-color: white;
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
.input:focus ~ .input-icon {
    color: #3B82F6;
}
.input:hover {
  background-color: white;
  border-color: #D1D5DB;
}
.input::placeholder {
  color: #9CA3AF;
}
.btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  background: linear-gradient(to right, #2563EB, #4F46E5);
  color: white;
  font-weight: 600;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.2), 0 4px 6px -2px rgba(59, 130, 246, 0.1);
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
}
.btn:hover:not(:disabled) {
  background: linear-gradient(to right, #1D4ED8, #4338CA);
  box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.3);
  transform: translateY(-1px);
}
.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
</style>