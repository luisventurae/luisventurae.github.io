import { describe, expect, it } from 'vitest'

import { ApiErrorSchema, ContactRequestSchema, ContactResponseSchema } from './contact'

const valid_request = {
  email: 'recruiter@company.com',
  company: 'ACME',
  locale: 'en',
  captcha_token: 'token-123',
}

describe('ContactRequestSchema', () => {
  it('accepts a valid request', () => {
    expect(ContactRequestSchema.parse(valid_request)).toEqual(valid_request)
  })

  it('trims the company name', () => {
    const parsed = ContactRequestSchema.parse({ ...valid_request, company: '  ACME  ' })
    expect(parsed.company).toBe('ACME')
  })

  it.each([
    ['invalid email', { email: 'not-an-email' }],
    ['empty company', { company: '   ' }],
    ['unsupported locale', { locale: 'de' }],
    ['missing captcha token', { captcha_token: '' }],
    ['too long company', { company: 'x'.repeat(121) }],
  ])('rejects %s', (_label, override) => {
    expect(ContactRequestSchema.safeParse({ ...valid_request, ...override }).success).toBe(false)
  })

  it('rejects unknown fields', () => {
    expect(ContactRequestSchema.safeParse({ ...valid_request, admin: true }).success).toBe(false)
  })
})

describe('ContactResponseSchema', () => {
  it('requires an absolute download url and an ISO expiry', () => {
    const response = {
      download_url: 'https://api.example.com/cv/abc',
      expires_at: '2026-11-10T10:00:00.000Z',
    }
    expect(ContactResponseSchema.parse(response)).toEqual(response)
    expect(ContactResponseSchema.safeParse({ ...response, download_url: '/cv/abc' }).success).toBe(
      false,
    )
  })
})

describe('ApiErrorSchema', () => {
  it('only allows known error codes', () => {
    expect(ApiErrorSchema.safeParse({ error: { code: 'rate_limited' } }).success).toBe(true)
    expect(ApiErrorSchema.safeParse({ error: { code: 'boom' } }).success).toBe(false)
  })
})
