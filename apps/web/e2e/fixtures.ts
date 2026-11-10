import { test as base, type Page } from '@playwright/test'

const API_URL = 'http://api.test'

/** Replaces Cloudflare Turnstile with a stub that immediately yields a token. */
async function stubTurnstile(page: Page): Promise<void> {
  await page.route('https://challenges.cloudflare.com/**', (route) =>
    route.fulfill({
      contentType: 'application/javascript',
      body: `window.turnstile = {
        render: (el, options) => { el.textContent = 'captcha ok'; setTimeout(() => options.callback('e2e-token')); return 'w1' },
        reset: () => {}, remove: () => {},
      }`,
    }),
  )
}

/** Without a local index the API answers 404 to /rag/* (production behaviour). */
async function stubApi(page: Page): Promise<void> {
  await page.route(`${API_URL}/rag/ask`, (route) =>
    route.fulfill({ status: 404, json: { error: { code: 'not_found' } } }),
  )
}

export const test = base.extend<{ page: Page }>({
  page: async ({ page }, use) => {
    await stubTurnstile(page)
    await stubApi(page)
    await use(page)
  },
})

export { expect } from '@playwright/test'
