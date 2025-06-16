
<template>
  <div class="space-y-6">
    <h1 class="text-xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
      สวัสดีทุกคน!
    </h1>

    <!-- 🔔 แถบประกาศ -->
    <div class="relative overflow-hidden" aria-label="announcement">
      <div
        class="flex items-center space-x-3 px-4 py-3 rounded-md bg-yellow-100 text-yellow-900 font-medium animate-slide-in shadow-sm"
      >
        <span class="text-xl">📢</span>
        <span>{{ announcement }}</span>
      </div>
    </div>


    <!-- ปุ่มlogin - Register -->
      <div class="flex space-x-4">
        <!-- Login Button -->
        <NuxtLink
          to="/auth/signin"
          class="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:brightness-110 transition inline-block"
        >
          เข้าสู่ระบบ
        </NuxtLink>

        <!-- Register Button -->
        <NuxtLink
          to="/auth/register"
          class="px-6 py-2 bg-gradient-to-r from-green-400 to-emerald-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:brightness-110 transition inline-block"
        >
          สมัครสมาชิก
        </NuxtLink>
      </div>

    <!-- 🧩 ปุ่มต่าง ๆ แบบ Card Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- ปุ่มต่าง ๆ เหมือนเดิม ... -->
      <NuxtLink to="/Booking/" class="block p-4 rounded-lg shadow bg-blue-600 text-white hover:bg-blue-700 transition">
        <span class="text-lg">🪑</span> จองโต๊ะ
      </NuxtLink>
      <NuxtLink to="/Menu/menulist" class="block p-4 rounded-lg shadow bg-green-600 text-white hover:bg-green-700 transition">
        <span class="text-lg">🍽️</span> รายการอาหาร
      </NuxtLink>
      <NuxtLink to="/Tickets/ticketlist" class="block p-4 rounded-lg shadow bg-purple-600 text-white hover:bg-purple-700 transition">
        <span class="text-lg">🎟️</span> ซื้อตั๋วเข้างาน
      </NuxtLink>
      <NuxtLink to="/Message/send-message" class="block p-4 rounded-lg shadow bg-yellow-600 text-white hover:bg-yellow-700 transition">
        <span class="text-lg">💬</span> ส่งข้อความขึ้นจอ
      </NuxtLink>
      <NuxtLink to="/Review/Reviewlist" class="block p-4 rounded-lg shadow bg-red-600 text-white hover:bg-red-700 transition">
        <span class="text-lg">⭐</span> รีวิวร้าน
      </NuxtLink>
      <NuxtLink to="https://maps.app.goo.gl/9M283TiMKPTXhzBH6" class="block p-4 rounded-lg shadow bg-pink-600 text-white hover:bg-pink-700 transition">
        <span class="text-lg">📍</span> โลเคชั่นร้าน
      </NuxtLink>
    </div>

    <!-- 🎫 ส่วนหัวข้อ Tickets -->
 <div v-if="pending" class="pt-10 text-center">
    กำลังโหลดกิจกรรม...
  </div>

  <div v-else-if="publicEvents && publicEvents.length > 0" class="pt-10 border-t border-gray-200 dark:border-gray-700">
    <div class="flex items-center justify-between mb-4 px-2 sm:px-0">
      <div class="flex items-center space-x-2">
        <span class="text-2xl">🎫</span>
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
          กิจกรรมที่กำลังมาถึง
        </h2>
      </div>
      <NuxtLink to="/events" class="text-sm text-blue-600 hover:underline">
        ดูทั้งหมด →
      </NuxtLink>
    </div>

    <div class="flex space-x-4 overflow-x-auto px-2 pb-4 scroll-smooth scrollbar-hide">
      <div
        v-for="event in publicEvents"
        :key="event.id"
        class="flex-none w-64 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-xl shadow-lg p-4"
      >
        <img
          :src="event.cover_image_url || 'https://placehold.co/600x400/EEE/31343C?text=Event'"
          alt="Event Cover Image"
          class="rounded-md mb-3 w-full h-36 object-cover shadow-md border border-white/20"
        />
        <h3 class="font-semibold text-lg mb-1 truncate">
          {{ event.name }}
        </h3>
        <p class="text-sm opacity-90 mb-3">
          📅 {{ new Date(event.event_date).toLocaleDateString('th-TH') }}
        </p>
        <span class="px-2 py-0.5 text-xs rounded-full" 
              :class="{'bg-green-400 text-green-900': event.calculatedStatus === 'กิจกรรมกำลังเริ่ม', 'bg-blue-300 text-blue-900': event.calculatedStatus === 'เร็วๆ นี้'}">
          {{ event.calculatedStatus }}
        </span>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const { data: publicEvents, pending } = await useFetch('/api/events?scope=public')
const announcement = ref("โปรโมชั่นพิเศษ! จองโต๊ะวันนี้ รับฟรีเครื่องดื่ม 1 แก้ว 🍹");

const events = ref([
  {
    id: 1,
    title: "งานดนตรีกลางแจ้ง",
    date: "20 มิ.ย. 2568",
    image: "",
    link: "",
  },
  // {
  //   id: 2,
  //   title: "เวิร์กช็อปทำอาหาร",
  //   date: "25 มิ.ย. 2568",
  //   image: "/events/cooking-workshop.jpg",
  //   link: "/tickets/cooking-workshop",
  // },
  // {
  //   id: 3,
  //   title: "แกลเลอรี่งานศิลปะ",
  //   date: "30 มิ.ย. 2568",
  //   image: "/events/art-exhibition.jpg",
  //   link: "/tickets/art-exhibition",
  // },
]);
</script>

<style scoped>
@keyframes slide-in {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.5s ease-out;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>