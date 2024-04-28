// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["nuxt-svgo"],
  routeRules: {
    "/": { prerender: true },
  },
  app: {
    pageTransition: { name: "index", mode: "out-in" },
  },
})
