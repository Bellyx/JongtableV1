<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 font-sans">
    <div class="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
      <div class="p-8 lg:p-12">
        <h1 class="text-5xl font-extrabold text-center text-blue-800 mb-6 tracking-tight">
          Dashboard ของคุณ
        </h1>
        <p class="text-xl text-center text-gray-600 mb-10">
          ยินดีต้อนรับกลับ User, มาดูข้อมูลของคุณกัน!
        </p>

        <div class="grid gap-10 lg:grid-cols-2">
          <section class="bg-blue-50 p-7 rounded-lg shadow-lg border border-blue-200 transform hover:scale-105 transition-transform duration-300">
            <h2 class="text-3xl font-bold text-blue-700 mb-5 pb-3 border-b-2 border-blue-300">
              <i class="fas fa-calendar-alt text-blue-500 mr-3"></i>ข้อมูลการจองโต๊ะของคุณ
            </h2>
            <TableReservations />
          </section>

          <section class="bg-purple-50 p-7 rounded-lg shadow-lg border border-purple-200 transform hover:scale-105 transition-transform duration-300">
            <h2 class="text-3xl font-bold text-purple-700 mb-5 pb-3 border-b-2 border-purple-300">
              <i class="fas fa-comment-dots text-purple-500 mr-3"></i>ส่งข้อความขึ้นจอ
            </h2>
            <p class="text-gray-700 mb-6">คุณสามารถส่งข้อความพิเศษที่จะแสดงบนจอประชาสัมพันธ์ของร้านได้ที่นี่</p>
            <input type="text" placeholder="พิมพ์ข้อความของคุณ..." class="w-full p-4 mb-4 border border-purple-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-200 text-lg">
            <button class="w-full bg-purple-600 text-white py-3 px-6 rounded-lg text-xl font-semibold hover:bg-purple-700 transition-colors duration-200 shadow-md">
              ส่งข้อความ
            </button>
          </section>

          <section class="bg-green-50 p-7 rounded-lg shadow-lg border border-green-200 transform hover:scale-105 transition-transform duration-300">
            <h2 class="text-3xl font-bold text-green-700 mb-5 pb-3 border-b-2 border-green-300">
              <i class="fas fa-ticket-alt text-green-500 mr-3"></i>ซื้อตั๋วเข้างาน
            </h2>
            <p class="text-gray-700 mb-6">ตรวจสอบและซื้อบัตรเข้าชมกิจกรรมพิเศษต่างๆ ที่จัดขึ้นที่ร้าน</p>
            <button class="w-full bg-green-600 text-white py-3 px-6 rounded-lg text-xl font-semibold hover:bg-green-700 transition-colors duration-200 shadow-md">
              ดูตั๋วและกิจกรรม
            </button>
          </section>

          <section class="bg-yellow-50 p-7 rounded-lg shadow-lg border border-yellow-200 transform hover:scale-105 transition-transform duration-300">
            <h2 class="text-3xl font-bold text-yellow-700 mb-5 pb-3 border-b-2 border-yellow-300">
              <i class="fas fa-star text-yellow-500 mr-3"></i>รีวิวร้าน
            </h2>
            <p class="text-gray-700 mb-6">แบ่งปันประสบการณ์ของคุณกับเรา เพื่อให้เราพัฒนาบริการให้ดียิ่งขึ้น</p>
            <button class="w-full bg-yellow-600 text-white py-3 px-6 rounded-lg text-xl font-semibold hover:bg-yellow-700 transition-colors duration-200 shadow-md">
              เขียนรีวิว
            </button>
          </section>

          <section class="lg:col-span-2 bg-red-50 p-7 rounded-lg shadow-lg border border-red-200 transform hover:scale-105 transition-transform duration-300">
            <h2 class="text-3xl font-bold text-red-700 mb-5 pb-3 border-b-2 border-red-300">
              <i class="fas fa-user-circle text-red-500 mr-3"></i>ข้อมูลส่วนตัว
            </h2>
            <div class="flex items-center space-x-6 mb-6">
              <img src="../../public/avatar.png" alt="Profile Picture" class="w-24 h-24 rounded-full border-4 border-red-300 shadow-md object-cover">
              <div>
                <p class="text-2xl font-semibold text-gray-900">คุณ: <span class="font-bold text-red-600">ชื่อผู้ใช้งาน</span></p>
                <p class="text-lg text-gray-700">อีเมล: user@example.com</p>
                <p class="text-md text-gray-500">สถานะ: สมาชิก Platinum</p>
              </div>
            </div>
            <button class="bg-red-600 text-white py-3 px-6 rounded-lg text-xl font-semibold hover:bg-red-700 transition-colors duration-200 shadow-md">
              แก้ไขข้อมูลส่วนตัว
            </button>
          </section>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserDashboard',
  // เพิ่มการใช้ Font Awesome สำหรับไอคอน (ต้องติดตั้งใน Nuxt project ก่อน)
  head() {
    return {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css'
        }
      ]
    }
  }
}
</script>