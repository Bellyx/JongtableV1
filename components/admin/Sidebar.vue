<script setup lang="ts">
import { NuxtLink } from '#components';
// --- [แก้ไข] เพิ่ม ref เข้ามาใน import ---
import { computed, ref } from 'vue';
import { 
  LayoutDashboard, 
  MessagesSquare, 
  CalendarDays, 
  Settings,
  Star,
  ChevronRight,
  X,
  Sparkles,
  LogOut,
  Power
} from 'lucide-vue-next';

interface Props {
  isOpen?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false
});

const emit = defineEmits<{
  close: [];
}>();

// --- [แก้ไข] ส่วนของ Logout ที่รวมเข้ามา ---
const { user, logout: authLogout } = useAuth(); // เปลี่ยนชื่อ logout เพื่อไม่ให้ซ้ำ
const isLoading = ref(false);

const handleLogout = async () => {
 isLoading.value = true;
  await authLogout(); // เรียกใช้ฟังก์ชัน logout จาก useAuth
  // ไม่ต้องใช้ navigateTo เพราะใน useAuth มีการ redirect ไปหน้าแรกอยู่แล้ว
  isLoading.value = false;
  emit('close'); // Close sidebar on mobile after logout
};


// รายการเมนูสำหรับ Sidebar
const menuItems = [
  { 
    to: '/admin/dashboard', 
    label: 'หน้าแรก', 
    icon: LayoutDashboard,
    gradient: 'from-blue-500 to-purple-600'
  },
  { 
    to: '/admin/messages', 
    label: 'จัดการข้อความขึ้นจอ', 
    icon: MessagesSquare,
    gradient: 'from-green-500 to-teal-600'
  },
  { 
    to: '/admin/events', 
    label: 'จัดการกิจกรรม', 
    icon: CalendarDays,
    gradient: 'from-orange-500 to-red-600'
  },
  { 
    to: '/admin/reviews', 
    label: 'รีวิวร้าน', 
    icon: Star,
    gradient: 'from-yellow-500 to-orange-600'
  },
];

const sidebarClasses = computed(() => [
  'fixed lg:static inset-y-0 left-0 z-50 w-72 lg:w-80',
  'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900',
  'dark:from-gray-950 dark:via-gray-900 dark:to-gray-950',
  'backdrop-blur-xl border-r border-gray-200/10 dark:border-gray-700/20',
  'flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0',
  props.isOpen ? 'translate-x-0' : '-translate-x-full'
]);
</script>

<template>
  <aside :class="sidebarClasses">
    <div class="relative p-6 border-b border-gray-700/50">
      <button
        @click="emit('close')"
        class="absolute top-4 right-4 lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
      >
        <X class="w-5 h-5" />
      </button>
      
      <NuxtLink 
        to="/admin/dashboard" 
        class="flex items-center gap-3 group"
        @click="emit('close')"
      >
        <div class="relative">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles class="w-6 h-6 text-white" />
          </div>
          <div class="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
        </div>
        <div>
          <h1 class="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
            Jongtable
          </h1>
          <p class="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
            Admin Panel
          </p>
        </div>
      </NuxtLink>
    </div>
    
    <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
      <div class="space-y-1">
        <p class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          เมนูหลัก
        </p>
        
        <NuxtLink
          v-for="(item, index) in menuItems"
          :key="item.to"
          :to="item.to"
          @click="emit('close')"
          class="group flex items-center justify-between px-3 py-3 text-gray-300 rounded-xl hover:bg-gray-800/50 hover:text-white transition-all duration-200 hover:translate-x-1 hover:shadow-lg"
          active-class="bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30 shadow-lg shadow-blue-500/10"
        >
          <div class="flex items-center gap-3">
            <div class="relative">
              <div :class="[
                'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200',
                'bg-gradient-to-br', item.gradient,
                'group-hover:scale-110 group-hover:shadow-lg'
              ]">
                <component :is="item.icon" class="w-4 h-4 text-white" />
              </div>
            </div>
            <span class="font-medium group-hover:translate-x-1 transition-transform duration-200">
              {{ item.label }}
            </span>
          </div>
          <ChevronRight class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1" />
        </NuxtLink>
      </div>
    </nav>

    <div class="p-4 border-t border-gray-700/50 mt-auto">
      <div class="space-y-2">
        <p class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          ระบบ
        </p>
        
        <NuxtLink
          to="/admin/settings"
          @click="emit('close')"
          class="group flex items-center justify-between px-3 py-3 text-gray-300 rounded-xl hover:bg-gray-800/50 hover:text-white transition-all duration-200 hover:translate-x-1"
        >
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-all duration-200">
              <Settings class="w-4 h-4 text-white" />
            </div>
            <span class="font-medium group-hover:translate-x-1 transition-transform duration-200">
              ตั้งค่า
            </span>
          </div>
          <ChevronRight class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1" />
        </NuxtLink>
      </div>
      
      <div class="mt-4 space-y-3">
        <div class="p-3 bg-gray-800/30 rounded-xl border border-gray-700/30 hover:bg-gray-800/40 transition-all duration-200">
          <div class="flex items-center gap-3">
            <div class="relative">
              <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span class="text-sm font-bold text-white">A</span>
              </div>
              <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-gray-900 animate-pulse"></div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-white truncate">Admin User</p>
              <p class="text-xs text-gray-400 truncate">admin@jongtable.com</p>
            </div>
          </div>
        </div>
        
        <button
          @click="handleLogout"
          :disabled="isLoading"
          class="group w-full flex items-center gap-3 px-3 py-3 text-gray-300 rounded-xl border border-red-500/20 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-wait"
        >
          <div class="relative overflow-hidden">
            <div class="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
              <LogOut class="w-4 h-4 text-white transition-all duration-300 group-hover:translate-x-0.5" />
            </div>
            <div class="absolute inset-0 bg-red-400 rounded-lg opacity-0 group-hover:opacity-20 group-hover:animate-ping"></div>
          </div>
          <span class="font-medium group-hover:translate-x-1 transition-all duration-300">
            {{ isLoading ? 'กำลังออกจากระบบ...' : 'ออกจากระบบ' }}
          </span>
          <div class="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300" v-if="!isLoading">
            <div class="w-1 h-1 bg-red-400 rounded-full animate-bounce"></div>
            <div class="w-1 h-1 bg-red-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-1 h-1 bg-red-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          </div>
        </button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
/* Custom scrollbar for the navigation */
nav::-webkit-scrollbar {
  width: 4px;
}

nav::-webkit-scrollbar-track {
  background: transparent;
}

nav::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.5);
  border-radius: 2px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: rgba(75, 85, 99, 0.7);
}

/* Animation for menu items */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.group {
  animation: slideIn 0.3s ease-out;
}
</style>