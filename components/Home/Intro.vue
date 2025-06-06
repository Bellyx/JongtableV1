
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

    <!-- 🧩 ปุ่มต่าง ๆ แบบ Card Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- ปุ่มต่าง ๆ เหมือนเดิม ... -->
      <NuxtLink to="/booking" class="block p-4 rounded-lg shadow bg-blue-600 text-white hover:bg-blue-700 transition">
        <span class="text-lg">🪑</span> จองโต๊ะ
      </NuxtLink>
      <NuxtLink to="/menu" class="block p-4 rounded-lg shadow bg-green-600 text-white hover:bg-green-700 transition">
        <span class="text-lg">🍽️</span> รายการอาหาร
      </NuxtLink>
      <NuxtLink to="/tickets" class="block p-4 rounded-lg shadow bg-purple-600 text-white hover:bg-purple-700 transition">
        <span class="text-lg">🎟️</span> ซื้อตั๋วเข้างาน
      </NuxtLink>
      <NuxtLink to="/send-message" class="block p-4 rounded-lg shadow bg-yellow-600 text-white hover:bg-yellow-700 transition">
        <span class="text-lg">💬</span> ส่งข้อความขึ้นจอ
      </NuxtLink>
      <NuxtLink to="/reviews" class="block p-4 rounded-lg shadow bg-red-600 text-white hover:bg-red-700 transition">
        <span class="text-lg">⭐</span> รีวิวร้าน
      </NuxtLink>
      <NuxtLink to="/location" class="block p-4 rounded-lg shadow bg-pink-600 text-white hover:bg-pink-700 transition">
        <span class="text-lg">📍</span> โลเคชั่นร้าน
      </NuxtLink>
    </div>

    <!-- 🎫 ส่วนหัวข้อ Tickets -->
    <div class="pt-10 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between mb-4 px-2 sm:px-0">
        <div class="flex items-center space-x-2">
          <span class="text-2xl">🎫</span>
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
            กิจกรรมที่กำลังมาถึง
          </h2>
        </div>
        <NuxtLink to="/tickets" class="text-sm text-blue-600 hover:underline">
          ดูทั้งหมด →
        </NuxtLink>
      </div>

      <!-- 🃏 การ์ดกิจกรรม Slide -->
      <div
        class="flex space-x-4 overflow-x-auto px-2 pb-4 scroll-smooth scrollbar-hide"
        ref="scrollContainer"
      >
        <div
          v-for="event in events.slice(0, 2)"
          :key="event.id"
          class="flex-none w-64 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-xl shadow-lg p-4"
        >
          <img
            :src="event.image"
            alt=""
            class="rounded-md mb-3 w-full h-36 object-cover shadow-md border border-white/20"
          />
          <h3 class="font-semibold text-lg mb-1">
            {{ event.title }}
          </h3>
          <p class="text-sm opacity-90 mb-3">
            📅 {{ event.date }}
          </p>
          <NuxtLink
            :to="event.link"
            class="inline-block px-3 py-1 bg-white text-indigo-700 font-medium rounded hover:bg-gray-100 transition text-sm"
          >
            ซื้อตั๋ว
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const announcement = ref("โปรโมชั่นพิเศษ! จองโต๊ะวันนี้ รับฟรีเครื่องดื่ม 1 แก้ว 🍹");

const events = ref([
  {
    id: 1,
    title: "งานดนตรีกลางแจ้ง",
    date: "20 มิ.ย. 2568",
    image: "/events/music-festival.jpg",
    link: "/tickets/music-festival",
  },
  {
    id: 2,
    title: "เวิร์กช็อปทำอาหาร",
    date: "25 มิ.ย. 2568",
    image: "/events/cooking-workshop.jpg",
    link: "/tickets/cooking-workshop",
  },
  {
    id: 3,
    title: "แกลเลอรี่งานศิลปะ",
    date: "30 มิ.ย. 2568",
    image: "/events/art-exhibition.jpg",
    link: "/tickets/art-exhibition",
  },
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