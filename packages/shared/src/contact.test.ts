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

  it('accepts known vacancy requirements as interests', () => {
    const parsed = ContactRequestSchema.parse({ ...valid_request, interests: ['nodejs', 'aws'] })
    expect(parsed.interests).toEqual(['nodejs', 'aws'])
  })

  it.each([
    ['unknown interest', ['cobol']],
    ['duplicated interests', ['nodejs', 'nodejs']],
    ['more than 12 interests', Array.from({ length: 13 }, () => 'nodejs')],
  ])('rejects %s', (_label, interests) => {
    expect(ContactRequestSchema.safeParse({ ...valid_request, interests }).success).toBe(false)
  })

  it('rejects unknown fields', () => {
    expect(ContactRequestSchema.safeParse({ ...valid_request, admin: true }).success).toBe(false)
  })
})

describe('ContactResponseSchema', () => {
  it('only confirms that the email was sent, never the download url', () => {
    expect(ContactResponseSchema.parse({ status: 'sent' })).toEqual({ status: 'sent' })
    expect(ContactResponseSchema.safeParse({ download_url: 'https://x/cv/abc' }).success).toBe(
      false,
    )
  })
})

describe('ApiErrorSchema', () => {
  it('only allows known error codes', () => {
    expect(ApiErrorSchema.safeParse({ error: { code: 'rate_limited' } }).success).toBe(true)
    expect(ApiErrorSchema.safeParse({ error: { code: 'email_failed' } }).success).toBe(true)
    expect(ApiErrorSchema.safeParse({ error: { code: 'boom' } }).success).toBe(false)
  })
})
