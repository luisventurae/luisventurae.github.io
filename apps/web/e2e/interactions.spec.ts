import { expect, test } from './fixtures'

test.describe('stack and projects', () => {
  test('selecting a technology highlights the projects that use it', async ({ page }) => {
    await page.goto('/')
    await page.locator('#stack').scrollIntoViewIfNeeded()
    await page.getByRole('button', { name: /^Electron/ }).click()
    await expect(page.getByText(/Usada en 1 proyecto/)).toBeVisible()
    await page.locator('#projects').scrollIntoViewIfNeeded()
    await expect(page.locator('[data-state="match"]')).toHaveCount(1)
    await expect(page.locator('[data-state="dimmed"]')).toHaveCount(7)
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
    const box = await article.boundingBox()
    if (!box) throw new Error('drawer content not visible')
    const y = box.y + 120
    await page.mouse.move(box.x + box.width * 0.8, y)
    await page.mouse.down()
    await page.mouse.move(box.x + box.width * 0.2, y, { steps: 4 })
    await page.mouse.up()
    await expect(page.getByRole('dialog').getByRole('heading', { level: 2 })).toHaveText(
      'Este portafolio',
    )
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
