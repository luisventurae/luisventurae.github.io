// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['nuxt-svgo', 'dayjs-nuxt', '@nuxtjs/i18n'],
  routeRules: {
    '/':    { prerender: true },
    '/es':  { prerender: true },
    '/en':  { prerender: true },
    '/fr':  { prerender: true },
  },
  i18n: {
    strategy: 'prefix_and_default',
    defaultLocale: 'es',
    locales: [
      { code: 'es', language: 'es-ES', file: 'es.json' },
      { code: 'en', language: 'en-US', file: 'en.json' },
      { code: 'fr', language: 'fr-FR', file: 'fr.json' },
    ],
    langDir: 'locales/',
    lazy: true,
  },
  runtimeConfig: {
    public: {
      turnstileSiteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY ?? '',
      workerUrl: process.env.NUXT_PUBLIC_WORKER_URL ?? '',
    },
  },
  app: {
    baseURL: '/',
    buildAssetsDir: 'cloud',
    pageTransition: { name: 'index', mode: 'out-in' },
    head: {
      script: [
        {
          src: 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback',
          defer: true,
        },
      ],
    },
  },
})
