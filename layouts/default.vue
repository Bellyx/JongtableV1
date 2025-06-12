<script setup lang="ts">
  // หากมี import ที่ต้องใช้ใน AppNavbar หรือ AppFooter ให้คงไว้
</script>

<template>
  <div>
    <AppNavbar />
    <div class="h-32"></div>
    <UContainer>
      <slot /> 
      <UNotifications group="top-right" position="top-right" />
    </UContainer>
    <div class="h-32"></div>
    <AppFooter />
  </div>
</template>

<style>
/* สามารถย้าย Style จาก app.vue มาไว้ที่นี่ได้ */
.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
.page-enter-from {
  opacity: 0;
  transform: translateY(5px);
}
</style>