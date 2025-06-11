<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

// --- Page Metadata ---
definePageMeta({
  layout: 'default',
})

// --- Mock Data ---
const user = ref({
  name: 'Belly',
  email: 'belly@example.com',
  avatar: 'https://avatars.githubusercontent.com/u/739984?v=4',
})

// Main action cards now use translation keys
const actions = computed(() => [
  { key: 'sendMessage', icon: 'i-heroicons-paper-airplane', to: '/Message/send-message', color: 'blue' },
  { key: 'bookingList', icon: 'i-heroicons-calendar-days', to: '/Booking/bookinglist', color: 'green' },
  { key: 'ticketList', icon: 'i-heroicons-ticket', to: '/Tickets/ticketlist', color: 'orange' },
  { key: 'menuList', icon: 'i-heroicons-book-open', to: '/Menu/menulist', color: 'red' },
  { key: 'reviewList', icon: 'i-heroicons-star', to: '/Review/Reviewlist', color: 'yellow' },
  { key: 'myProfile', icon: 'i-heroicons-user-circle', to: '#', color: 'gray' },
])

// Mock data for the new sidebar widgets
const upcomingReservations = ref([
  { id: 1, table: 'A5', date: '2025-06-15', time: '19:00', guests: 4 },
  { id: 2, table: 'C2', date: '2025-06-22', time: '20:30', guests: 2 },
])

const quickStats = computed(() => [
    { key: 'totalBookings', value: '12', icon: 'i-heroicons-calendar-days' },
    { key: 'ticketsPurchased', value: '5', icon: 'i-heroicons-ticket' },
])


// --- Logout Functionality ---
const router = useRouter()
const isLoading = ref(false)

function logout() {
  isLoading.value = true
  setTimeout(() => {
    console.log('User logged out.')
    isLoading.value = false
    router.push('/auth/signin')
  }, 1000)
}
</script>

<template>
  <div class="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900 min-h-screen">
    <div class="w-full max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <header class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg shadow-blue-100 dark:shadow-slate-900/50 p-6 mb-8 border border-white/20 dark:border-gray-700/50 backdrop-blur-sm">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="relative">
              <UAvatar :src="user.avatar" :alt="user.name" size="lg" class="ring-4 ring-blue-100 dark:ring-blue-900/50" />
              <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></div>
            </div>
            <div>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                {{ t('welcome', { name: user.name }) }} 👋
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
          <UCard class="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 shadow-xl shadow-blue-100/50 dark:shadow-slate-900/50 border border-white/20 dark:border-gray-700/50 backdrop-blur-sm" 
                 :ui="{ ring: 'dark:ring-slate-700', divide: 'dark:divide-slate-700' }">
             <div class="flex items-center gap-2 mb-6">
               <UIcon name="i-heroicons-chart-bar" class="h-5 w-5 text-blue-500" />
               <h3 class="font-bold text-lg text-gray-800 dark:text-white">{{ t('quick_stats') }}</h3>
             </div>
             <div class="space-y-4">
               <div v-for="stat in quickStats" :key="stat.key" class="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                   <div class="flex items-center gap-3">
                       <div class="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                         <UIcon :name="stat.icon" class="h-5 w-5 text-blue-600 dark:text-blue-400" />
                       </div>
                       <span class="text-gray-700 dark:text-gray-200 font-medium">{{ t(`stats.${stat.key}`) }}</span>
                   </div>
                   <UBadge color="blue" variant="subtle" size="lg" class="font-bold text-lg px-3 py-1">{{ stat.value }}</UBadge>
               </div>
             </div>
          </UCard>
          
          <UCard class="bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-gray-700 shadow-xl shadow-green-100/50 dark:shadow-slate-900/50 border border-white/20 dark:border-gray-700/50 backdrop-blur-sm" 
                 :ui="{ ring: 'dark:ring-slate-700', divide: 'dark:divide-slate-700' }">
            <div class="flex items-center gap-2 mb-4">
              <UIcon name="i-heroicons-calendar-days" class="h-4 w-4 text-green-500" />
              <h3 class="font-semibold text-base text-gray-800 dark:text-white">{{ t('upcoming_reservations') }}</h3>
            </div>
            
            <div v-if="upcomingReservations.length > 0" class="space-y-2">
              <div v-for="res in upcomingReservations" :key="res.id" 
                   class="group flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-100 dark:border-green-800/50 hover:shadow-md hover:scale-[1.01] transition-all duration-200">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    {{ res.table }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 text-sm">
                      <UIcon name="i-heroicons-users" class="h-3 w-3 text-green-600 flex-shrink-0" />
                      <span class="font-medium text-gray-800 dark:text-white">{{ res.guests }}</span>
                    </div>
                    <div class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                      <UIcon name="i-heroicons-clock" class="h-3 w-3 flex-shrink-0" />
                      <span class="truncate">{{ new Date(res.date).toLocaleDateString(locale, { month: 'short', day: 'numeric' }) }}, {{ res.time }}</span>
                    </div>
                  </div>
                </div>
                <UButton variant="ghost" 
                         size="xs" 
                         icon="i-heroicons-ellipsis-horizontal"
                         class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/30" />
              </div>
            </div>
            
            <div v-else class="text-center py-6">
              <UIcon name="i-heroicons-calendar-x-mark" class="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('no_reservations') }}</p>
              <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">{{ t('no_reservations_desc') }}</p>
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

.group:hover .animate-float {
  animation: float 2s ease-in-out infinite;
}

/* Smooth scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #cbd5e1, #94a3b8);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #94a3b8, #64748b);
}

/* Custom gradient backgrounds for dark mode */
.dark ::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #475569, #334155);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #334155, #1e293b);
}
</style>