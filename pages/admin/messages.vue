<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import QrcodeVue from 'qrcode.vue';

// State และตัวแปรอื่นๆ เหมือนเดิม
const caption = ref('');
const fileInput = ref<HTMLInputElement | null>(null);
const file = ref<File | null>(null);
const isLoading = ref(false);
const images = ref<any[]>([]);
const isFetching = ref(true);
const toast = useToast();
let pollingInterval: NodeJS.Timeout | null = null;

const getVoteUrl = (id: number) => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/vote/${id}`;
  }
  return '';
};

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files?.length) {
    file.value = target.files[0];
  }
};

const handleFormSubmit = async () => {
  if (!file.value || !caption.value) {
    toast.add({ title: 'ข้อผิดพลาด', description: 'กรุณากรอกข้อมูลให้ครบ', color: 'red' });
    return;
  }
  isLoading.value = true;
  const formData = new FormData();
  formData.append('caption', caption.value);
  formData.append('image', file.value);
  try {
    await $fetch('/api/messages/upload', { method: 'POST', body: formData });
    toast.add({ title: 'สำเร็จ', description: 'อัปโหลดรูปภาพเรียบร้อยแล้ว', color: 'green' });
    caption.value = '';
    file.value = null;
    if (fileInput.value) fileInput.value.value = '';
    await fetchImages(false);
  } catch (error: any) {
    toast.add({ title: 'เกิดข้อผิดพลาด', description: error.data?.message || 'ไม่สามารถอัปโหลดได้', color: 'red' });
  } finally {
    isLoading.value = false;
  }
};

// --- จุดที่แก้ไข ---
const fetchImages = async (showLoadingIndicator = true) => {
  if (showLoadingIndicator) {
    isFetching.value = true;
  }
  try {
    // เพิ่ม { cache: 'no-cache' } เข้าไปใน $fetch
    const data = await $fetch('/api/messages/gallery', {
      cache: 'no-cache'
    });
    images.value = data.images;
  } catch (error) {
    toast.add({ title: 'เกิดข้อผิดพลาด', description: 'ไม่สามารถโหลดข้อมูลรูปภาพได้', color: 'red' });
  } finally {
    if (showLoadingIndicator) {
      isFetching.value = false;
    }
  }
};

onMounted(() => {
  fetchImages(true);
  pollingInterval = setInterval(() => {
    fetchImages(false);
  }, 5000);
});

onUnmounted(() => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }
});

definePageMeta({
  middleware: ['auth-admin']
});
</script>

<template>
  <UContainer class="py-8">
    <div class="flex items-center gap-4 mb-8">
      <div class="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
        <UIcon name="i-heroicons-tv" class="h-8 w-8 text-white" />
      </div>
      <div>
        <h1 class="text-3xl font-bold">จัดการข้อความและรูปภาพ</h1>
        <p class="text-gray-600 dark:text-gray-300 mt-1">อัปโหลดรูปภาพและสร้าง QR Code สำหรับโหวต</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-1">
        <UCard>
          <template #header><h2 class="font-bold text-lg">อัปโหลดรูปภาพใหม่</h2></template>
          <form @submit.prevent="handleFormSubmit" class="space-y-4">
            <UFormGroup label="ข้อความ (Caption)" name="caption">
              <UInput v-model="caption" placeholder="ข้อความที่จะแสดง" />
            </UFormGroup>
            <UFormGroup label="เลือกรูปภาพ" name="image">
              <UInput ref="fileInput" type="file" accept="image/*" @change="onFileChange" />
            </UFormGroup>
            <UButton type="submit" label="อัปโหลด" :loading="isLoading" block size="lg" />
          </form>
        </UCard>
      </div>

      <div class="lg:col-span-2">
        <h2 class="text-xl font-bold mb-4">คลังรูปภาพ</h2>
        <div v-if="isFetching" class="text-center py-10"><p>กำลังโหลด...</p></div>
        <div v-else-if="images.length === 0" class="text-center py-10 text-gray-500"><p>ยังไม่มีรูปภาพในระบบ</p></div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UCard v-for="image in images" :key="image.id" class="overflow-hidden">
            <img :src="`/uploads/${image.image_filename}`" :alt="image.caption" class="w-full h-40 object-cover rounded-md">
            <template #footer>
              <p class="font-semibold truncate mb-2">{{ image.caption }}</p>
              <div class="flex items-center justify-between text-sm">
                <div class="flex items-center text-gray-500">
                  <UIcon name="i-heroicons-user-circle" class="mr-1.5"/>
                  <span class="text-xs truncate">{{ image.email || 'N/A' }}</span>
                </div>
                <div class="flex items-center font-bold text-base">
                  <UIcon name="i-heroicons-heart-solid" class="text-red-500 mr-1.5"/>
                  <span>{{ image.votes }}</span>
                </div>
              </div>
            <div class="mt-4 text-center p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <ClientOnly>
                <QrcodeVue
                  :value="getVoteUrl(image.id)"
                  :size="120"
                  level="H"
                />
                <template #fallback>
                  <div class="h-[120px] w-[120px] bg-gray-200 animate-pulse m-auto"></div>
                </template>
              </ClientOnly>
              <p class="text-xs mt-2 text-gray-500">Scan to Vote</p>
            </div>
            </template>
          </UCard>
        </div>
      </div>
    </div>
  </UContainer>
</template>