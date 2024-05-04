// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["nuxt-svgo", "dayjs-nuxt"],
  routeRules: {
    "/": { prerender: true },
  },
  app: {
    baseURL: "/",
    buildAssetsDir: "cloud",
    pageTransition: { name: "index", mode: "out-in" },
    head: {
      script: [
        {
          src: "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback",
        },
      ],
    },
  },
})
