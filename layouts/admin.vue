<script setup lang="ts">
import AdminSidebar from '~/components/admin/Sidebar.vue';
import { ref } from 'vue';

const sidebarOpen = ref(false);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};
</script>

<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Mobile overlay -->
    <div 
      v-if="sidebarOpen" 
      @click="sidebarOpen = false"
      class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden transition-opacity duration-300"
    ></div>
    
    <!-- Sidebar -->
    <AdminSidebar 
      :is-open="sidebarOpen" 
      @close="sidebarOpen = false" 
    />
    
    <!-- Main content -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Mobile header -->
      <header class="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <button
          @click="toggleSidebar"
          class="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </header>
      
      <!-- Main content area -->
      <main class="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>