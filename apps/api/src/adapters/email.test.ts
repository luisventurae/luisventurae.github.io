import { describe, expect, it, vi } from 'vitest'

import { createMailpitEmailSender, createResendEmailSender } from './email'

const addresses = { from: 'portfolio@example.dev', to: 'owner@example.test' }
const message = { subject: 'CV solicitado por ACME', text: 'Hola' }

function okFetcher(): typeof fetch {
  return vi.fn(async () => new Response('{}')) as unknown as typeof fetch
}

function lastCall(fetcher: typeof fetch): { url: unknown; init: RequestInit | undefined } {
  const [url, init] = vi.mocked(fetcher).mock.calls.at(-1) ?? []
  return { url, init }
}

describe('createResendEmailSender', () => {
  const config = { api_key: 're_test_key', ...addresses }

  it('sends the owner notification to the configured address', async () => {
    const fetcher = okFetcher()
    await createResendEmailSender(config, fetcher).notifyOwner(message)
    const { url, init } = lastCall(fetcher)
    expect(url).toBe('https://api.resend.com/emails')
    expect(new Headers(init?.headers).get('Authorization')).toBe('Bearer re_test_key')
    expect(JSON.parse(String(init?.body))).toEqual({
      from: 'Luis Ventura E <portfolio@example.dev>',
      to: ['owner@example.test'],
      subject: message.subject,
      text: message.text,
    })
  })

  it('sends the CV link to the requester', async () => {
    const fetcher = okFetcher()
    await createResendEmailSender(config, fetcher).sendCvLink('recruiter@acme.com', message)
    expect(JSON.parse(String(lastCall(fetcher).init?.body))).toMatchObject({
      to: ['recruiter@acme.com'],
    })
  })

  it('throws on a non-2xx answer without leaking the response body', async () => {
    const fetcher = vi.fn(
      async () => new Response('{"message":"secret detail"}', { status: 422 }),
    ) as unknown as typeof fetch
    const sending = createResendEmailSender(config, fetcher).sendCvLink('a@b.co', message)
    await expect(sending).rejects.toThrow('Resend responded 422')
    await expect(sending).rejects.not.toThrow(/secret detail/)
  })
})

describe('createMailpitEmailSender', () => {
  it('posts owner notifications to the Mailpit send API', async () => {
    const fetcher = okFetcher()
    await createMailpitEmailSender('http://mailpit:8025/', addresses, fetcher).notifyOwner(message)
    const { url, init } = lastCall(fetcher)
    expect(url).toBe('http://mailpit:8025/api/v1/send')
    expect(JSON.parse(String(init?.body))).toMatchObject({
      Subject: message.subject,
      To: [{ Email: addresses.to }],
    })
  })

  it('delivers CV links to any recipient locally', async () => {
    const fetcher = okFetcher()
    await createMailpitEmailSender('http://m', addresses, fetcher).sendCvLink('x@y.dev', message)
    expect(JSON.parse(String(lastCall(fetcher).init?.body))).toMatchObject({
      To: [{ Email: 'x@y.dev' }],
    })
  })

  it('throws when Mailpit fails', async () => {
    const fetcher = vi.fn(async () => new Response('', { status: 500 })) as unknown as typeof fetch
    await expect(
      createMailpitEmailSender('http://m', addresses, fetcher).notifyOwner(message),
    ).rejects.toThrow()
  })
})
