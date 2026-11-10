import AxeBuilder from '@axe-core/playwright'

import { careerYears } from '../src/lib/experience'
import { expect, test } from './fixtures'

test.describe('hero without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('shows role, years, main stack and availability', async ({ page }) => {
    await page.goto('/')
    const hero = page.locator('#top')
    await expect(hero.getByText('Backend Engineer · Node.js', { exact: true })).toBeVisible()
    await expect(
      hero.getByText(`${careerYears()} años de experiencia · Node.js · TypeScript · AWS`),
    ).toBeVisible()
    await expect(hero.getByText('Disponible · remoto o híbrido · Perú')).toBeVisible()
  })
})

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
    await expect(page.getByText('Microservicios en AWS', { exact: true }).first()).toBeVisible()
    await page.waitForTimeout(3000)
    await expect(
      page.locator('#top').getByText('Arquitectura hexagonal', { exact: true }),
    ).toHaveCount(0)
  })
})

test.describe('home sections', () => {
  const ORDER = ['about', 'experience', 'projects', 'stack', 'contact', 'terminal']

  for (const path of ['/', '/fr/']) {
    test(`${path} puts proof before tools and the nav follows the page`, async ({ page }) => {
      await page.goto(path)
      const section_ids = await page
        .locator('main section[id]:not(#top)')
        .evaluateAll((sections) => sections.map((section) => section.id))
      expect(section_ids).toEqual(ORDER)
      const nav_targets = await page
        .getByRole('navigation')
        .first()
        .locator('ul a')
        .evaluateAll((links) => links.map((link) => link.getAttribute('href')?.replace('#', '')))
      expect(nav_targets).toEqual(ORDER)
    })
  }

  test('experience starts with the current job and labels engagement types', async ({ page }) => {
    await page.goto('/')
    const entries = page.locator('#experience ol > li')
    await expect(entries.first()).toContainText('Prestamype')
    await expect(entries.first()).toContainText('jun 2024 – actualidad')
    await expect(entries.first()).toContainText('Tiempo completo')
    await expect(entries.filter({ hasText: 'Instituto Cepeban' })).toContainText('Freelance')
  })

  test('about shows the profile and the role sought without the terminal', async ({ page }) => {
    await page.goto('/en/')
    await expect(page.locator('#about')).toContainText('A backend developer role with Node.js')
  })
})
