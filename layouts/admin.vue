<script setup lang="ts">
      import AdminSidebar from '~/components/admin/Sidebar.vue';
</script>

<template>
  <div class="flex h-screen bg-white dark:bg-gray-900">
    <AdminSidebar />
    
    <main class="flex-1 p-6 md:p-8 overflow-y-auto">
      <slot />
    </main>
  </div>
</template>