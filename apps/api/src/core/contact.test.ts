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
  it('emails the requester a signed link valid for 7 days and only confirms the send', async () => {
    const fakes = createFakes()
    const result = await submitContactRequest(fakes.deps, input)

    expect(result).toEqual({ status: 'sent' })
    expect(DOWNLOAD_TTL_MS).toBe(7 * 24 * 60 * 60 * 1000)
    expect(fakes.cv_emails).toHaveLength(1)
    const sent = fakes.cv_emails[0]
    expect(sent?.to).toBe('recruiter@company.com')
    const url = /https:\/\/api\.example\.com\/cv\/(\S+)/.exec(sent?.text ?? '')
    expect(url).not.toBeNull()
    const payload = fakes.tokens.get(decodeURIComponent(url?.[1] ?? ''))
    expect(payload).toEqual({ locale: 'en', exp: fakes.clock.now() + DOWNLOAD_TTL_MS })
  })

  it('writes the CV email in the request locale', async () => {
    const fakes = createFakes()
    await submitContactRequest(fakes.deps, { ...input, request: { ...request, locale: 'fr' } })
    expect(fakes.cv_emails[0]?.subject).toContain('CV')
    expect(fakes.cv_emails[0]?.text).toContain('Bonjour')
  })

  it('never puts requester free text in the CV email', async () => {
    const fakes = createFakes()
    const spam = 'Buy cheap pills at spam.example'
    await submitContactRequest(fakes.deps, { ...input, request: { ...request, company: spam } })
    expect(JSON.stringify(fakes.cv_emails)).not.toContain(spam)
  })

  it('notifies the owner with the requester email, company and interests', async () => {
    const fakes = createFakes()
    await submitContactRequest(fakes.deps, {
      ...input,
      request: { ...request, interests: ['nodejs', 'aws'] },
    })

    expect(fakes.emails).toHaveLength(1)
    expect(fakes.emails[0]?.text).toContain('recruiter@company.com')
    expect(fakes.emails[0]?.text).toContain('ACME')
    expect(fakes.emails[0]?.text).toContain('nodejs, aws')
  })

  it('rejects a failed captcha before any other side effect', async () => {
    const fakes = createFakes({ captcha_ok: false })
    await expectCode(submitContactRequest(fakes.deps, input), 'captcha_failed')
    expect(fakes.rate_keys).toEqual([])
    expect(fakes.recipient_keys).toEqual([])
    expect(fakes.emails).toEqual([])
    expect(fakes.cv_emails).toEqual([])
  })

  it('rejects when the client exceeded the rate limit', async () => {
    const fakes = createFakes({ rate_limit_ok: false })
    await expectCode(submitContactRequest(fakes.deps, input), 'rate_limited')
    expect(fakes.rate_keys).toEqual(['contact:203.0.113.7'])
    expect(fakes.cv_emails).toEqual([])
  })

  it('limits emails per recipient with a hashed, case-insensitive key', async () => {
    const fakes = createFakes({ recipient_limit_ok: false })
    await expectCode(
      submitContactRequest(fakes.deps, {
        ...input,
        request: { ...request, email: 'Recruiter@Company.com' },
      }),
      'rate_limited',
    )
    expect(fakes.cv_emails).toEqual([])
    const key = fakes.recipient_keys[0] ?? ''
    expect(key).toMatch(/^contact:to:[0-9a-f]{64}$/)
    expect(key).not.toContain('recruiter')

    const other = createFakes()
    await submitContactRequest(other.deps, input)
    expect(other.recipient_keys).toEqual([key])
  })

  it('fails with email_failed when the CV email cannot be sent', async () => {
    const fakes = createFakes({ cv_email_fails: true })
    await expectCode(submitContactRequest(fakes.deps, input), 'email_failed')
    expect(fakes.emails).toEqual([])
    expect(fakes.logs).toContainEqual(
      expect.objectContaining({ level: 'error', event: 'contact.cv_email_failed' }),
    )
  })

  it('still succeeds when the owner notification fails, and logs without PII', async () => {
    const fakes = createFakes({ owner_email_fails: true })
    const result = await submitContactRequest(fakes.deps, input)

    expect(result).toEqual({ status: 'sent' })
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
