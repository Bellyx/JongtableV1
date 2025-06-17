<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['auth-admin']
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
const coverImagePreview = ref<string | null>(null)
const detailsImagePreview = ref<string | null>(null)
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
    const file = input.files[0]
    if (type === 'cover') {
      coverImageFile.value = file
      const reader = new FileReader()
      reader.onload = (e) => coverImagePreview.value = e.target?.result as string
      reader.readAsDataURL(file)
    } else {
      detailsImageFile.value = file
      const reader = new FileReader()
      reader.onload = (e) => detailsImagePreview.value = e.target?.result as string
      reader.readAsDataURL(file)
    }
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
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- Header Section -->
      <div class="text-center py-8">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          จัดการกิจกรรม
        </h1>
        <p class="text-gray-600">สร้างและจัดการกิจกรรมทั้งหมดของคุณ</p>
      </div>
      
      <!-- Form Card -->
      <UCard class="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <template #header>
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Icon name="heroicons:plus" class="w-5 h-5 text-white" />
            </div>
            <h2 class="text-xl font-semibold text-gray-800">เพิ่ม/แก้ไขกิจกรรม</h2>
          </div>
        </template>
        
        <UForm :state="state" @submit="handleSubmit" class="space-y-6">
          <!-- Grid Layout for Form Fields -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Left Column -->
            <div class="space-y-6">
              <UFormGroup label="ชื่อกิจกรรม" name="name" required>
                <UInput 
                  v-model="state.name" 
                  placeholder="กรอกชื่อกิจกรรม"
                  size="lg"
                  class="transition-all duration-200 hover:scale-[1.02]"
                />
              </UFormGroup>
              
              <UFormGroup label="สถานะ" name="status" required>
                <USelect 
                  v-model="state.status" 
                  :options="statusOptions" 
                  size="lg"
                  class="transition-all duration-200 hover:scale-[1.02]"
                />
              </UFormGroup>
              
              <UFormGroup label="วันที่จัดกิจกรรม" name="event_date" required>
                <UInput 
                  v-model="state.event_date" 
                  type="datetime-local" 
                  size="lg"
                  class="transition-all duration-200 hover:scale-[1.02]"
                />
              </UFormGroup>
              
              <UFormGroup label="สถานที่จัด" name="location">
                <UInput 
                  v-model="state.location" 
                  placeholder="กรอกสถานที่จัดกิจกรรม"
                  size="lg"
                  class="transition-all duration-200 hover:scale-[1.02]"
                />
              </UFormGroup>
            </div>
            
            <!-- Right Column -->
            <div class="space-y-6">
              <UFormGroup label="เวลาเริ่มแสดงผล" name="display_start_time" required>
                <UInput 
                  v-model="state.display_start_time" 
                  type="datetime-local" 
                  size="lg"
                  class="transition-all duration-200 hover:scale-[1.02]"
                />
              </UFormGroup>
              
              <UFormGroup label="เวลาสิ้นสุดแสดงผล" name="display_end_time" required>
                <UInput 
                  v-model="state.display_end_time" 
                  type="datetime-local" 
                  size="lg"
                  class="transition-all duration-200 hover:scale-[1.02]"
                />
              </UFormGroup>
              
              <UFormGroup label="รายละเอียด" name="description">
                <UTextarea 
                  v-model="state.description" 
                  placeholder="กรอกรายละเอียดกิจกรรม"
                  :rows="4"
                  class="transition-all duration-200 hover:scale-[1.02]"
                />
              </UFormGroup>
            </div>
          </div>
          
          <!-- Image Upload Section -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-gray-200">
            <!-- Cover Image -->
            <div class="space-y-4">
              <UFormGroup label="รูปภาพปก">
                <div class="space-y-4">
                  <div class="relative">
                    <input 
                      type="file" 
                      @change="onFileChange($event, 'cover')" 
                      accept="image/*"
                      class="hidden"
                      id="cover-upload"
                    />
                    <label 
                      for="cover-upload"
                      class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <Icon name="heroicons:photo" class="w-8 h-8 text-gray-400 mb-2" />
                      <p class="text-sm text-gray-500">คลิกเพื่อเลือกรูปภาพปก</p>
                    </label>
                  </div>
                  
                  <!-- Cover Image Preview -->
                  <div v-if="coverImagePreview" class="relative">
                    <img 
                      :src="coverImagePreview" 
                      alt="Cover Preview" 
                      class="w-full h-48 object-cover rounded-lg shadow-md"
                    />
                    <button 
                      @click="coverImagePreview = null; coverImageFile = null"
                      class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <Icon name="heroicons:x-mark" class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </UFormGroup>
            </div>
            
            <!-- Details Image -->
            <div class="space-y-4">
              <UFormGroup label="รูปภาพรายละเอียด">
                <div class="space-y-4">
                  <div class="relative">
                    <input 
                      type="file" 
                      @change="onFileChange($event, 'details')" 
                      accept="image/*"
                      class="hidden"
                      id="details-upload"
                    />
                    <label 
                      for="details-upload"
                      class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <Icon name="heroicons:photo" class="w-8 h-8 text-gray-400 mb-2" />
                      <p class="text-sm text-gray-500">คลิกเพื่อเลือกรูปภาพรายละเอียด</p>
                    </label>
                  </div>
                  
                  <!-- Details Image Preview -->
                  <div v-if="detailsImagePreview" class="relative">
                    <img 
                      :src="detailsImagePreview" 
                      alt="Details Preview" 
                      class="w-full h-48 object-cover rounded-lg shadow-md"
                    />
                    <button 
                      @click="detailsImagePreview = null; detailsImageFile = null"
                      class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <Icon name="heroicons:x-mark" class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </UFormGroup>
            </div>
          </div>
          
          <!-- Submit Button -->
          <div class="flex justify-end pt-6 border-t border-gray-200">
            <UButton 
              type="submit" 
              :loading="isLoading"
              size="lg"
              class="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <Icon name="heroicons:check" class="w-5 h-5 mr-2" />
              บันทึกกิจกรรม
            </UButton>
          </div>
        </UForm>
      </UCard>

      <!-- Events Table -->
      <UCard class="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <template #header>
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Icon name="heroicons:list-bullet" class="w-5 h-5 text-white" />
            </div>
            <h2 class="text-xl font-semibold text-gray-800">รายการกิจกรรมทั้งหมด</h2>
          </div>
        </template>
        
        <div class="overflow-hidden">
          <UTable 
            :rows="events || []" 
            :columns="columns" 
            :loading="pending"
            class="w-full"
          >
            <template #event_date-data="{ row }">
              <div class="flex items-center space-x-2">
                <Icon name="heroicons:calendar-days" class="w-4 h-4 text-blue-500" />
                <span class="text-sm font-medium">{{ formatThaiDateTime(row.event_date) }}</span>
              </div>
            </template>
            
            <template #status-data="{ row }">
              <UBadge 
                :color="row.status === 'UPCOMING' ? 'blue' : row.status === 'ONGOING' ? 'green' : 'gray'"
                variant="subtle"
                class="px-3 py-1"
              >
                {{ row.status }}
              </UBadge>
            </template>
            
            <template #actions-data="{ row }">
              <div class="flex items-center space-x-2">
                <UButton 
                  icon="i-heroicons-pencil-square" 
                  variant="ghost" 
                  color="blue"
                  size="sm"
                  class="hover:scale-110 transition-transform"
                />
                <UButton 
                  icon="i-heroicons-trash" 
                  color="red" 
                  variant="ghost" 
                  size="sm"
                  class="hover:scale-110 transition-transform"
                />
              </div>
            </template>
          </UTable>
        </div>
      </UCard>
    </div>
  </div>
</template>