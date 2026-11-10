import { test as base, type Page } from '@playwright/test'

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

export const test = base.extend<{ page: Page }>({
  page: async ({ page }, use) => {
    await stubTurnstile(page)
    await use(page)
  },
})

export { expect } from '@playwright/test'
