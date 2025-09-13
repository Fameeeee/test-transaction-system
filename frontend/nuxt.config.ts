// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/icon"],
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    public: {
      apiBase: "/api",
    },
  },
  nitro: {
    routeRules: {
      "/api/**": {
        proxy: `${
          (globalThis as any).process?.env?.NUXT_PROXY_TARGET ||
          "http://localhost:4000/api"
        }/**`,
      },
    },
  },
  postcss: {
    plugins: {
      "@tailwindcss/postcss": {},
    },
  },
});
