<script setup lang="ts">
import { NuxtLink } from '#components';
// นำเข้าไอคอนที่เราต้องการจาก lucide-vue-next
import { LayoutDashboard, MessagesSquare, CalendarDays, Settings ,Star  } from 'lucide-vue-next';

// รายการเมนูสำหรับ Sidebar
const menuItems = [
  { to: '/admin/dashboard', label: 'หน้าแรก', icon: LayoutDashboard },
  { to: '/admin/messages', label: 'จัดการข้อความขึ้นจอ', icon: MessagesSquare },
  { to: '/admin/events', label: 'จัดการกิจกรรม', icon: CalendarDays },
  { to: '/admin/reviews', label: 'รีวิวร้าน', icon: Star },
  // เพิ่มเมนูอื่นๆ ตามต้องการ
];
</script>

<template>
  <aside class="w-64 h-full flex-shrink-0 bg-gray-100 dark:bg-gray-800 p-4 border-r border-gray-200 dark:border-gray-700 flex flex-col">
    <div class="mb-8">
      <NuxtLink to="/admin/dashboard" class="text-2xl font-bold text-gray-900 dark:text-white">
        Jongtable Admin
      </NuxtLink>
    </div>
    
    <nav class="flex flex-col gap-2">
      <NuxtLink
        v-for="item in menuItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        active-class="bg-blue-500 text-white dark:bg-blue-600"
      >
        <component :is="item.icon" class="w-5 h-5" />
        <span>{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <div class="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
       <NuxtLink
        to="/admin/settings"
        class="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <Settings class="w-5 h-5" />
        <span>Settings</span>
      </NuxtLink>
    </div>
  </aside>
</template>

<style scoped>
/* active-class จะทำงานเมื่อ route ตรงกับ to ของ NuxtLink */
</style>