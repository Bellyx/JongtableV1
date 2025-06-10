export default defineNuxtConfig({
  devtools: { enabled: true },

  runtimeConfig: {
    // ค่าฝั่ง Server-side เท่านั้น (ไม่แสดงให้ User เห็น)
    apiSecret: process.env.API_SECRET,

    // ค่าที่ Public (แสดงผลฝั่ง Client-side ได้)
    public: {
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    }
  },

  modules: [
    "@nuxt/ui",
    "nuxt-icon",
    "@nuxtjs/i18n",
    "@nuxtjs/google-fonts",
    "@nuxtjs/fontaine",
    "@nuxt/image",
    "@nuxt/content",
    "@nuxthq/studio",
    "@vueuse/nuxt"
  ],

  ui: {
    icons: ["heroicons", "lucide", "circle-flags"],
  },

  app: {
    pageTransition: { name: "page", mode: "out-in" },
    head: {
      htmlAttrs: {
        lang: "en",
        class: "h-full",
      },
      bodyAttrs: {
        class: "antialiased bg-gray-50 dark:bg-black min-h-screen",
      },
    },
  },

  content: {
    highlight: {
      theme: "github-dark",
    },
  },

  googleFonts: {
    display: "swap",
    families: {
      Inter: [400, 500, 600, 700, 800, 900],
    },
  },

  i18n: {
    lazy: true,
    langDir: 'locales',
    strategy: 'prefix_except_default',
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        name: 'English',
        file: 'en.json'
      },
      {
        code: 'th',
        iso: 'th-TH',
        name: 'ภาษาไทย',
        file: 'th.json'
      }
    ],
    defaultLocale: 'th',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    }
  },
})
