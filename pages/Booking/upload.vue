<template>
  <UContainer class="py-12">
    <UCard>
      <template #header>
        <h1 class="text-2xl font-bold">Upload Payment Slip</h1>
        <p class="text-gray-500">For Booking Ref: {{ bookingRef }}</p>
      </template>

      <UForm :state="formState" @submit="handleUploadSlip">
        <fieldset :disabled="isLoading || isVerifying">
          
          <UFormGroup label="Payer Name" name="payer_name" class="mb-4">
            <UInput v-model="formState.payer_name" placeholder="Enter the name on the slip" />
          </UFormGroup>

          <UFormGroup label="Payment Date and Time" name="payment_timestamp" class="mb-4" required>
            <UInput v-model="formState.payment_timestamp" type="datetime-local" />
          </UFormGroup>
          
          <UFormGroup label="Slip File" name="slip_file" class="mb-4" required>
            <UInput type="file" @change="onFileChange" accept="image/*" />
          </UFormGroup>
          </fieldset>
        
        <UButton type="submit" :loading="isLoading" :disabled="!formState.slip_file || isVerifying">
          Submit Slip
        </UButton>
      </UForm>
    </UCard>

    <UModal v-model="isVerifying" prevent-close>
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">Verification Status</h2>
        </template>
        
        <div class="space-y-4">
          <div class="flex items-start">
            <UIcon name="i-heroicons-check-circle-solid" class="text-xl text-green-500 mr-3 mt-1" />
            <div>
              <p class="font-medium">อัพโหลด สลิป</p>
              <p class="text-sm text-gray-500">ระบบได้รับ สลิปของคุณเรียบร้อยแล้ว !</p>
            </div>
          </div>

          <div class="flex items-start">
            <UIcon v-if="timelineStep < 2" name="i-heroicons-arrow-path" class="text-xl text-primary-500 mr-3 mt-1 animate-spin" />
            <UIcon v-else name="i-heroicons-check-circle-solid" class="text-xl text-green-500 mr-3 mt-1" />
            <div>
              <p class="font-medium">การตรวจสอบอัตโนมัติ</p>
              <p class="text-sm text-gray-500">ระบบกำลังตรวจสอบ รายการโอนเงิน อัตโนมัติ </p>
            </div>
          </div>

          <div class="flex items-start">
            <UIcon v-if="finalStatus === 'UNKNOWN'" name="i-heroicons-arrow-path" class="text-xl text-primary-500 mr-3 mt-1 animate-spin" />
            <UIcon v-else-if="finalStatus === 'CONFIRMED'" name="i-heroicons-check-circle-solid" class="text-xl text-green-500 mr-3 mt-1" />
            <UIcon v-else-if="finalStatus === 'PENDING_VERIFICATION'" name="i-heroicons-exclamation-triangle-solid" class="text-xl text-amber-500 mr-3 mt-1" />
            <div>
              <p class="font-medium">สถานะการจอง</p>
              <p v-if="finalStatus === 'UNKNOWN'" class="text-sm text-gray-500">Waiting for final result...</p>
              <p v-else-if="finalStatus === 'CONFIRMED'" class="text-sm text-green-600">Your booking is confirmed. ขอบคุณ!</p>
              <p v-else-if="finalStatus === 'PENDING_VERIFICATION'" class="text-sm text-amber-600">
                กรุณาตรวจสอบสลิป. หรือ โปรดติดต่อเจ้าหน้าที่ 081-111-1111.
              </p>
            </div>
          </div>
        </div>

        <template #footer>
          <div v-if="finalStatus !== 'UNKNOWN'" class="text-center">
            <UButton to="/" variant="outline">กลับหน้าหลัก</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
    
  </UContainer>
</template>

<script setup lang="ts">
import { ref, reactive, onUnmounted } from 'vue';

interface BookingStatus {
  status: 'PENDING_VERIFICATION' | 'CONFIRMED' | 'PENDING_PAYMENT' | 'CANCELLED' | string;
}

const route = useRoute();
const bookingRef = route.query.ref as string;

const formState = reactive({
  booking_ref: bookingRef,
  payer_name: '',
  payment_timestamp: '',
  slip_file: null as File | null,
});

const isLoading = ref(false);
const isVerifying = ref(false);
const timelineStep = ref(1);
const finalStatus = ref('UNKNOWN');
let pollingInterval: NodeJS.Timeout | null = null;
let pollCount = 0;
const MAX_POLLS = 10;

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    formState.slip_file = input.files[0];
  }
}

function stopPolling(reason: string) {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
    console.log(`Polling stopped: ${reason}`);
  }
}

function startPolling(ref: string) {
  pollCount = 0;
  timelineStep.value = 2;

  pollingInterval = setInterval(async () => {
    pollCount++;
    console.log(`Polling attempt #${pollCount}`);
    try {
      const data = await $fetch<BookingStatus>(`/api/bookings/status/${ref}`);
      
      if (data && data.status === 'CONFIRMED') {
        finalStatus.value = 'CONFIRMED';
        stopPolling('Status updated.');
      } else if (pollCount >= MAX_POLLS) {
        finalStatus.value = 'PENDING_VERIFICATION';
        stopPolling('Max polls reached.');
      }
    } catch (err) {
      console.error("Polling failed:", err);
      finalStatus.value = 'PENDING_VERIFICATION';
      stopPolling('Error.');
    }
  }, 3000);
}

async function handleUploadSlip() {
  if (!formState.slip_file) {
    alert('Please select a slip file.');
    return;
  }
  
  isLoading.value = true;
  const formData = new FormData();
  formData.append('booking_ref', formState.booking_ref);
  formData.append('payer_name', formState.payer_name);
  formData.append('payment_timestamp', formState.payment_timestamp);
  formData.append('slip_file', formState.slip_file!);
  
  try {
    const result: any = await $fetch('/api/bookings/upload-slip', { method: 'POST', body: formData });
    
    isVerifying.value = true;
    
    if (result && result.finalStatus === 'CONFIRMED') {
      timelineStep.value = 3;
      finalStatus.value = 'CONFIRMED';
    } else {
      startPolling(formState.booking_ref);
    }
    
  } catch (error: any) {
    alert(error.data?.statusMessage || 'An error occurred during upload.');
  } finally {
    isLoading.value = false;
  }
}

const now = new Date();
now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
formState.payment_timestamp = now.toISOString().slice(0, 16);

onUnmounted(() => { stopPolling('Component unmounted.'); });
</script>