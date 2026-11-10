import { describe, expect, it } from 'vitest'

import { createKvRateLimiter, type KvLike } from './kv-rate-limiter'

function memoryKv(): KvLike & { ttl: Map<string, number | undefined> } {
  const store = new Map<string, string>()
  const ttl = new Map<string, number | undefined>()
  return {
    ttl,
    get: async (key) => store.get(key) ?? null,
    put: async (key, value, options) => {
      store.set(key, value)
      ttl.set(key, options?.expirationTtl)
    },
  }
}

describe('createKvRateLimiter', () => {
  it('allows up to the maximum and then blocks', async () => {
    const kv = memoryKv()
    const limiter = createKvRateLimiter(kv, { max: 5, window_seconds: 600 })
    const results = []
    for (let attempt = 0; attempt < 6; attempt++) results.push(await limiter.consume('ip'))
    expect(results).toEqual([true, true, true, true, true, false])
    expect(kv.ttl.get('rl:ip')).toBe(600)
  })

  it('tracks keys independently', async () => {
    const limiter = createKvRateLimiter(memoryKv(), { max: 1, window_seconds: 60 })
    expect(await limiter.consume('a')).toBe(true)
    expect(await limiter.consume('b')).toBe(true)
    expect(await limiter.consume('a')).toBe(false)
  })
})
