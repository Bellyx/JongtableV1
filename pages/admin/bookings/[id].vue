<script lang="ts" setup>
import type { Booking } from '~/types';

definePageMeta({
  layout: 'admin',
  middleware: ['auth-admin']
});

const route = useRoute();
const bookingId = route.params.id;
const toast = useToast();

const { data: booking, pending, error, refresh } = await useFetch<Booking>(`/api/bookings/${bookingId}`);

// แปลสถานะเป็นภาษาไทยสำหรับแสดงผล
const statusTranslations: { [key: string]: string } = {
  PENDING_PAYMENT: 'รอชำระเงิน',
  PENDING_VERIFICATION: 'รอตรวจสอบ',
  CONFIRMED: 'ยืนยันแล้ว',
  CANCELLED: 'ยกเลิกแล้ว'
};

// ตัวเลือกสำหรับ Dropdown
const statusOptions = Object.keys(statusTranslations).map(key => ({
  value: key,
  label: statusTranslations[key]
}));

// State สำหรับเก็บสถานะที่ถูกเลือกใน dropdown
const selectedStatus = ref(booking.value?.status || '');

// เมื่อค่า booking เริ่มต้นเปลี่ยน ให้อัปเดต selectedStatus ด้วย
watch(booking, (newBooking) => {
  selectedStatus.value = newBooking?.status || '';
});


useHead({
  title: `รายละเอียดการจอง #${bookingId}`
});

const bookingDetails = computed(() => {
    if (!booking.value) return [];
    
    const na = 'ไม่มีข้อมูล';

    return [
        { label: 'รหัสการจอง', value: booking.value.booking_ref, icon: 'i-heroicons-qr-code' },
        { label: 'ชื่อผู้จอง', value: booking.value.name ?? na, icon: 'i-heroicons-user' },
        { label: 'อีเมล', value: booking.value.email ?? na, icon: 'i-heroicons-envelope' },
        { label: 'เบอร์โทรศัพท์', value: booking.value.phone ?? na, icon: 'i-heroicons-phone' },
        { label: 'วันและเวลาที่จอง', value: booking.value.booking_date ? new Date(booking.value.booking_date).toLocaleString('th-TH') : na, icon: 'i-heroicons-calendar-days' },
        { label: 'จำนวนแขก', value: booking.value.guests !== null ? `${booking.value.guests} ท่าน` : na, icon: 'i-heroicons-user-group' },
        { label: 'ยอดมัดจำ', value: booking.value.deposit_amount !== null ? `${booking.value.deposit_amount} บาท` : na, icon: 'i-heroicons-banknotes' },
        { label: 'ยอดที่ต้องโอนจริง', value: booking.value.payment_amount !== null ? `${booking.value.payment_amount} บาท` : na, icon: 'i-heroicons-banknotes' },
        { label: 'วันที่สร้างรายการ', value: booking.value.created_at ? new Date(booking.value.created_at).toLocaleString('th-TH') : na, icon: 'i-heroicons-pencil-square' },
    ];
});

const slipUrl = computed(() => booking.value?.slip_url);

// ฟังก์ชันสำหรับอัปเดตสถานะ
async function updateStatus() {
  if (!selectedStatus.value || selectedStatus.value === booking.value?.status) {
    toast.add({ title: 'ไม่มีการเปลี่ยนแปลง', color: 'orange' });
    return;
  }

  try {
    await $fetch(`/api/bookings/${bookingId}`, {
      method: 'PUT',
      body: { status: selectedStatus.value }
    });
    
    toast.add({ title: 'อัปเดตสถานะสำเร็จ!', icon: 'i-heroicons-check-circle' });
    
    // ดึงข้อมูลใหม่เพื่อให้หน้าจออัปเดต
    refresh();

  } catch (err) {
    console.error('Failed to update status:', err);
    toast.add({ title: 'เกิดข้อผิดพลาดในการอัปเดต', description: (err as Error).message, color: 'red' });
  }
}
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <div class="mb-6">
      <UButton to="/admin/bookings" icon="i-heroicons-arrow-left" color="gray" variant="ghost">
        กลับไปหน้ารายการจอง
      </UButton>
    </div>

    <div v-if="pending" class="text-center">
      <p>กำลังโหลดข้อมูล...</p>
    </div>
    <div v-else-if="error" class="text-center text-red-500">
      <p>เกิดข้อผิดพลาด: ไม่สามารถโหลดข้อมูลการจองได้</p>
    </div>
    <div v-else-if="booking" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <UCard class="lg:col-span-2" :ui="{ header: { base: 'bg-gray-50 dark:bg-gray-800/50' } }">
            <template #header>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <UIcon name="i-heroicons-ticket" class="text-2xl text-primary" />
                    <h2 class="text-xl font-bold">รายละเอียดการจอง</h2>
                  </div>
                </div>
            </template>
            <dl class="space-y-4">
                <div v-for="detail in bookingDetails" :key="detail.label" class="flex items-start">
                    <UIcon :name="detail.icon" class="w-5 h-5 text-gray-400 mr-3 mt-1" />
                    <div class="flex-1">
                        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ detail.label }}</dt>
                        <dd class="text-md font-semibold text-gray-800 dark:text-white">{{ detail.value }}</dd>
                    </div>
                </div>

                <div class="flex items-start">
                    <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-gray-400 mr-3 mt-1" />
                    <div class="flex-1">
                        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">สถานะ</dt>
                        <div class="flex items-center gap-2 mt-1">
                           <USelect 
                              v-model="selectedStatus" 
                              :options="statusOptions"
                              size="md"
                            />
                            <UButton 
                              icon="i-heroicons-check" 
                              @click="updateStatus"
                              :disabled="selectedStatus === booking.status"
                            >
                              บันทึก
                            </UButton>
                        </div>
                    </div>
                </div>
            </dl>
        </UCard>

        <UCard :ui="{ header: { base: 'bg-gray-50 dark:bg-gray-800/50' } }">
            <template #header>
                 <div class="flex items-center gap-3">
                    <UIcon name="i-heroicons-photo" class="text-2xl text-primary" />
                    <h2 class="text-xl font-bold">สลิปการโอนเงิน</h2>
                </div>
            </template>
            <div v-if="slipUrl">
                <img :src="slipUrl" alt="Payment Slip" class="w-full h-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            </div>
            <div v-else class="text-center py-10">
                <p class="text-gray-500">ยังไม่มีการอัปโหลดสลิป</p>
            </div>
        </UCard>
    </div>
  </div>
</template>