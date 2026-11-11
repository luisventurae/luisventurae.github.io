import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

import { parsePublicEnv } from './src/lib/public-env'

const SITE_URL = 'https://luisventurae.github.io'
const TURNSTILE_ORIGIN = 'https://challenges.cloudflare.com'
const api_origin = new URL(parsePublicEnv(process.env).PUBLIC_API_URL).origin

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'always',
  build: {
    assets: 'cloud',
    // External stylesheets keep `style-src` free of hashes (see docs/security.md › OWASP).
    inlineStylesheets: 'never',
  },
  i18n: {
    locales: ['es', 'en', 'fr'],
    defaultLocale: 'es',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es-ES', en: 'en-US', fr: 'fr-FR' },
      },
    }),
  ],
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        `connect-src 'self' ${api_origin} ${TURNSTILE_ORIGIN}`,
        `frame-src ${TURNSTILE_ORIGIN}`,
        "base-uri 'self'",
        "form-action 'self'",
        "object-src 'none'",
      ],
      scriptDirective: { resources: ["'self'", TURNSTILE_ORIGIN] },
      // Sonner and Vaul inject <style> at runtime and React renders style attributes.
      styleDirective: { resources: ["'self'", "'unsafe-inline'"] },
    },
  },
  markdown: { syntaxHighlight: false },
  vite: {
    plugins: [tailwindcss()],
    // Never inline fonts as data: URIs; the CSP only allows fonts from 'self' (font-src).
    build: { assetsInlineLimit: (file) => (file.endsWith('.woff2') ? false : undefined) },
  },
})
