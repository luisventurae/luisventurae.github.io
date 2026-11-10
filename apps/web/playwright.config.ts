import { defineConfig, devices } from '@playwright/test'

const PORT = 4322

/** E2E runs against the production build; the API and Turnstile are mocked per test. */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] }, grep: /@mobile/ },
  ],
  webServer: {
    command: `npm run build && node scripts/serve-dist.mjs`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      PUBLIC_API_URL: 'http://api.test',
      PUBLIC_TURNSTILE_SITE_KEY: '1x00000000000000000000AA',
      PORT: String(PORT),
    },
  },
})
