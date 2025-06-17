<template>
  <UContainer class="py-12">
    <UCard v-if="!bookingResult" class="max-w-2xl mx-auto shadow-xl">
      <template #header>
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <UIcon name="i-heroicons-calendar-days" class="w-8 h-8 text-primary" />
          </div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Book a Table</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">Reserve your perfect dining experience</p>
        </div>
      </template>

      <UForm :state="formState" @submit="handleCreateBooking" class="space-y-6">
        <UFormGroup label="Full Name" name="name" required>
          <template #label>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-user" class="w-4 h-4 text-gray-500" />
              <span>Full Name</span>
            </div>
          </template>
          <UInput 
            v-model="formState.name" 
            placeholder="Enter your full name"
            size="lg"
            class="transition-all duration-200 hover:shadow-md focus:shadow-lg"
          />
        </UFormGroup>

        <UFormGroup label="Email Address" name="email" required>
          <template #label>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-envelope" class="w-4 h-4 text-gray-500" />
              <span>Email Address</span>
            </div>
          </template>
          <UInput 
            v-model="formState.email" 
            type="email" 
            placeholder="your.email@example.com"
            size="lg"
            class="transition-all duration-200 hover:shadow-md focus:shadow-lg"
          />
        </UFormGroup>

        <UFormGroup label="Date and Time" name="booking_datetime" required>
          <template #label>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-clock" class="w-4 h-4 text-gray-500" />
              <span>Date and Time</span>
            </div>
          </template>
          <UInput 
            v-model="formState.booking_datetime" 
            type="datetime-local" 
            size="lg"
            class="transition-all duration-200 hover:shadow-md focus:shadow-lg"
          />
        </UFormGroup>
        
        <UFormGroup label="Number of Guests" name="guests" required>
          <template #label>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-users" class="w-4 h-4 text-gray-500" />
              <span>Number of Guests</span>
            </div>
          </template>
          <UInput 
            v-model.number="formState.guests" 
            type="number" 
            :min="1" 
            placeholder="1"
            size="lg"
            class="transition-all duration-200 hover:shadow-md focus:shadow-lg"
          />
        </UFormGroup>
        
        <div class="pt-4">
          <UButton 
            type="submit" 
            :loading="isLoading" 
            size="lg" 
            class="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
          >
            <template #leading>
              <UIcon name="i-heroicons-sparkles" />
            </template>
            Reserve Now
          </UButton>
        </div>
      </UForm>
    </UCard>
    
    <UModal v-model="isModalOpen" prevent-close>
      <UCard class="max-w-md mx-auto">
        <template #header>
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full mb-3">
              <UIcon name="i-heroicons-qr-code" class="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Scan to Pay Deposit</h2>
          </div>
        </template>
        
        <div class="text-center space-y-4">
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Booking Reference</p>
            <div class="flex items-center justify-center gap-2">
              <UIcon name="i-heroicons-ticket" class="w-4 h-4 text-primary" />
              <p class="text-lg font-bold text-gray-900 dark:text-white">
                {{ bookingResult?.booking_ref }}
              </p>
            </div>
          </div>
          
          <div class="flex justify-center">
            <div class="p-4 bg-white rounded-lg shadow-inner">
              <canvas ref="qrCanvas"></canvas>
            </div>
          </div>
          
          <div class="bg-primary/5 dark:bg-primary/10 rounded-lg p-4">
            <div class="flex items-center justify-center gap-2 mb-2">
              <UIcon name="i-heroicons-banknotes" class="w-5 h-5 text-primary" />
              <p class="text-lg font-bold text-primary">
                {{ bookingResult?.payment_amount.toFixed(2) }} THB
              </p>
            </div>
            <div class="flex items-center justify-center gap-2">
              <UIcon name="i-heroicons-clock" class="w-4 h-4 text-orange-500" />
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Complete payment within {{ countdown }}
              </p>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="text-center">
            <UButton 
              variant="ghost" 
              size="lg" 
              @click="goToUploadSlipPage"
              class="text-primary hover:bg-primary/10 transition-all duration-200"
            >
              <template #leading>
                <UIcon name="i-heroicons-photo" />
              </template>
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