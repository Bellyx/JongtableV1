<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Booking } from '~/types'

// --- 1. เรียกใช้ useI18n() และดึง locale ออกมา ---
const { t, locale } = useI18n()

// --- Page Metadata ---
definePageMeta({
  layout: 'default',
  middleware: 'auth-user'
})

// --- ดึงข้อมูลผู้ใช้จริง ---
const { user, logout: authLogout } = useAuth()

// --- ดึงข้อมูลการจองจริงจาก API ---
const { data, pending, error } = await useFetch('/api/bookings/recent')
console.log(data);

// --- Computed Property สำหรับส่งข้อมูลให้ UI ---
const upcomingReservations = computed<Booking[]>(() => {
  return data.value?.bookings || []
})

// --- ฟังก์ชัน formatDate ที่ปรับปรุงแล้ว ---
const formatDate = (dateString: string | null) => {
  if (!dateString) {
    return 'N/A';
  }
  return new Date(dateString).toLocaleDateString(locale.value, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// --- ฟังก์ชันสำหรับ format เวลา ---
const formatTime = (dateString: string | null) => {
  if (!dateString) {
    return '';
  }
  return new Date(dateString).toLocaleTimeString(locale.value, {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// --- ฟังก์ชันสำหรับแสดงสถานะการจอง ---
const getBookingStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'CONFIRMED': return 'green'
    case 'PENDING_PAYMENT': return 'orange'
    case 'PENDING_VERIFICATION': return 'yellow'
    case 'CANCELLED': return 'red'
    default: return 'blue'
  }
}

// --- ฟังก์ชันสำหรับแปลสถานะเป็นภาษาไทย ---
const getBookingStatusText = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'CONFIRMED': return 'ยืนยันแล้ว'
    case 'PENDING_PAYMENT': return 'รอชำระเงิน'
    case 'PENDING_VERIFICATION': return 'รอตรวจสอบ'
    case 'CANCELLED': return 'ยกเลิกแล้ว'
    default: return 'ไม่ระบุ'
  }
}

// --- ฟังก์ชันสำหรับสีกรอบตามสถานะ ---
const getBookingBorderColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'CONFIRMED': return 'border-green-200 dark:border-green-800/30 hover:border-green-300 dark:hover:border-green-600'
    case 'PENDING_PAYMENT': return 'border-orange-200 dark:border-orange-800/30 hover:border-orange-300 dark:hover:border-orange-600'
    case 'PENDING_VERIFICATION': return 'border-yellow-200 dark:border-yellow-800/30 hover:border-yellow-300 dark:hover:border-yellow-600'
    case 'CANCELLED': return 'border-red-200 dark:border-red-800/30 hover:border-red-300 dark:hover:border-red-600'
    default: return 'border-blue-200 dark:border-blue-800/30 hover:border-blue-300 dark:hover:border-blue-600'
  }
}

// --- Mock Data ที่ยังคงไว้ ---
const actions = computed(() => [
  { key: 'sendMessage', icon: 'i-heroicons-paper-airplane', to: '/Message/send-message', color: 'blue' },
  { key: 'bookingList', icon: 'i-heroicons-calendar-days', to: '/Booking/bookinglist', color: 'green' },
  { key: 'ticketList', icon: 'i-heroicons-ticket', to: '/Tickets/ticketlist', color: 'orange' },
  { key: 'menuList', icon: 'i-heroicons-book-open', to: '/Menu/menulist', color: 'red' },
  { key: 'reviewList', icon: 'i-heroicons-star', to: '/Review/Reviewlist', color: 'yellow' },
  { key: 'myProfile', icon: 'i-heroicons-user-circle', to: '#', color: 'gray' },
])

// --- ฟังก์ชัน Logout ---
const isLoading = ref(false)
async function logout() {
  isLoading.value = true
  await authLogout()
  isLoading.value = false
}
</script>

<template>
  <div class="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900 min-h-screen">
    <div class="w-full max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <header class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg shadow-blue-100 dark:shadow-slate-900/50 p-6 mb-8 border border-white/20 dark:border-gray-700/50 backdrop-blur-sm">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="relative">
              <!-- <UAvatar :src="user.avatar" :alt="user.name" size="lg" class="ring-4 ring-blue-100 dark:ring-blue-900/50" /> -->
              <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></div>
            </div>
            <div>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                {{ t('welcome', { name: user?.name }) }} 👋
              </h1>
              <p class="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <UIcon name="i-heroicons-clock" class="h-4 w-4" />
                {{ t('dashboard_subtitle') }}
              </p>
            </div>
          </div>
          <UButton
            :label="t('logout')"
            color="red"
            variant="soft"
            icon="i-heroicons-arrow-left-on-rectangle"
            size="lg"
            :loading="isLoading"
            @click="logout"
            class="shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
          />
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <main class="lg:col-span-2">
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <NuxtLink v-for="action in actions" :key="action.key" :to="action.to" class="block group">
              <UCard class="h-full transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-200/50 dark:hover:shadow-slate-700/50 hover:-translate-y-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 overflow-hidden relative" 
                     :ui="{ ring: 'dark:ring-slate-700', divide: 'dark:divide-slate-700' }">
                
                <div class="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300" 
                     :class="`from-${action.color}-400 to-${action.color}-600`"></div>
                
                <div class="flex flex-col items-start justify-between h-full relative z-10">
                  <div class="w-full">
                    <div class="p-4 rounded-2xl inline-flex items-center justify-center mb-4 relative overflow-hidden group-hover:scale-110 transition-transform duration-300" 
                         :class="`bg-gradient-to-br from-${action.color}-100 to-${action.color}-200 dark:from-${action.color}-900/50 dark:to-${action.color}-800/50 shadow-lg`">
                      <UIcon :name="action.icon" class="h-7 w-7 relative z-10" 
                             :class="`text-${action.color}-600 dark:text-${action.color}-400`" />
                      <div class="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-300" 
                           :class="`from-${action.color}-400 to-${action.color}-600`"></div>
                    </div>
                    
                    <h2 class="font-bold text-lg text-gray-800 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white transition-all duration-300">
                      {{ t(`actions.${action.key}`) }}
                    </h2>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">{{ t(`actions.${action.key}_desc`) }}</p>
                  </div>
                  
                  <div class="w-full mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <UButton :label="action.key === 'myProfile' ? t('details') : 'Go'" 
                             variant="link" 
                             icon="i-heroicons-arrow-right-circle" 
                             :padded="false" 
                             class="group-hover:translate-x-1 transition-all duration-300 font-semibold text-gray-600 dark:text-gray-300 group-hover:text-white group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:to-red-600 group-hover:px-4 group-hover:py-2 group-hover:rounded-lg group-hover:shadow-lg group-hover:shadow-red-200 dark:group-hover:shadow-red-900/50" />
                  </div>
                </div>
              </UCard>
            </NuxtLink>
          </div>
        </main>

        <aside class="flex flex-col gap-8">
          <!-- การจองล่าสุด - ปรับปรุงใหม่ -->
          <UCard class="bg-gradient-to-br from-white to-emerald-50 dark:from-gray-800 dark:to-gray-700 shadow-xl shadow-emerald-100/50 dark:shadow-slate-900/50 border border-white/20 dark:border-gray-700/50 backdrop-blur-sm" 
                 :ui="{ ring: 'dark:ring-slate-700', divide: 'dark:divide-slate-700' }">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl shadow-lg">
                  <UIcon name="i-heroicons-calendar-days" class="h-5 w-5 text-white" />
                </div>
                <h3 class="font-bold text-lg bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">
                  {{ t('upcoming_reservations') }}
                </h3>
              </div>
              <UBadge v-if="upcomingReservations.length > 0" 
                     :label="upcomingReservations.length.toString()" 
                     color="emerald" 
                     variant="solid" 
                     size="sm"
                     class="animate-pulse" />
            </div>
            
            <div v-if="upcomingReservations.length > 0" class="space-y-4">
              <div v-for="res in upcomingReservations" :key="res.id" 
                   class="group relative overflow-hidden bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                   :class="[
                     getBookingBorderColor(res.status || 'CONFIRMED'),
                     res.status?.toUpperCase() === 'CONFIRMED' ? 'hover:shadow-green-200/50 dark:hover:shadow-green-900/30' :
                     res.status?.toUpperCase() === 'PENDING_PAYMENT' ? 'hover:shadow-orange-200/50 dark:hover:shadow-orange-900/30' :
                     res.status?.toUpperCase() === 'PENDING_VERIFICATION' ? 'hover:shadow-yellow-200/50 dark:hover:shadow-yellow-900/30' :
                     res.status?.toUpperCase() === 'CANCELLED' ? 'hover:shadow-red-200/50 dark:hover:shadow-red-900/30' :
                     'hover:shadow-blue-200/50 dark:hover:shadow-blue-900/30'
                   ]">
                
                <!-- Background Pattern -->
                <div class="absolute inset-0 opacity-5"
                     :class="[
                       res.status?.toUpperCase() === 'CONFIRMED' ? 'bg-gradient-to-br from-green-400 to-green-500' :
                       res.status?.toUpperCase() === 'PENDING_PAYMENT' ? 'bg-gradient-to-br from-orange-400 to-orange-500' :
                       res.status?.toUpperCase() === 'PENDING_VERIFICATION' ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' :
                       res.status?.toUpperCase() === 'CANCELLED' ? 'bg-gradient-to-br from-red-400 to-red-500' :
                       'bg-gradient-to-br from-blue-400 to-blue-500'
                     ]"></div>
                
                <div class="relative z-10 p-5">
                  <!-- หมายเลขการจอง - เด่นชัด -->
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                      <div class="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-xl shadow-lg font-mono font-bold text-sm tracking-wider">
                        <UIcon name="i-heroicons-hashtag" class="h-4 w-4" />
                        {{ res.booking_ref || 'E2506160001' }}
                      </div>
                      <UBadge :label="getBookingStatusText(res.status || 'CONFIRMED')" 
                             :color="getBookingStatusColor(res.status || 'CONFIRMED')" 
                             variant="subtle" 
                             size="sm"
                             class="font-medium" />
                    </div>
                  </div>

                  <!-- ข้อมูลการจอง -->
                  <div class="grid grid-cols-2 gap-4 mb-4">
                    <!-- จำนวนแขก -->
                    <div class="flex items-center gap-2 p-3 bg-white/70 dark:bg-gray-800/70 rounded-xl border"
                         :class="[
                           res.status?.toUpperCase() === 'CONFIRMED' ? 'border-green-100 dark:border-green-800/50' :
                           res.status?.toUpperCase() === 'PENDING_PAYMENT' ? 'border-orange-100 dark:border-orange-800/50' :
                           res.status?.toUpperCase() === 'PENDING_VERIFICATION' ? 'border-yellow-100 dark:border-yellow-800/50' :
                           res.status?.toUpperCase() === 'CANCELLED' ? 'border-red-100 dark:border-red-800/50' :
                           'border-blue-100 dark:border-blue-800/50'
                         ]">
                      <div class="p-1.5 rounded-lg"
                           :class="[
                             res.status?.toUpperCase() === 'CONFIRMED' ? 'bg-green-100 dark:bg-green-900/50' :
                             res.status?.toUpperCase() === 'PENDING_PAYMENT' ? 'bg-orange-100 dark:bg-orange-900/50' :
                             res.status?.toUpperCase() === 'PENDING_VERIFICATION' ? 'bg-yellow-100 dark:bg-yellow-900/50' :
                             res.status?.toUpperCase() === 'CANCELLED' ? 'bg-red-100 dark:bg-red-900/50' :
                             'bg-blue-100 dark:bg-blue-900/50'
                           ]">
                        <UIcon name="i-heroicons-users" class="h-4 w-4"
                               :class="[
                                 res.status?.toUpperCase() === 'CONFIRMED' ? 'text-green-600 dark:text-green-400' :
                                 res.status?.toUpperCase() === 'PENDING_PAYMENT' ? 'text-orange-600 dark:text-orange-400' :
                                 res.status?.toUpperCase() === 'PENDING_VERIFICATION' ? 'text-yellow-600 dark:text-yellow-400' :
                                 res.status?.toUpperCase() === 'CANCELLED' ? 'text-red-600 dark:text-red-400' :
                                 'text-blue-600 dark:text-blue-400'
                               ]" />
                      </div>
                      <div>
                        <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">{{ t('guests') }}</p>
                        <p class="font-bold text-gray-800 dark:text-white">{{ res.guests || '4' }}</p>
                      </div>
                    </div>

                    <!-- โต๊ะ -->
                    <div class="flex items-center gap-2 p-3 bg-white/70 dark:bg-gray-800/70 rounded-xl border"
                         :class="[
                           res.status?.toUpperCase() === 'CONFIRMED' ? 'border-green-100 dark:border-green-800/50' :
                           res.status?.toUpperCase() === 'PENDING_PAYMENT' ? 'border-orange-100 dark:border-orange-800/50' :
                           res.status?.toUpperCase() === 'PENDING_VERIFICATION' ? 'border-yellow-100 dark:border-yellow-800/50' :
                           res.status?.toUpperCase() === 'CANCELLED' ? 'border-red-100 dark:border-red-800/50' :
                           'border-blue-100 dark:border-blue-800/50'
                         ]">
                      <div class="p-1.5 rounded-lg"
                           :class="[
                             res.status?.toUpperCase() === 'CONFIRMED' ? 'bg-green-100 dark:bg-green-900/50' :
                             res.status?.toUpperCase() === 'PENDING_PAYMENT' ? 'bg-orange-100 dark:bg-orange-900/50' :
                             res.status?.toUpperCase() === 'PENDING_VERIFICATION' ? 'bg-yellow-100 dark:bg-yellow-900/50' :
                             res.status?.toUpperCase() === 'CANCELLED' ? 'bg-red-100 dark:bg-red-900/50' :
                             'bg-blue-100 dark:bg-blue-900/50'
                           ]">
                        <UIcon name="i-heroicons-squares-2x2" class="h-4 w-4"
                               :class="[
                                 res.status?.toUpperCase() === 'CONFIRMED' ? 'text-green-600 dark:text-green-400' :
                                 res.status?.toUpperCase() === 'PENDING_PAYMENT' ? 'text-orange-600 dark:text-orange-400' :
                                 res.status?.toUpperCase() === 'PENDING_VERIFICATION' ? 'text-yellow-600 dark:text-yellow-400' :
                                 res.status?.toUpperCase() === 'CANCELLED' ? 'text-red-600 dark:text-red-400' :
                                 'text-blue-600 dark:text-blue-400'
                               ]" />
                      </div>
                      <div>
                        <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">{{ t('table') }}</p>
                        <p class="font-bold text-gray-800 dark:text-white">{{ res.table_number || 'A-12' }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- วันที่และเวลา -->
                  <div class="space-y-2">
                    <div class="flex items-center gap-2 p-3 rounded-xl border"
                         :class="[
                           res.status?.toUpperCase() === 'CONFIRMED' ? 'bg-gradient-to-r from-green-50 to-green-50 dark:from-green-900/20 dark:to-green-900/20 border-green-200 dark:border-green-800/50' :
                           res.status?.toUpperCase() === 'PENDING_PAYMENT' ? 'bg-gradient-to-r from-orange-50 to-orange-50 dark:from-orange-900/20 dark:to-orange-900/20 border-orange-200 dark:border-orange-800/50' :
                           res.status?.toUpperCase() === 'PENDING_VERIFICATION' ? 'bg-gradient-to-r from-yellow-50 to-yellow-50 dark:from-yellow-900/20 dark:to-yellow-900/20 border-yellow-200 dark:border-yellow-800/50' :
                           res.status?.toUpperCase() === 'CANCELLED' ? 'bg-gradient-to-r from-red-50 to-red-50 dark:from-red-900/20 dark:to-red-900/20 border-red-200 dark:border-red-800/50' :
                           'bg-gradient-to-r from-blue-50 to-blue-50 dark:from-blue-900/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800/50'
                         ]">
                      <div class="p-1.5 rounded-lg shadow-sm"
                           :class="[
                             res.status?.toUpperCase() === 'CONFIRMED' ? 'bg-green-500' :
                             res.status?.toUpperCase() === 'PENDING_PAYMENT' ? 'bg-orange-500' :
                             res.status?.toUpperCase() === 'PENDING_VERIFICATION' ? 'bg-yellow-500' :
                             res.status?.toUpperCase() === 'CANCELLED' ? 'bg-red-500' :
                             'bg-blue-500'
                           ]">
                        <UIcon name="i-heroicons-calendar" class="h-4 w-4 text-white" />
                      </div>
                      <div class="flex-1">
                        <p class="text-xs font-semibold uppercase tracking-wide"
                           :class="[
                             res.status?.toUpperCase() === 'CONFIRMED' ? 'text-green-600 dark:text-green-400' :
                             res.status?.toUpperCase() === 'PENDING_PAYMENT' ? 'text-orange-600 dark:text-orange-400' :
                             res.status?.toUpperCase() === 'PENDING_VERIFICATION' ? 'text-yellow-600 dark:text-yellow-400' :
                             res.status?.toUpperCase() === 'CANCELLED' ? 'text-red-600 dark:text-red-400' :
                             'text-blue-600 dark:text-blue-400'
                           ]">{{ t('booking_date') }}</p>
                        <p class="font-bold text-gray-800 dark:text-white">{{ formatDate(res.booking_date) }}</p>
                      </div>
                    </div>

                    <div class="flex items-center gap-2 p-3 rounded-xl border"
                         :class="[
                           res.status?.toUpperCase() === 'CONFIRMED' ? 'bg-gradient-to-r from-green-50 to-green-50 dark:from-green-900/20 dark:to-green-900/20 border-green-200 dark:border-green-800/50' :
                           res.status?.toUpperCase() === 'PENDING_PAYMENT' ? 'bg-gradient-to-r from-orange-50 to-orange-50 dark:from-orange-900/20 dark:to-orange-900/20 border-orange-200 dark:border-orange-800/50' :
                           res.status?.toUpperCase() === 'PENDING_VERIFICATION' ? 'bg-gradient-to-r from-yellow-50 to-yellow-50 dark:from-yellow-900/20 dark:to-yellow-900/20 border-yellow-200 dark:border-yellow-800/50' :
                           res.status?.toUpperCase() === 'CANCELLED' ? 'bg-gradient-to-r from-red-50 to-red-50 dark:from-red-900/20 dark:to-red-900/20 border-red-200 dark:border-red-800/50' :
                           'bg-gradient-to-r from-blue-50 to-blue-50 dark:from-blue-900/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800/50'
                         ]">
                      <div class="p-1.5 rounded-lg shadow-sm"
                           :class="[
                             res.status?.toUpperCase() === 'CONFIRMED' ? 'bg-green-500' :
                             res.status?.toUpperCase() === 'PENDING_PAYMENT' ? 'bg-orange-500' :
                             res.status?.toUpperCase() === 'PENDING_VERIFICATION' ? 'bg-yellow-500' :
                             res.status?.toUpperCase() === 'CANCELLED' ? 'bg-red-500' :
                             'bg-blue-500'
                           ]">
                        <UIcon name="i-heroicons-clock" class="h-4 w-4 text-white" />
                      </div>
                      <div class="flex-1">
                        <p class="text-xs font-semibold uppercase tracking-wide"
                           :class="[
                             res.status?.toUpperCase() === 'CONFIRMED' ? 'text-green-600 dark:text-green-400' :
                             res.status?.toUpperCase() === 'PENDING_PAYMENT' ? 'text-orange-600 dark:text-orange-400' :
                             res.status?.toUpperCase() === 'PENDING_VERIFICATION' ? 'text-yellow-600 dark:text-yellow-400' :
                             res.status?.toUpperCase() === 'CANCELLED' ? 'text-red-600 dark:text-red-400' :
                             'text-blue-600 dark:text-blue-400'
                           ]">{{ t('booking_time') }}</p>
                        <p class="font-bold text-gray-800 dark:text-white">{{ formatTime(res.booking_date) || '19:30' }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Action Button -->
                  <div class="mt-4 pt-3 border-t"
                       :class="[
                         res.status?.toUpperCase() === 'CONFIRMED' ? 'border-green-100 dark:border-green-800/50' :
                         res.status?.toUpperCase() === 'PENDING_PAYMENT' ? 'border-orange-100 dark:border-orange-800/50' :
                         res.status?.toUpperCase() === 'PENDING_VERIFICATION' ? 'border-yellow-100 dark:border-yellow-800/50' :
                         res.status?.toUpperCase() === 'CANCELLED' ? 'border-red-100 dark:border-red-800/50' :
                         'border-blue-100 dark:border-blue-800/50'
                       ]">
                    <UButton variant="outline" 
                             :color="getBookingStatusColor(res.status || 'CONFIRMED')"
                             icon="i-heroicons-eye"
                             :label="t('view_details')"
                             size="sm"
                             block
                             class="transition-all duration-300 font-semibold"
                             :class="[
                               res.status?.toUpperCase() === 'CONFIRMED' ? 'group-hover:bg-green-500 group-hover:text-white group-hover:border-green-500' :
                               res.status?.toUpperCase() === 'PENDING_PAYMENT' ? 'group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500' :
                               res.status?.toUpperCase() === 'PENDING_VERIFICATION' ? 'group-hover:bg-yellow-500 group-hover:text-white group-hover:border-yellow-500' :
                               res.status?.toUpperCase() === 'CANCELLED' ? 'group-hover:bg-red-500 group-hover:text-white group-hover:border-red-500' :
                               'group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500'
                             ]" 
                             :to="`/Booking/status/${res.booking_ref}`"/>
                  </div>
                </div>

                <!-- Hover Effect -->
                <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                     :class="[
                       res.status?.toUpperCase() === 'CONFIRMED' ? 'bg-gradient-to-r from-green-400/10 to-green-400/10' :
                       res.status?.toUpperCase() === 'PENDING_PAYMENT' ? 'bg-gradient-to-r from-orange-400/10 to-orange-400/10' :
                       res.status?.toUpperCase() === 'PENDING_VERIFICATION' ? 'bg-gradient-to-r from-yellow-400/10 to-yellow-400/10' :
                       res.status?.toUpperCase() === 'CANCELLED' ? 'bg-gradient-to-r from-red-400/10 to-red-400/10' :
                       'bg-gradient-to-r from-blue-400/10 to-blue-400/10'
                     ]"></div>
              </div>
            </div>
            
            <!-- Empty State -->
            <div v-else class="text-center py-12">
              <div class="relative mx-auto mb-4">
                <div class="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center mx-auto">
                  <UIcon name="i-heroicons-calendar-x-mark" class="h-8 w-8 text-gray-400 dark:text-gray-500" />
                </div>
                <div class="absolute -top-1 -right-1 w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <UIcon name="i-heroicons-x-mark" class="h-3 w-3 text-white" />
                </div>
              </div>
              <h4 class="font-semibold text-gray-600 dark:text-gray-300 mb-2">{{ t('no_reservations') }}</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">{{ t('no_reservations_desc') }}</p>
              <UButton :label="t('make_reservation')" 
                       color="emerald" 
                       variant="soft" 
                       icon="i-heroicons-plus-circle"
                       size="sm"
                       to="/Booking/bookinglist" />
            </div>
          </UCard>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Enhanced animations and effects */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.group:hover .animate-float {
  animation: float 2s ease-in-out infinite;
}

/* Booking card hover effects */
.booking-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.booking-card:hover::before {
  left: 100%;
}

/* Smooth scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #10b981, #059669);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #059669, #047857);
}

/* Custom gradient backgrounds for dark mode */
.dark ::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #065f46, #064e3b);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #064e3b, #052e16);
}

/* Pulse animation for booking reference */
@keyframes pulse-emerald {
  0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
}

.animate-pulse-emerald {
  animation: pulse-emerald 2s infinite;
}
</style>