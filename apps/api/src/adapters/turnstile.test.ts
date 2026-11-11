import { describe, expect, it, vi } from 'vitest'

import { createTurnstileVerifier } from './turnstile'

const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn() }

function fetcherReturning(body: unknown): typeof fetch {
  return vi.fn(async () => Response.json(body)) as unknown as typeof fetch
}

describe('createTurnstileVerifier', () => {
  it('accepts tokens the provider validates', async () => {
    const fetcher = fetcherReturning({ success: true })
    expect(await createTurnstileVerifier('secret', logger, fetcher).verify('t', '1.2.3.4')).toBe(
      true,
    )
    const [, init] = vi.mocked(fetcher).mock.calls[0] ?? []
    const form = init?.body as FormData
    expect(form.get('secret')).toBe('secret')
    expect(form.get('remoteip')).toBe('1.2.3.4')
  })

  it('rejects tokens the provider refuses', async () => {
    const verifier = createTurnstileVerifier('secret', logger, fetcherReturning({ success: false }))
    expect(await verifier.verify('t', '')).toBe(false)
  })

  it('rejects unexpected responses and network errors', async () => {
    expect(await createTurnstileVerifier('s', logger, fetcherReturning({})).verify('t', '')).toBe(
      false,
    )
    const failing = vi.fn(async () => {
      throw new Error('offline')
    }) as unknown as typeof fetch
    expect(await createTurnstileVerifier('s', logger, failing).verify('t', '')).toBe(false)
    expect(logger.error).toHaveBeenCalledWith('captcha.unavailable')
  })
})
