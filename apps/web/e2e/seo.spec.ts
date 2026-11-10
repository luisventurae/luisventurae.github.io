import { expect, test } from './fixtures'

type JsonLdNode = { '@type': string; itemListElement?: { item: { name: string } }[] }

test.describe('SEO and metadata', () => {
  for (const [path, lang, og_locale] of [
    ['/', 'es', 'es_ES'],
    ['/en/', 'en', 'en_US'],
    ['/fr/', 'fr', 'fr_FR'],
  ] as const) {
    test(`${path} exposes localized metadata`, async ({ page }) => {
      await page.goto(path)
      await expect(page.locator('html')).toHaveAttribute('lang', lang)
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://luisventurae.github.io${path}`,
      )
      for (const hreflang of ['es', 'en', 'fr', 'x-default']) {
        await expect(page.locator(`link[rel="alternate"][hreflang="${hreflang}"]`)).toHaveCount(1)
      }
      await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', og_locale)
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        'content',
        `https://luisventurae.github.io/og/${lang}.png`,
      )
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
        'content',
        'summary_large_image',
      )
      await expect(page.locator('meta[http-equiv="content-security-policy"]')).toHaveCount(1)
    })
  }

  test('JSON-LD describes a profile page whose projects are visible', async ({ page }) => {
    await page.goto('/')
    const raw = await page.locator('script[type="application/ld+json"]').textContent()
    const graph = (JSON.parse(raw ?? '{}') as { '@graph': JsonLdNode[] })['@graph']
    expect(graph.map((node) => node['@type'])).toEqual(
      expect.arrayContaining(['ProfilePage', 'Person', 'WebSite', 'ItemList']),
    )
    const names =
      graph
        .find((node) => node['@type'] === 'ItemList')
        ?.itemListElement?.map((entry) => entry.item.name) ?? []
    expect(names.length).toBeGreaterThan(0)
    for (const name of names) {
      await expect(page.locator('#projects h3', { hasText: name }).first()).toBeVisible()
    }
  })

  test('publishes robots.txt, the sitemap and share images', async ({ request }) => {
    expect((await request.get('/robots.txt')).ok()).toBe(true)
    expect(await (await request.get('/sitemap-index.xml')).text()).toContain('sitemap')
    const image = await request.get('/og/es.png')
    expect(image.headers()['content-type']).toContain('image/png')
  })
})
