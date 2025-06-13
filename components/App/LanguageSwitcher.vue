<script setup lang="ts">
import { computed, ref } from 'vue'
// import { useI18n } from 'vue-i18n'
import { useDebounce } from '~/composables/useDebounce' // 1. Import Debounce

const { locale, setLocale } = useI18n()
const isLoading = ref(false)

const nextLocale = computed(() => (locale.value === 'th' ? 'en' : 'th'))
const nextLocaleName = computed(() => (nextLocale.value === 'th' ? 'ภาษาไทย' : 'English'))
const nextLocaleFlagIcon = computed(() => (nextLocale.value === 'th' ? 'circle-flags:th' : 'circle-flags:us'))

// 2. สร้างฟังก์ชัน Logic หลักเอาไว้ แต่ใส่ _ นำหน้าเพื่อบอกว่าเป็นฟังก์ชันภายใน
async function _toggleLocale() {
  // Logic การใช้ isLoading ยังคงเหมือนเดิมทุกประการ
  if (isLoading.value) return
  isLoading.value = true
  try {
    await setLocale(nextLocale.value)
  } catch (error) {
    console.error('Failed to switch locale:', error)
  } finally {
    isLoading.value = false
  }
}

// 3. นำฟังก์ชัน Logic หลักไปใส่ใน Debounce
// เพิ่มเวลาหน่วงเป็น 400ms เพื่อให้แน่ใจว่ากรองคลิกได้หมดจด
const toggleLocale = useDebounce(_toggleLocale, 400)

</script>

<template>
  <UTooltip :text="`Switch to ${nextLocaleName}`" :ui="{ popper: { strategy: 'absolute' ,placement: 'bottom'} }">
    <UButton
      color="gray"
      variant="ghost"
      square
      size="lg"
      @click="toggleLocale"
      :loading="isLoading"
      :disabled="isLoading"
    >
      <Icon
        :name="nextLocaleFlagIcon"
        class="w-6 h-6"
      />
    </UButton>
  </UTooltip>
</template>