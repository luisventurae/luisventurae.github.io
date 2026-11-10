import { z } from 'zod'

import type { CaptchaVerifier, Logger } from '../core/ports'

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const ResponseSchema = z.object({ success: z.boolean() })

/** Server-side Turnstile verification. Any failure counts as "not human". */
export function createTurnstileVerifier(
  secret_key: string,
  logger: Logger,
  fetcher: typeof fetch = fetch,
): CaptchaVerifier {
  return {
    async verify(token: string, client_ip: string): Promise<boolean> {
      const form = new FormData()
      form.append('secret', secret_key)
      form.append('response', token)
      if (client_ip) form.append('remoteip', client_ip)
      try {
        const response = await fetcher(SITEVERIFY_URL, { method: 'POST', body: form })
        const parsed = ResponseSchema.safeParse(await response.json())
        return parsed.success && parsed.data.success
      } catch {
        logger.error('captcha.unavailable')
        return false
      }
    },
  }
}
