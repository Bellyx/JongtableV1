<script lang="ts" setup>
import type { Booking, BookingsResponse } from '~/types';

definePageMeta({
  layout: 'admin',
  middleware: ['auth-admin']
});

useHead({
  title: 'จัดการการจองทั้งหมด'
});

// --- จุดแก้ไข ---
// 1. สร้างฟังก์ชันสำหรับจัดรูปแบบวันที่ให้เป็น 'YYYY-MM-DD'
const formatDateToYYYYMMDD = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const page = ref(1);
const limit = ref(20);
// 2. ตั้งค่าเริ่มต้นของ selectedDate ให้เป็นวันปัจจุบัน
const selectedDate = ref(formatDateToYYYYMMDD(new Date()));

const queryParams = computed(() => ({
  page: page.value,
  limit: limit.value,
  date: selectedDate.value || undefined
}));

const { data, pending, error, refresh } = await useFetch<BookingsResponse>('/api/bookings', {
  query: queryParams,
});

const columns = [
  { key: 'booking_ref', label: 'รหัสการจอง' },
  { key: 'name', label: 'ชื่อผู้จอง' },
  { key: 'booking_date', label: 'วันที่จอง', sortable: true },
  { key: 'status', label: 'สถานะ' },
  { key: 'actions', label: 'ดูรายละเอียด' }
];

const statusTranslations: { [key: string]: string } = {
  PENDING_PAYMENT: 'รอชำระเงิน',
  PENDING_VERIFICATION: 'รอตรวจสอบ',
  CONFIRMED: 'ยืนยันแล้ว',
  CANCELLED: 'ยกเลิกแล้ว'
};

const formattedBookings = computed(() => {
  return data.value?.bookings?.map((booking: Booking) => ({
    ...booking,
    actions: null, 
    booking_date: booking.booking_date
      ? new Date(booking.booking_date).toLocaleString('th-TH', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      })
      : 'ไม่มีข้อมูล'
  })) || [];
});

const totalBookings = computed(() => data.value?.total ?? 0);

const statusColors: { [key: string]: 'green' | 'yellow' | 'red' | 'blue' } = {
  CONFIRMED: 'green',
  PENDING_VERIFICATION: 'yellow',
  CANCELLED: 'red',
  PENDING_PAYMENT: 'blue'
};

const getStatusColor = (status: string | null) => {
  if (!status) return 'gray';
  return statusColors[status] || 'gray';
};

function clearDateFilter() {
    selectedDate.value = '';
}
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">รายการจองทั้งหมด</h1>
      <UButton icon="i-heroicons-arrow-path" @click="refresh" variant="ghost">รีเฟรช</UButton>
    </div>

    <UCard class="mb-6">
      <div class="flex items-center gap-4">
        <UFormGroup label="กรองตามวันที่จอง" class="flex-1">
          <UInput type="date" v-model="selectedDate" />
        </UFormGroup>
        <UButton @click="clearDateFilter" color="gray" variant="ghost" class="self-end">ล้างตัวกรอง</UButton>
      </div>
    </UCard>

    <div v-if="pending" class="text-center py-10">
      <p>กำลังโหลดรายการจอง...</p>
    </div>
    <div v-else-if="error" class="text-center text-red-500 py-10">
      <p>เกิดข้อผิดพลาดในการโหลดข้อมูลการจอง</p>
      <pre class="mt-2 text-left bg-red-50 dark:bg-red-900/10 p-2 rounded">{{ error }}</pre>
    </div>
    <div v-else>
      <UCard>
        <UTable :rows="formattedBookings" :columns="columns">
          
          <template #status-data="{ row }">
            <UBadge :color="getStatusColor(row.status)" variant="subtle">
              {{ row.status ? statusTranslations[row.status] || row.status : 'ไม่มีข้อมูล' }}
            </UBadge>
          </template>

          <template #actions-data="{ row }">
            <UButton :to="`/admin/bookings/${row.id}`" icon="i-heroicons-eye" variant="ghost" color="gray">
              ดู
            </UButton>
          </template>

        </UTable>
      </UCard>
      
      <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
        <UPagination v-model="page" :page-count="limit" :total="totalBookings" />
      </div>
    </div>
  </div>
</template>