<template>
  <UContainer class="py-12">
    <UCard v-if="!bookingResult">
      <template #header>
        <h1 class="text-2xl font-bold">Book a Table</h1>
      </template>

      <UForm :state="formState" @submit="handleCreateBooking">
        <UFormGroup label="Name" name="name" class="mb-4" required>
          <UInput v-model="formState.name" />
        </UFormGroup>

        <UFormGroup label="Email" name="email" class="mb-4" required>
          <UInput v-model="formState.email" type="email" />
        </UFormGroup>

        <UFormGroup label="Date and Time" name="booking_datetime" class="mb-4" required>
          <UInput v-model="formState.booking_datetime" type="datetime-local" />
        </UFormGroup>
        
        <UFormGroup label="Number of Guests" name="guests" class="mb-4" required>
          <UInput v-model.number="formState.guests" type="number" :min="1" />
        </UFormGroup>
        
        <UButton type="submit" :loading="isLoading">
          Reserve Now
        </UButton>
      </UForm>
    </UCard>
    
    <UModal v-model="isModalOpen" prevent-close>
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">Scan to Pay Deposit</h2>
        </template>
        
        <div class="text-center">
          <p class="mb-2">Your booking reference is:</p>
          <p class="text-lg font-bold bg-gray-100 dark:bg-gray-800 py-2 rounded-md mb-4">
            {{ bookingResult?.booking_ref }}
          </p>
          
          <canvas ref="qrCanvas"></canvas>
          
          <p class="mt-4 text-lg font-bold">
            Please transfer: 
            <span class="text-primary">{{ bookingResult?.payment_amount.toFixed(2) }}</span>
            THB
          </p>
          <p class="text-sm text-gray-500 mt-2">
            Please complete the payment within {{ countdown }}
          </p>
        </div>

        <template #footer>
          <div class="text-center">
             <UButton variant="link" @click="goToUploadSlipPage">
              I have paid, upload slip
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

  </UContainer>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, onUnmounted } from 'vue';
import QRCode from 'qrcode';

const router = useRouter(); // For navigation

// --- State for the form ---
const formState = reactive({
  name: '',
  email: '',
  booking_datetime: '',
  guests: 1,
});

// --- State for API call and Modal ---
const isLoading = ref(false);
const isModalOpen = ref(false);
const bookingResult = ref<any>(null);
const qrCanvas = ref<HTMLCanvasElement | null>(null);

// --- State for Countdown Timer ---
const countdown = ref('');
let countdownInterval: NodeJS.Timeout;

// --- Function to handle form submission ---
async function handleCreateBooking() {
  isLoading.value = true;
  try {
    const result = await $fetch('/api/bookings/create', {
      method: 'POST',
      body: {
        ...formState,
        guests: Number(formState.guests) // Ensure guests is a number
      },
    });
    
    bookingResult.value = result;
    isModalOpen.value = true;

    // Wait for modal to be rendered, then draw QR code
    await nextTick();
    if (qrCanvas.value && result.qr_code_payload) {
      QRCode.toCanvas(qrCanvas.value, result.qr_code_payload, {
        width: 240,
        margin: 2
      });
    }

    // Start countdown
    startCountdown(new Date(result.expires_at));

  } catch (error: any) {
    // Basic error handling
    alert(error.data?.statusMessage || 'An error occurred.');
  } finally {
    isLoading.value = false;
  }
}

// --- Function for Countdown Timer ---
function startCountdown(expiryDate: Date) {
  countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = expiryDate.getTime() - now;

    if (distance < 0) {
      clearInterval(countdownInterval);
      countdown.value = 'Expired';
      return;
    }

    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdown.value = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} minutes`;
  }, 1000);
}

// --- Function to navigate to slip upload page ---
function goToUploadSlipPage() {
    // We will create this page in the next step
    router.push(`/booking/upload?ref=${bookingResult.value.booking_ref}`);
}


// Clean up the interval when the component is unmounted
onUnmounted(() => {
  clearInterval(countdownInterval);
});

// Set a default value for the date/time input to now
const now = new Date();
now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
formState.booking_datetime = now.toISOString().slice(0, 16);
</script>