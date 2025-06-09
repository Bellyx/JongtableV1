<template>
  <div class="mt-4">
    <div v-if="reservations.length === 0" class="text-center p-6 bg-blue-100 border border-blue-300 border-dashed rounded-lg text-blue-700 animate-pulse">
      <i class="fas fa-info-circle text-4xl mb-4"></i>
      <p class="text-lg font-medium mb-4">คุณยังไม่มีการจองโต๊ะในขณะนี้</p>
      <button class="bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md">
        <i class="fas fa-plus-circle mr-2"></i>จองโต๊ะใหม่
      </button>
    </div>
    <ul v-else class="space-y-5">
      <li v-for="reservation in reservations" :key="reservation.id" class="bg-white border border-gray-200 rounded-lg p-5 flex flex-col md:flex-row items-start md:items-center gap-4 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
        <div class="flex-1 min-w-[180px] text-gray-800">
          <strong class="text-blue-700">รหัสการจอง:</strong> <span class="font-semibold">{{ reservation.id }}</span>
        </div>
        <div class="flex-1 min-w-[200px] text-gray-800">
          <strong class="text-blue-700">วันที่:</strong> {{ reservation.date }} เวลา: {{ reservation.time }}
        </div>
        <div class="flex-1 min-w-[120px] text-gray-800">
          <strong class="text-blue-700">จำนวนคน:</strong> {{ reservation.guests }} ท่าน
        </div>
        <div class="flex-1 min-w-[120px] text-gray-800">
          <strong class="text-blue-700">สถานะ:</strong>
          <span
            :class="{
              'px-3 py-1 rounded-full text-sm font-bold': true,
              'bg-green-200 text-green-800': reservation.status === 'Confirmed',
              'bg-yellow-200 text-yellow-800': reservation.status === 'Pending',
              'bg-red-200 text-red-800': reservation.status === 'Cancelled'
            }"
          >
            {{ reservation.status }}
          </span>
        </div>
        <div class="ml-auto flex flex-wrap gap-3 mt-4 md:mt-0">
          <button v-if="reservation.status === 'Pending'" class="bg-blue-500 text-white py-2.5 px-4 rounded-md text-sm font-semibold hover:bg-blue-600 transition-colors duration-200 shadow-sm">
            <i class="fas fa-check-circle mr-1"></i> ยืนยัน
          </button>
          <button v-if="reservation.status !== 'Cancelled'" class="bg-red-500 text-white py-2.5 px-4 rounded-md text-sm font-semibold hover:bg-red-600 transition-colors duration-200 shadow-sm">
            <i class="fas fa-times-circle mr-1"></i> ยกเลิก
          </button>
          <button class="bg-gray-500 text-white py-2.5 px-4 rounded-md text-sm font-semibold hover:bg-gray-600 transition-colors duration-200 shadow-sm">
            <i class="fas fa-info-circle mr-1"></i> ดูรายละเอียด
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'TableReservations',
  data() {
    return {
      reservations: [
        { id: 'R12345', date: '2025-06-15', time: '19:00', guests: 4, status: 'Confirmed' },
        { id: 'R12346', date: '2025-06-20', time: '18:30', guests: 2, status: 'Pending' },
        { id: 'R12347', date: '2025-06-10', time: '20:00', guests: 6, status: 'Cancelled' },
      ]
    };
  }
};
</script>