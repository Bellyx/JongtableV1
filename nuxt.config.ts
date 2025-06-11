export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    // Keys ที่ใช้เฉพาะฝั่ง Server เท่านั้น (ปลอดภัย)
    apiSecret: process.env.API_SECRET,
    databaseUrl: process.env.DATABASE_URL,
    dbHost: process.env.DB_HOST,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbDatabase: process.env.DB_DATABASE,

    // Keys ที่ส่งไปให้ฝั่ง Client (หน้าเว็บ) ใช้งานได้ด้วย
    public: {
      apiBase: '/api',
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    },
   session: {
      name: 'nuxt-session',
      password: process.env.NUXT_SESSION_PASSWORD || 'fallback-super-secret-password-32-chars'
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
