import { describe, expect, it } from 'vitest'

import { createFakes } from '../../testing/fakes'
import { createApp } from './app'

const ORIGIN = 'https://luisventurae.github.io'
const valid_body = {
  email: 'recruiter@company.com',
  company: 'ACME',
  locale: 'es',
  captcha_token: 'ok',
}

function setup(options: Parameters<typeof createFakes>[0] = {}) {
  const fakes = createFakes(options)
  const app = createApp(() => ({
    allowed_origin: ORIGIN,
    contact: fakes.deps,
    logger: fakes.deps.logger,
  }))
  const post = (body: unknown, headers: Record<string, string> = {}) =>
    app.request('https://api.example.com/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: ORIGIN, ...headers },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    })
  return { app, fakes, post }
}

describe('POST /contact', () => {
  it('emails the CV link and only confirms the send', async () => {
    const { post, fakes } = setup()
    const response = await post(
      { ...valid_body, interests: ['nodejs'] },
      { 'cf-connecting-ip': '203.0.113.7' },
    )
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ status: 'sent' })
    expect(fakes.cv_emails[0]?.text).toMatch(/https:\/\/api\.example\.com\/cv\//)
    expect(response.headers.get('access-control-allow-origin')).toBe(ORIGIN)
  })

  it('maps a failed CV email to 502', async () => {
    const response = await setup({ cv_email_fails: true }).post(valid_body)
    expect(response.status).toBe(502)
    expect(await response.json()).toEqual({ error: { code: 'email_failed' } })
  })

  it.each([
    ['invalid json', '{not json'],
    ['invalid email', { ...valid_body, email: 'nope' }],
    ['unknown fields', { ...valid_body, admin: true }],
    ['unknown interests', { ...valid_body, interests: ['cobol'] }],
  ])('rejects %s with 400', async (_label, body) => {
    const response = await setup().post(body)
    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: { code: 'invalid_request' } })
  })

  it('maps captcha failures to 403 and rate limiting to 429', async () => {
    expect((await setup({ captcha_ok: false }).post(valid_body)).status).toBe(403)
    expect((await setup({ rate_limit_ok: false }).post(valid_body)).status).toBe(429)
    expect((await setup({ recipient_limit_ok: false }).post(valid_body)).status).toBe(429)
  })

  it('rejects bodies over 4 KB with 413', async () => {
    const response = await setup().post({ ...valid_body, company: 'x'.repeat(5000) })
    expect(response.status).toBe(413)
    expect(await response.json()).toEqual({ error: { code: 'payload_too_large' } })
  })

  it('does not allow foreign origins', async () => {
    const response = await setup().post(valid_body, { Origin: 'https://evil.example' })
    expect(response.headers.get('access-control-allow-origin')).toBeNull()
  })

  it('adds security headers', async () => {
    const response = await setup().post(valid_body)
    expect(response.headers.get('x-content-type-options')).toBe('nosniff')
    expect(response.headers.get('referrer-policy')).toBe('strict-origin-when-cross-origin')
    expect(response.headers.get('content-security-policy')).toContain("default-src 'none'")
  })
})

describe('GET /cv/:token', () => {
  it('serves the PDF for a valid token', async () => {
    const { app, fakes } = setup()
    const token = await fakes.deps.signer.sign({ locale: 'es', exp: fakes.clock.now() + 1000 })
    const response = await app.request(`/cv/${token}`)
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toBe('application/pdf')
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(await response.text()).toBe('cv')
  })

  it('rejects invalid tokens with 403', async () => {
    const response = await setup().app.request('/cv/forged')
    expect(response.status).toBe(403)
  })
})

describe('routing', () => {
  it('responds 404 to /rag/*, a route that no longer exists', async () => {
    const response = await setup().app.request('/rag/ask', { method: 'POST' })
    expect(response.status).toBe(404)
  })

  it('reports health', async () => {
    expect(await (await setup().app.request('/health')).json()).toEqual({ ok: true })
  })

  it('hides unexpected errors behind a generic 500', async () => {
    const { fakes } = setup()
    fakes.deps.signer.verify = async () => {
      throw new TypeError('secret detail')
    }
    const app = createApp(() => ({
      allowed_origin: ORIGIN,
      contact: fakes.deps,
      logger: fakes.deps.logger,
    }))
    const response = await app.request('/cv/x')
    expect(response.status).toBe(500)
    expect(await response.text()).not.toContain('secret detail')
  })
})
