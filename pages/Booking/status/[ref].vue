<template>
  <UContainer class="py-16 text-center">
    <UCard>
      <div v-if="bookingStatus === 'CONFIRMED'">
        <UIcon name="i-heroicons-check-circle" class="text-6xl text-green-500 mb-4" />
        <h1 class="text-2xl font-bold">Booking Confirmed!</h1>
        <p class="mt-2 text-gray-600">
          Your booking ({{ bookingRef }}) is confirmed. We've sent a confirmation to your email.
        </p>
        <UButton to="/" class="mt-6">Back to Home</UButton>
      </div>

      <div v-else-if="bookingStatus === 'PENDING_VERIFICATION'">
        <div class="flex justify-center items-center mb-4">
            <svg class="animate-spin h-12 w-12 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
        <h1 class="text-2xl font-bold">Verifying Your Payment...</h1>
        <p class="mt-2 text-gray-600">
          Please wait a moment. This page will update automatically once the process is complete.
        </p>
      </div>
      
      <div v-else>
        <UIcon name="i-heroicons-x-circle" class="text-6xl text-red-500 mb-4" />
        <h1 class="text-2xl font-bold">Verification Needed</h1>
        <p class="mt-2 text-gray-600">
          There was an issue verifying your payment automatically. Our staff will review it shortly.
        </p>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
const route = useRoute();
const bookingRef = route.params.ref as string;

let pollingInterval: NodeJS.Timeout;

// --- 1. สร้าง Interface ขึ้นมาเพื่ออธิบายหน้าตาของข้อมูล ---
interface BookingStatus {
  status: 'PENDING_VERIFICATION' | 'CONFIRMED' | 'PENDING_PAYMENT' | 'CANCELLED';
}

// --- 2. ส่ง Interface เข้าไปใน useFetch<BookingStatus> ---
const { data: bookingData, refresh } = await useFetch<BookingStatus>(`/api/bookings/status/${bookingRef}`);

// ตอนนี้ TypeScript รู้จัก bookingData.value.status แล้ว
const bookingStatus = ref(bookingData.value?.status);

onMounted(() => {
  // เริ่มการ Polling ทุกๆ 5 วินาที
  pollingInterval = setInterval(async () => {
    // ถ้าสถานะเปลี่ยนเป็น confirmed ไปแล้ว ก็ไม่จำเป็นต้องเช็คต่อ
    if (bookingStatus.value === 'CONFIRMED') {
      clearInterval(pollingInterval);
      return;
    }

    await refresh(); // ยิง API เพื่อดึงข้อมูลสถานะใหม่
    const newStatus = bookingData.value?.status;
    
    // อัปเดตสถานะที่แสดงผล
    if (newStatus) {
      bookingStatus.value = newStatus;
    }
    
    // ถ้าสถานะสุดท้ายเป็น CONFIRMED ให้หยุด Polling
    if (newStatus === 'CONFIRMED') {
      clearInterval(pollingInterval);
    }
  }, 5000); // 5000ms = 5 วินาที
});

onUnmounted(() => {
  // หยุดการ Polling เมื่อผู้ใช้ออกจากหน้านี้
  clearInterval(pollingInterval);
});
</script>