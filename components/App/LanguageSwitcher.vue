<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale, setLocale } = useI18n()

// คำนวณภาษาถัดไป
const nextLocale = computed(() => locale.value === 'th' ? 'en' : 'th')

// ชื่อภาษา
const nextLocaleName = computed(() => nextLocale.value === 'th' ? 'ภาษาไทย' : 'English')

// ไอคอนธงชาติ (ใช้ circle-flags)
const nextLocaleFlagIcon = computed(() => nextLocale.value === 'th' ? 'circle-flags:th' : 'circle-flags:us')

// เปลี่ยนภาษา
function toggleLocale() {
  setLocale(nextLocale.value)
}
</script>

<template>
  <UTooltip :text="`Switch to ${nextLocaleName}`" :popper="{ placement: 'bottom' }">
    <UButton
      color="gray"
      variant="ghost"
      square
      size="lg"
      @click="toggleLocale"
    >
      <Icon
        :name="nextLocaleFlagIcon"
        class="w-6 h-6"
      />
    </UButton>
  </UTooltip>
</template>

<style scoped>
/* เพิ่มเติมถ้าต้องการ */
</style>
