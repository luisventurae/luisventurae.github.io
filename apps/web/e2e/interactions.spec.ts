import { expect, test } from './fixtures'

test.describe('projects and experience', () => {
  test('a job opens its project and the project leads back to the job', async ({ page }) => {
    await page.goto('/')
    const securitec = page.locator('#experience-securitec')
    await securitec.scrollIntoViewIfNeeded()
    const link = securitec.getByRole('link', { name: /Ticker/ })
    await link.click()
    const dialog = page.getByRole('dialog')
    await expect(dialog.getByRole('heading', { level: 2 })).toHaveText('Ticker')
    // The page stays on the job behind the drawer.
    await expect(securitec).toBeInViewport()

    await dialog.getByRole('link', { name: 'En Securitec' }).click()
    await expect(dialog).toBeHidden()
    await expect(page).toHaveURL(/#experience-securitec$/)
    await expect(securitec).toBeInViewport()
  })

  test('closing a project opened from a job returns focus to its link', async ({ page }) => {
    await page.goto('/')
    const link = page.locator('#experience-securitec').getByRole('link', { name: /Ticker/ })
    await link.scrollIntoViewIfNeeded()
    await link.click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toBeHidden()
    await expect(link).toBeFocused()
    await link.click()
    await expect(page.getByRole('dialog').getByRole('heading', { level: 2 })).toHaveText('Ticker')
  })

  test('a project URL opens its drawer', async ({ page }) => {
    await page.goto('/#project-pwc-store')
    await expect(page.getByRole('dialog').getByRole('heading', { level: 2 })).toHaveText(
      'Tienda en línea',
    )
  })

  test('cards say where each project was built', async ({ page }) => {
    await page.goto('/')
    await page.locator('#projects').scrollIntoViewIfNeeded()
    await expect(page.getByRole('button', { name: /Ver detalle: Ticker/ })).toContainText(
      'En Securitec',
    )
    await expect(page.getByRole('button', { name: /Ver detalle: Este portafolio/ })).toContainText(
      'Proyecto personal',
    )
  })
})

test.describe('about magnifier', () => {
  test('letters under the pointer grow and settle back on leave', async ({ page }) => {
    await page.goto('/')
    const about = page.locator('.about-body[data-lens]')
    await about.scrollIntoViewIfNeeded()
    const paragraph = about.locator('p').nth(1)
    // The block can be taller than the viewport: bring the paragraph itself into view.
    await paragraph.scrollIntoViewIfNeeded()
    const box = await paragraph.boundingBox()
    if (!box) throw new Error('about paragraph not visible')
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 4 })
    await expect(about.locator('.lens-char[style*="scale"]').first()).toBeVisible()
    await page.mouse.move(2, 2)
    await expect(about.locator('.lens-char[style*="scale"]')).toHaveCount(0)
    // Screen readers get the intact text, never the letter-by-letter copy.
    await expect(about).toHaveAttribute('aria-hidden', 'true')
    await expect(page.locator('#about .sr-only h3').first()).toHaveText('Qué hago')
  })

  test('touch screens keep the plain text @mobile', async ({ page }, info) => {
    test.skip(info.project.name !== 'mobile', 'touch only')
    await page.goto('/')
    await page.locator('#about').scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)
    await expect(page.locator('.lens-char')).toHaveCount(0)
  })
})

test.describe('stack and projects', () => {
  test('selecting a technology highlights the projects that use it', async ({ page }) => {
    await page.goto('/')
    await page.locator('#stack').scrollIntoViewIfNeeded()
    await page.getByRole('button', { name: /^Deluge/ }).click()
    await expect(page.getByText(/Usada en 1 proyecto/)).toBeVisible()
    await page.locator('#projects').scrollIntoViewIfNeeded()
    await expect(page.locator('[data-state="match"]')).toHaveCount(1)
    await expect(page.locator('[data-state="dimmed"]')).toHaveCount(11)
  })

  test('the drawer navigates with keys and returns focus on close', async ({ page }) => {
    await page.goto('/')
    await page.locator('#projects').scrollIntoViewIfNeeded()
    const card = page.getByRole('button', { name: /Ver detalle: Ticker/ })
    await card.click()
    const dialog = page.getByRole('dialog')
    await expect(dialog.getByRole('heading', { level: 2 })).toHaveText('Ticker')
    await page.keyboard.press('ArrowRight')
    await expect(dialog.getByRole('heading', { level: 2 })).toHaveText('Este portafolio')
    await expect(dialog).toContainText('Mi rol: Diseño, frontend y backend')
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(card).toBeFocused()
  })

  test('a quick swipe changes project @mobile', async ({ page }) => {
    await page.goto('/')
    await page.locator('#projects').scrollIntoViewIfNeeded()
    await page.getByRole('button', { name: /Ver detalle: Ticker/ }).click()
    const article = page.getByRole('dialog').locator('article')
    await expect(page.getByRole('dialog').getByRole('heading', { level: 2 })).toHaveText('Ticker')
    // Let the drawer finish its enter animation so the gesture starts on a still target.
    await page.waitForTimeout(600)
    // Swipe on the text: a swipe on the screenshots changes the screenshot instead.
    await article.getByRole('heading', { level: 2 }).scrollIntoViewIfNeeded()
    const box = await article.boundingBox()
    const heading = await article.getByRole('heading', { level: 2 }).boundingBox()
    if (!box || !heading) throw new Error('drawer content not visible')
    const y = heading.y + heading.height / 2
    await page.mouse.move(box.x + box.width * 0.8, y)
    await page.mouse.down()
    await page.mouse.move(box.x + box.width * 0.2, y, { steps: 4 })
    await page.mouse.up()
    await expect(page.getByRole('dialog').getByRole('heading', { level: 2 })).toHaveText(
      'Este portafolio',
    )
  })

  test('the screenshots slide without leaving the project', async ({ page }) => {
    await page.goto('/')
    await page.locator('#projects').scrollIntoViewIfNeeded()
    await page.getByRole('button', { name: /Ver detalle: Ticker/ }).click()
    const dialog = page.getByRole('dialog')
    const first_dot = dialog.getByRole('button', { name: /Ver captura 1 de/ })
    await expect(first_dot).toHaveAttribute('aria-current', 'true')
    await first_dot.focus()
    await page.keyboard.press('ArrowRight')
    await expect(dialog.getByRole('button', { name: /Ver captura 2 de/ })).toHaveAttribute(
      'aria-current',
      'true',
    )
    await expect(dialog.getByRole('heading', { level: 2 })).toHaveText('Ticker')
  })

  test('a project links safely to the live site', async ({ page }) => {
    await page.goto('/#project-pwc-store')
    const link = page.getByRole('dialog').getByRole('link', { name: /poolworkconf\.com/ })
    await expect(link).toHaveAttribute('href', 'https://www.poolworkconf.com/')
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer external')
    await expect(link).toHaveAttribute('referrerpolicy', 'no-referrer')
  })
})

test.describe('terminal', () => {
  test('backtick focuses the prompt and commands run', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.keyboard.press('`')
    const input = page.getByLabel('Comando de la terminal')
    await expect(input).toBeFocused()
    await input.fill('cat ticker')
    await input.press('Enter')
    await expect(page.getByRole('log')).toContainText('Securitec')
  })

  test('ask is an unknown command', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const input = page.getByLabel('Comando de la terminal')
    await input.fill('ask ¿usas redis?')
    await input.press('Enter')
    await expect(page.getByRole('log')).toContainText('No conozco ese comando')
  })
})

test.describe('CV request', () => {
  test('submits the form and asks to check the inbox', async ({ page }) => {
    let request_body: unknown = null
    await page.route('http://api.test/contact', async (route) => {
      request_body = route.request().postDataJSON()
      await route.fulfill({ json: { status: 'sent' } })
    })
    await page.goto('/')
    await page.locator('#contact').scrollIntoViewIfNeeded()
    await page.getByRole('button', { name: /Saltar al formulario/ }).click()
    await expect(page.getByLabel('Email')).toBeFocused()
    await expect(page.getByText('captcha ok')).toBeVisible()
    await page.getByLabel('Email').fill('recruiter@company.com')
    await page.getByLabel('Empresa').fill('ACME')
    await page.getByRole('button', { name: 'Enviarme el CV' }).click()
    await expect(page.locator('#contact').getByRole('status')).toContainText(
      'Te lo envié a recruiter@company.com',
    )
    expect(request_body).toEqual({
      email: 'recruiter@company.com',
      company: 'ACME',
      locale: 'es',
      captcha_token: 'e2e-token',
    })
  })

  test('the vacancy match scores honestly and sends the interests', async ({ page }) => {
    let request_body: unknown = null
    await page.route('http://api.test/contact', async (route) => {
      request_body = route.request().postDataJSON()
      await route.fulfill({ json: { status: 'sent' } })
    })
    await page.goto('/')
    const section = page.locator('#contact')
    await section.scrollIntoViewIfNeeded()
    await section.getByRole('button', { name: 'Node.js', exact: true }).click()
    await section.getByRole('button', { name: 'Java', exact: true }).click()
    await expect(section.getByText('75%')).toBeVisible()
    await expect(section.getByText(/mi fuerte es Node\.js/)).toBeVisible()
    await section.getByRole('button', { name: /Recibe el CV completo/ }).click()
    await expect(page.getByLabel('Email')).toBeFocused()
    await expect(page.getByText('captcha ok')).toBeVisible()
    await page.getByLabel('Email').fill('recruiter@company.com')
    await page.getByLabel('Empresa').fill('ACME')
    await page.getByRole('button', { name: 'Enviarme el CV' }).click()
    await expect(section.getByRole('status')).toContainText('recruiter@company.com')
    expect(request_body).toMatchObject({ interests: ['nodejs', 'java'] })
  })

  test('shows API errors', async ({ page }) => {
    await page.route('http://api.test/contact', (route) =>
      route.fulfill({ status: 429, json: { error: { code: 'rate_limited' } } }),
    )
    await page.goto('/')
    await page.locator('#contact').scrollIntoViewIfNeeded()
    await page.getByRole('button', { name: /Saltar al formulario/ }).click()
    await expect(page.getByLabel('Email')).toBeFocused()
    await expect(page.getByText('captcha ok')).toBeVisible()
    await page.getByLabel('Email').fill('recruiter@company.com')
    await page.getByLabel('Empresa').fill('ACME')
    await page.getByRole('button', { name: 'Enviarme el CV' }).click()
    await expect(page.getByRole('alert').first()).toContainText('Demasiados intentos')
  })
})
