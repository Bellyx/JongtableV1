<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
          A list of all the recent reservations in your restaurant.
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-4">
      <div class="overflow-hidden bg-white rounded-lg shadow dark:bg-gray-800">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <UIcon name="i-heroicons-banknotes" class="w-6 h-6 text-gray-400" />
            </div>
            <div class="flex-1 w-0 ml-5">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate dark:text-gray-400">
                  Today's Sales
                </dt>
                <dd>
                  <div class="text-lg font-medium text-gray-900 dark:text-white">
                    $12,789
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
      <div class="overflow-hidden bg-white rounded-lg shadow dark:bg-gray-800">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <UIcon name="i-heroicons-bookmark" class="w-6 h-6 text-gray-400" />
            </div>
            <div class="flex-1 w-0 ml-5">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate dark:text-gray-400">
                  Today's Bookings
                </dt>
                <dd>
                  <div class="text-lg font-medium text-gray-900 dark:text-white">
                    25
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
      </div>

    <div class="mt-8">
      <h2 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
        Recent Reservations
      </h2>
      <AppTableReservations class="mt-4" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'admin', // สมมติว่ามี layout สำหรับ admin
    middleware: ['auth-admin'], // สมมติว่ามี middleware สำหรับตรวจสอบสิทธิ์ admin
    })

import { ref, onMounted } from 'vue';


const stats = ref({
  sales: '0',
  bookings: 0,
});

// ฟังก์ชันสำหรับดึงข้อมูลสถิติ
async function fetchStats() {
  // สมมติว่ามีการเรียก API ไปยัง /api/admin/stats
  const response = await fetch('/api/admin/stats');
  const data = await response.json();
  stats.value = data;
}

onMounted(() => {
  fetchStats();
});
</script>