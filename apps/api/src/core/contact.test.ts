import type { ContactRequest } from '@portfolio/shared'
import { describe, expect, it } from 'vitest'

import { DOWNLOAD_TTL_MS, downloadCv, submitContactRequest } from './contact'
import { DomainError } from './errors'
import { createFakes } from '../testing/fakes'

const request: ContactRequest = {
  email: 'recruiter@company.com',
  company: 'ACME',
  locale: 'en',
  captcha_token: 'ok',
}
const input = { request, client_ip: '203.0.113.7', base_url: 'https://api.example.com' }

async function expectCode(promise: Promise<unknown>, code: string): Promise<void> {
  await expect(promise).rejects.toBeInstanceOf(DomainError)
  await expect(promise).rejects.toMatchObject({ code })
}

describe('submitContactRequest', () => {
  it('returns a signed download url that expires in 10 minutes', async () => {
    const fakes = createFakes()
    const result = await submitContactRequest(fakes.deps, input)

    expect(result.download_url).toMatch(/^https:\/\/api\.example\.com\/cv\/.+/)
    expect(Date.parse(result.expires_at)).toBe(fakes.clock.now() + DOWNLOAD_TTL_MS)
  })

  it('notifies the owner with the requester email and company', async () => {
    const fakes = createFakes()
    await submitContactRequest(fakes.deps, input)

    expect(fakes.emails).toHaveLength(1)
    expect(fakes.emails[0]?.text).toContain('recruiter@company.com')
    expect(fakes.emails[0]?.text).toContain('ACME')
  })

  it('rejects a failed captcha before any other side effect', async () => {
    const fakes = createFakes({ captcha_ok: false })
    await expectCode(submitContactRequest(fakes.deps, input), 'captcha_failed')
    expect(fakes.rate_keys).toEqual([])
    expect(fakes.emails).toEqual([])
  })

  it('rejects when the client exceeded the rate limit', async () => {
    const fakes = createFakes({ rate_limit_ok: false })
    await expectCode(submitContactRequest(fakes.deps, input), 'rate_limited')
    expect(fakes.rate_keys).toEqual(['contact:203.0.113.7'])
  })

  it('still succeeds when the notification fails, and logs without PII', async () => {
    const fakes = createFakes({ email_fails: true })
    const result = await submitContactRequest(fakes.deps, input)

    expect(result.download_url).toBeTruthy()
    expect(fakes.logs).toContainEqual(
      expect.objectContaining({ level: 'error', event: 'contact.notify_failed' }),
    )
    expect(JSON.stringify(fakes.logs)).not.toContain('recruiter@company.com')
  })
})

describe('downloadCv', () => {
  it('serves the CV for the token locale', async () => {
    const fakes = createFakes({ cv_locales: ['en', 'es'] })
    const token = await fakes.deps.signer.sign({ locale: 'en', exp: fakes.clock.now() + 1000 })
    const file = await downloadCv(fakes.deps, token)
    expect(file.size).toBe(2)
    expect(fakes.cv_requests).toEqual(['en'])
  })

  it('falls back to the Spanish CV', async () => {
    const fakes = createFakes({ cv_locales: ['es'] })
    const token = await fakes.deps.signer.sign({ locale: 'fr', exp: fakes.clock.now() + 1000 })
    await downloadCv(fakes.deps, token)
    expect(fakes.cv_requests).toEqual(['fr', 'es'])
  })

  it('rejects tampered tokens', async () => {
    const fakes = createFakes()
    await expectCode(downloadCv(fakes.deps, 'garbage'), 'invalid_token')
  })

  it('rejects expired tokens', async () => {
    const fakes = createFakes()
    const token = await fakes.deps.signer.sign({ locale: 'es', exp: fakes.clock.now() - 1 })
    await expectCode(downloadCv(fakes.deps, token), 'invalid_token')
  })

  it('reports a missing CV as not found', async () => {
    const fakes = createFakes({ cv_locales: [] })
    const token = await fakes.deps.signer.sign({ locale: 'es', exp: fakes.clock.now() + 1000 })
    await expectCode(downloadCv(fakes.deps, token), 'not_found')
  })
})
