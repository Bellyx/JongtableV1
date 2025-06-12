<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['auth-admin']
})
useHead({
  title: 'จัดการกิจกรรม' // ไม่ต้องใส่ "| Jongtable" ซ้ำ
})
const toast = useToast()

// --- State for Form ---
const state = ref({
  name: '',
  description: '',
  event_date: '',
  location: '',
  status: 'UPCOMING',
  display_start_time: '',
  display_end_time: ''
})
const coverImageFile = ref<File | null>(null)
const detailsImageFile = ref<File | null>(null)
const isLoading = ref(false)
const statusOptions = ['UPCOMING', 'ONGOING', 'ENDED']

// --- Fetching Events for Table ---
const { data: events, pending, error, refresh } = await useFetch('/api/events')

const columns = [
  { key: 'name', label: 'ชื่อกิจกรรม' },
  { key: 'event_date', label: 'วันที่จัด' }, // คอลัมน์เป้าหมาย
  { key: 'status', label: 'สถานะ' },
  { key: 'actions', label: 'จัดการ' }
]

// v-v-v-v-v-v-v-v-v-v-v-v-v-v-v-v-v-v-v-v-v-v-v
// --- 1. เพิ่มฟังก์ชันสำหรับแปลงวันที่ ---
function formatThaiDateTime(dateString: string | null) {
  if (!dateString) return '-' // ถ้าไม่มีข้อมูลให้แสดงขีด
  
  const date = new Date(dateString)

  // แปลงเป็นเวลาท้องถิ่นไทย พร้อมกำหนดรูปแบบ
  return date.toLocaleString('th-TH', {
    year: 'numeric', // ปี พ.ศ. แบบเต็ม
    month: 'short',  // เดือนแบบย่อ (เช่น มิ.ย.)
    day: 'numeric',   // วันที่
    hour: '2-digit',  // ชั่วโมง (เลข 2 หลัก)
    minute: '2-digit',// นาที (เลข 2 หลัก)
    timeZone: 'Asia/Bangkok' // ระบุ Timezone เป็นกรุงเทพ
  }) + ' น.'
}
// ^-^-^-^-^-^-^-^-^-^-^-^-^-^-^-^-^-^-^-^-^-^-^-^

// --- Form Submission Logic ---
function onFileChange(event: Event, type: 'cover' | 'details') {
  const input = event.target as HTMLInputElement
  if (input.files?.[0]) {
    if (type === 'cover') coverImageFile.value = input.files[0]
    else detailsImageFile.value = input.files[0]
  }
}

async function handleSubmit() {
  isLoading.value = true
  const formData = new FormData()
  
  Object.entries(state.value).forEach(([key, value]) => {
    formData.append(key, value)
  })
  
  if (coverImageFile.value) formData.append('cover_image', coverImageFile.value)
  if (detailsImageFile.value) formData.append('details_image', detailsImageFile.value)

  try {
    await $fetch('/api/events', { method: 'POST', body: formData })
    toast.add({ title: 'สำเร็จ!', description: 'สร้างกิจกรรมเรียบร้อยแล้ว', color: 'green' })
    refresh()
  } catch (err: any) {
    toast.add({ title: 'เกิดข้อผิดพลาด!', description: err.data?.message || 'ไม่สามารถสร้างกิจกรรมได้', color: 'red' })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">จัดการกิจกรรม</h1>
    
    <UCard class="mb-8">
      <template #header><h2>เพิ่ม/แก้ไขกิจกรรม</h2></template>
      <UForm :state="state" @submit="handleSubmit" class="space-y-4">
        <UFormGroup label="ชื่อกิจกรรม" name="name" required><UInput v-model="state.name" /></UFormGroup>
        <UFormGroup label="สถานะ" name="status" required><USelect v-model="state.status" :options="statusOptions" /></UFormGroup>
        <UFormGroup label="วันที่จัดกิจกรรม" name="event_date" required><UInput v-model="state.event_date" type="datetime-local" /></UFormGroup>
        <UFormGroup label="เวลาเริ่มแสดงผล" name="display_start_time" required><UInput v-model="state.display_start_time" type="datetime-local" /></UFormGroup>
        <UFormGroup label="เวลาสิ้นสุดแสดงผล" name="display_end_time" required><UInput v-model="state.display_end_time" type="datetime-local" /></UFormGroup>
        <UFormGroup label="สถานที่จัด" name="location"><UInput v-model="state.location" /></UFormGroup>
        <UFormGroup label="รายละเอียด" name="description"><UTextarea v-model="state.description" /></UFormGroup>
        <UFormGroup label="รูปภาพปก"><input type="file" @change="onFileChange($event, 'cover')" accept="image/*" /></UFormGroup>
        <UFormGroup label="รูปภาพรายละเอียด"><input type="file" @change="onFileChange($event, 'details')" accept="image/*" /></UFormGroup>
        <UButton type="submit" :loading="isLoading">บันทึกกิจกรรม</UButton>
      </UForm>
    </UCard>

    <UCard>
        <template #header><h2>รายการกิจกรรมทั้งหมด</h2></template>
        
        <UTable :rows="events || []" :columns="columns" :loading="pending">
          <template #event_date-data="{ row }">
            <span>{{ formatThaiDateTime(row.event_date) }}</span>
          </template>
          <template #actions-data="{ row }">
            <UButton icon="i-heroicons-pencil-square" variant="ghost" />
            <UButton icon="i-heroicons-trash" color="red" variant="ghost" />
          </template>
        </UTable>
    </UCard>
  </div>
</template>