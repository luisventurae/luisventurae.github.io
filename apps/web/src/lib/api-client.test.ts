import { describe, expect, it, vi } from 'vitest'

import { requestCv } from './api-client'

const body = { email: 'a@b.co', company: 'ACME', locale: 'es' as const, captcha_token: 't' }

function fetcher(response: Response | Error): typeof fetch {
  return vi.fn(async () => {
    if (response instanceof Error) throw response
    return response
  }) as unknown as typeof fetch
}

describe('requestCv', () => {
  it('returns the download url on success', async () => {
    const ok = Response.json({
      download_url: 'https://api.example.com/cv/abc',
      expires_at: '2026-11-10T10:00:00.000Z',
    })
    const result = await requestCv('https://api.example.com/', body, fetcher(ok))
    expect(result).toEqual({
      ok: true,
      data: {
        download_url: 'https://api.example.com/cv/abc',
        expires_at: '2026-11-10T10:00:00.000Z',
      },
    })
  })

  it('posts JSON to /contact', async () => {
    const spy = fetcher(Response.json({ error: { code: 'rate_limited' } }, { status: 429 }))
    await requestCv('https://api.example.com', body, spy)
    const [url, init] = vi.mocked(spy).mock.calls[0] ?? []
    expect(url).toBe('https://api.example.com/contact')
    expect(init?.method).toBe('POST')
    expect(JSON.parse(String(init?.body))).toEqual(body)
  })

  it('returns the API error code', async () => {
    const response = Response.json({ error: { code: 'captcha_failed' } }, { status: 403 })
    expect(await requestCv('https://x', body, fetcher(response))).toEqual({
      ok: false,
      code: 'captcha_failed',
    })
  })

  it('maps unexpected bodies to internal_error and network failures to network', async () => {
    expect(
      await requestCv('https://x', body, fetcher(new Response('nope', { status: 502 }))),
    ).toEqual({
      ok: false,
      code: 'internal_error',
    })
    expect(await requestCv('https://x', body, fetcher(new TypeError('offline')))).toEqual({
      ok: false,
      code: 'network',
    })
  })
})
