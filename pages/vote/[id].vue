<script setup lang="ts">
import { useCookie } from '#app';

const route = useRoute();
const toast = useToast();
const messageId = computed(() => Array.isArray(route.params.id) ? route.params.id[0] : route.params.id);

const votedItems = useCookie<Record<string, number>>('voted-items', {
  default: () => ({}),
  maxAge: 60 * 60 * 24 * 365
});

const hasVotedWithin24Hours = computed(() => {
  const voteTimestamp = votedItems.value[messageId.value];
  if (!voteTimestamp) return false;
  const twentyFourHoursInMillis = 24 * 60 * 60 * 1000;
  return (Date.now() - voteTimestamp) < twentyFourHoursInMillis;
});

const { data: message, pending: isLoading, error } = await useFetch(`/api/messages/${messageId.value}`);

const submitVote = async () => {
  if (hasVotedWithin24Hours.value) {
    toast.add({ title: 'โหวตแล้ว', description: 'คุณสามารถโหวตให้รายการนี้ได้อีกครั้งในอีก 24 ชั่วโมง', color: 'blue' });
    return;
  }
  
  try {
    await $fetch(`/api/vote/${messageId.value}`, { method: 'POST' });
    toast.add({ title: 'ขอบคุณสำหรับคะแนน!', icon: 'i-heroicons-heart-solid', color: 'green' });
    votedItems.value = { ...votedItems.value, [messageId.value]: Date.now() };
  } catch (err) {
    toast.add({ title: 'เกิดข้อผิดพลาด', description: 'ไม่สามารถส่งคะแนนได้', color: 'red' });
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
    <div v-if="isLoading" class="text-center"><p>กำลังโหลด...</p></div>
    <div v-else-if="error || !message" class="text-center">
       <h1 class="text-2xl font-bold text-red-500">ไม่พบข้อมูล</h1>
       <p class="text-gray-500">ลิงก์อาจไม่ถูกต้องหรือรายการถูกลบไปแล้ว</p>
    </div>
    <div v-else class="max-w-sm w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
      <h1 class="text-xl font-semibold mb-4">{{ message.caption }}</h1>
      <img :src="`/uploads/${message.image_filename}`" :alt="message.caption" class="w-full h-auto object-cover rounded-lg mb-6 shadow-md">
      
      <UButton 
        @click="submitVote"
        :disabled="hasVotedWithin24Hours"
        :label="hasVotedWithin24Hours ? 'โหวตแล้ว!' : 'กดหัวใจ'"
        icon="i-heroicons-heart-solid"
        size="xl"
        block
        :color="hasVotedWithin24Hours ? 'gray' : 'red'"
        class="transition-transform duration-200 ease-in-out"
        :ui="{ base: 'justify-center' }"
      />
      <p v-if="hasVotedWithin24Hours" class="text-xs text-gray-400 mt-2">
        คุณสามารถโหวตอีกครั้งได้ในอีก 24 ชั่วโมง
      </p>
    </div>
  </div>
</template>