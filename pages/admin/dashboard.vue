<script lang="ts" setup>
const { user } = useAuth()

// กำหนดคอลัมน์สำหรับตาราง (เหมือนเดิม)
const columns = [{
  key: 'name',
  label: 'ชื่อผู้จอง'
}, {
  key: 'booking_date',
  label: 'วัน-เวลาที่จอง',
  // เพิ่มการจัดรูปแบบวันที่
  sortable: true 
}, {
  key: 'guests',
  label: 'จำนวนแขก'
}, {
  key: 'status',
  label: 'สถานะ'
}]

definePageMeta({
  middleware: ['auth-admin']
})

// --- ส่วนที่แก้ไข ---
// ใช้ useFetch เพื่อดึงข้อมูลการจองล่าสุดจาก API
const { data, pending, error } = await useFetch('/api/bookings/recent')

// ดึงข้อมูล bookings จาก data ที่ fetch มา
const recentBookings = computed(() => data.value?.bookings || [])

// จัดรูปแบบวันที่ให้อ่านง่ายขึ้น (ตัวเลือกเสริม)
const formattedBookings = computed(() => {
  return recentBookings.value.map(booking => ({
    ...booking,
    booking_date: new Date(booking.booking_date).toLocaleString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }))
})
</script>

<template>
  <div class="bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-slate-900 min-h-screen">
    <UContainer class="py-8">
      <!-- Enhanced Header Section -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-purple-100/50 dark:shadow-slate-900/50 p-8 mb-8 border border-white/20 dark:border-gray-700/50 backdrop-blur-sm">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div class="flex items-center gap-4">
            <div class="p-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg">
              <UIcon name="i-heroicons-cog-6-tooth" class="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 class="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p v-if="user" class="text-gray-600 dark:text-gray-300 flex items-center gap-2 mt-1">
                <UIcon name="i-heroicons-user-circle" class="h-4 w-4" />
                Welcome, <span class="font-semibold text-purple-600 dark:text-purple-400">{{ user.name }}</span>
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <UIcon name="i-heroicons-clock" class="h-4 w-4" />
            <span>{{ new Date().toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
          </div>
        </div>
      </div>

      <!-- Enhanced Management Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Events Management Card -->
        <UCard class="group transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-200/50 dark:hover:shadow-slate-700/50 hover:-translate-y-2 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border border-white/20 dark:border-gray-700/50 backdrop-blur-sm overflow-hidden relative">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <template #header>
            <div class="flex items-center gap-3 relative z-10">
              <div class="p-3 bg-gradient-to-br from-blue-100 to-cyan-200 dark:from-blue-900/50 dark:to-cyan-800/50 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <UIcon name="i-heroicons-calendar-days" class="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 class="text-lg font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                จัดการกิจกรรม
              </h3>
            </div>
          </template>
          
          <div class="relative z-10">
            <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              เพิ่มหรือแก้ไขกิจกรรมและโปรโมชันพิเศษ
            </p>
            <UButton 
              label="เพิ่มรายการกิจกรรม" 
              icon="i-heroicons-plus-circle" 
              to="/admin/events" 
              color="blue"
              size="lg"
              class="w-full shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
            />
          </div>
        </UCard>

        <!-- Reviews Management Card -->
        <UCard class="group transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-200/50 dark:hover:shadow-slate-700/50 hover:-translate-y-2 bg-gradient-to-br from-white to-yellow-50 dark:from-gray-800 dark:to-yellow-900/20 border border-white/20 dark:border-gray-700/50 backdrop-blur-sm overflow-hidden relative">
          <div class="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <template #header>
            <div class="flex items-center gap-3 relative z-10">
              <div class="p-3 bg-gradient-to-br from-yellow-100 to-orange-200 dark:from-yellow-900/50 dark:to-orange-800/50 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <UIcon name="i-heroicons-star" class="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 class="text-lg font-bold text-gray-800 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors duration-300">
                จัดการรีวิวร้าน
              </h3>
            </div>
          </template>
          
          <div class="relative z-10">
            <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              ตรวจสอบและจัดการรีวิวจากลูกค้า
            </p>
            <UButton 
              label="ดูรีวิวทั้งหมด" 
              icon="i-heroicons-chat-bubble-bottom-center-text" 
              to="/admin/reviews" 
              color="yellow"
              size="lg"
              class="w-full shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
            />
          </div>
        </UCard>

        <!-- Messages Management Card -->
        <UCard class="group transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-200/50 dark:hover:shadow-slate-700/50 hover:-translate-y-2 bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900/20 border border-white/20 dark:border-gray-700/50 backdrop-blur-sm overflow-hidden relative">
          <div class="absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <template #header>
            <div class="flex items-center gap-3 relative z-10">
              <div class="p-3 bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/50 dark:to-emerald-800/50 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <UIcon name="i-heroicons-tv" class="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 class="text-lg font-bold text-gray-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                จัดการข้อความขึ้นจอ
              </h3>
            </div>
          </template>
          
          <div class="relative z-10">
            <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              จัดการข้อความที่ผู้ใช้ส่งเพื่อแสดงผลบนจอ
            </p>
            <UButton 
              label="ไปที่หน้าจัดการ" 
              icon="i-heroicons-computer-desktop" 
              to="/admin/messages" 
              color="green"
              size="lg"
              class="w-full shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
            />
          </div>
        </UCard>
      </div>

      <!-- Enhanced Recent Bookings Table -->
      <UCard class="bg-gradient-to-br from-white to-slate-50 dark:from-gray-800 dark:to-gray-700 shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-white/20 dark:border-gray-700/50 backdrop-blur-sm overflow-hidden">
        <template #header>
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-2">
            <div class="flex items-center gap-3">
              <div class="p-3 bg-gradient-to-br from-purple-100 to-indigo-200 dark:from-purple-900/50 dark:to-indigo-800/50 rounded-xl shadow-lg">
                <UIcon name="i-heroicons-bookmark" class="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-800 dark:text-white">
                  รายการจองล่าสุด
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  ติดตามการจองที่เข้ามาล่าสุด
                </p>
              </div>
            </div>
            <UButton 
              label="ดูการจองทั้งหมด" 
              variant="outline" 
              to="/admin/bookings" 
              icon="i-heroicons-arrow-right"
              trailing
              class="shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            />
          </div>
        </template>
        
        <div class="p-6">
          <!-- Loading State -->
          <div v-if="pending" class="flex items-center justify-center py-12">
            <div class="flex flex-col items-center gap-4">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <p class="text-gray-600 dark:text-gray-300 font-medium">กำลังโหลดข้อมูล...</p>
            </div>
          </div>
          
          <!-- Error State -->
          <div v-else-if="error" class="text-center py-12">
            <div class="flex flex-col items-center gap-4">
              <UIcon name="i-heroicons-exclamation-triangle" class="h-16 w-16 text-red-500" />
              <div>
                <p class="text-red-600 dark:text-red-400 font-semibold mb-2">ไม่สามารถโหลดข้อมูลการจองได้</p>
                <p class="text-gray-500 dark:text-gray-400 text-sm">กรุณาลองใหม่อีกครั้งในภายหลัง</p>
              </div>
            </div>
          </div>
          
          <!-- Data Table -->
          <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-inner border border-gray-100 dark:border-gray-700 overflow-hidden">
            <UTable 
              :rows="formattedBookings" 
              :columns="columns"
              class="w-full"
              :ui="{
                wrapper: 'relative overflow-x-auto',
                base: 'min-w-full table-auto',
                divide: 'divide-y divide-gray-200 dark:divide-gray-700',
                thead: 'bg-gradient-to-r from-gray-50 to-slate-100 dark:from-gray-700 dark:to-gray-600',
                tbody: 'bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700',
                tr: {
                  base: 'hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200'
                },
                th: {
                  base: 'text-left rtl:text-right px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider',
                },
                td: {
                  base: 'whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100'
                }
              }"
            >
              <template #status-data="{ row }">
                <UBadge
                  :color="row.status === 'confirmed' ? 'green' : row.status === 'pending' ? 'yellow' : 'red'"
                  variant="subtle"
                  size="md"
                  class="font-semibold shadow-sm"
                >
                  {{ row.status }}
                </UBadge>
              </template>
            </UTable>
          </div>
        </div>
      </UCard>
    </UContainer>
  </div>
</template>