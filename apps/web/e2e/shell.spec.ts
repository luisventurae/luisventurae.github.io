import AxeBuilder from '@axe-core/playwright'

import { expect, test } from './fixtures'

test.describe('site shell', () => {
  test('switching language keeps the current section', async ({ page }) => {
    await page.goto('/#projects')
    await page.getByRole('group', { name: 'Idioma' }).getByRole('link', { name: 'en' }).click()
    await expect(page).toHaveURL(/\/en\/#projects$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  })

  test('theme toggle persists and applies before first paint', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Cambiar a tema oscuro' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    let theme_at_first_paint: string | null = null
    page.on('domcontentloaded', async () => {
      theme_at_first_paint = await page.locator('html').getAttribute('data-theme')
    })
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    expect(theme_at_first_paint).toBe('dark')
  })

  test('has a skip link to the main content', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    const skip = page.getByRole('link', { name: 'Saltar al contenido' })
    await expect(skip).toBeFocused()
    await skip.press('Enter')
    await expect(page.locator('#main')).toBeFocused()
  })

  for (const theme of ['light', 'dark'] as const) {
    test(`has no serious accessibility violations (${theme}) @mobile`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
      const serious = results.violations.filter((violation) =>
        ['serious', 'critical'].includes(violation.impact ?? ''),
      )
      expect(serious.map((violation) => `${violation.id}: ${violation.nodes.length}`)).toEqual([])
    })
  }

  test('reduced motion keeps a single role in the hero', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await expect(page.getByText('Full Stack Web Engineer', { exact: true }).first()).toBeVisible()
    await page.waitForTimeout(3000)
    await expect(page.getByText('Diseño en movimiento')).toHaveCount(0)
  })
})
