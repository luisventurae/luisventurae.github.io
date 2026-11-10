import type { RateLimiter } from '../core/ports'

export interface KvLike {
  get(key: string): Promise<string | null>
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>
}

export interface RateLimitPolicy {
  max: number
  window_seconds: number
}

/** Fixed-window limiter on Workers KV (eventually consistent: good enough for abuse control). */
export function createKvRateLimiter(kv: KvLike, policy: RateLimitPolicy): RateLimiter {
  return {
    async consume(key: string): Promise<boolean> {
      const storage_key = `rl:${key}`
      const count = Number((await kv.get(storage_key)) ?? '0')
      if (count >= policy.max) return false
      await kv.put(storage_key, String(count + 1), { expirationTtl: policy.window_seconds })
      return true
    },
  }
}
