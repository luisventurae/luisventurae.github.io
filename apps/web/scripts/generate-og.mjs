// Generates the 1200×630 Open Graph images (public/og/<locale>.png) from an HTML
// template that uses the site's fonts and color tokens. Run after changing copy:
//   npm run og -w apps/web
import { readFileSync, mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

import { chromium } from '@playwright/test'

const require = createRequire(import.meta.url)
const OUTPUT_DIR = join(import.meta.dirname, '../public/og')

const COPY = {
  es: {
    role: 'Backend Engineer · Node.js',
    tagline: 'Backends en Node.js que aguantan tráfico real.',
  },
  en: { role: 'Backend Engineer · Node.js', tagline: 'Node.js backends that handle real traffic.' },
  fr: {
    role: 'Backend Engineer · Node.js',
    tagline: 'Des backends Node.js qui tiennent un vrai trafic.',
  },
}

function fontDataUrl(package_name, file) {
  const dir = dirname(require.resolve(`${package_name}/package.json`))
  const data = readFileSync(join(dir, 'files', file)).toString('base64')
  return `data:font/woff2;base64,${data}`
}

const display_font = fontDataUrl(
  '@fontsource-variable/bricolage-grotesque',
  'bricolage-grotesque-latin-standard-normal.woff2',
)
const mono_font = fontDataUrl(
  '@fontsource-variable/jetbrains-mono',
  'jetbrains-mono-latin-wght-normal.woff2',
)

function template({ role, tagline }) {
  return `<!doctype html><html><head><style>
  @font-face { font-family: Display; src: url(${display_font}) format('woff2'); font-weight: 200 800; font-stretch: 75% 100%; }
  @font-face { font-family: Mono; src: url(${mono_font}) format('woff2'); font-weight: 100 800; }
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; background: #f7f3ec; color: #16130f; font-family: Display;
         padding: 72px 80px; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; position: relative; }
  .mono { font-family: Mono; font-size: 26px; color: #5e5850; }
  h1 { font-size: 150px; font-weight: 800; letter-spacing: -0.045em; line-height: 0.9; }
  h1 span { color: #ff5a36; }
  .tagline { font-size: 44px; font-weight: 500; letter-spacing: -0.02em; color: #5e5850; margin-top: 18px; }
  .row { display: flex; gap: 14px; }
  .chip { font-family: Mono; font-size: 24px; font-weight: 600; padding: 10px 20px; border-radius: 999px; box-shadow: 0 8px 24px -12px rgb(22 19 15 / 0.35); }
  .lime { background: #c8f04b; transform: rotate(-4deg); } .sky { background: #4cc3ff; transform: rotate(3deg); } .violet { background: #6a4cf0; color: #f7f3ec; transform: rotate(-2deg); }
  .footer { display: flex; justify-content: space-between; align-items: flex-end; }
</style></head><body>
  <div class="mono">luisventurae.github.io</div>
  <div>
    <h1>Luis Ventura E<span>.</span></h1>
    <p class="tagline">${tagline}</p>
  </div>
  <div class="footer">
    <div class="mono">${role}</div>
    <div class="row"><span class="chip lime">Node.js</span><span class="chip sky">AWS</span><span class="chip violet">TypeScript</span></div>
  </div>
</body></html>`
}

mkdirSync(OUTPUT_DIR, { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
for (const [locale, copy] of Object.entries(COPY)) {
  await page.setContent(template(copy), { waitUntil: 'load' })
  // Runs in the browser page.
  await page.evaluate(() => globalThis.document.fonts.ready)
  await page.screenshot({ path: join(OUTPUT_DIR, `${locale}.png`) })
  console.log(`og/${locale}.png`)
}
await browser.close()
