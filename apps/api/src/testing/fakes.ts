import type { Locale } from '@portfolio/shared'

import type { ContactDeps } from '../core/contact'
import type { DownloadTokenPayload, EmailMessageInput } from '../core/ports'

interface FakeOptions {
  captcha_ok?: boolean
  rate_limit_ok?: boolean
  email_fails?: boolean
  cv_locales?: Locale[]
}

interface LogEntry {
  level: 'info' | 'warn' | 'error'
  event: string
  data?: Record<string, unknown> | undefined
}

/** In-memory implementations of the ports for use-case tests. */
export function createFakes(options: FakeOptions = {}) {
  const emails: EmailMessageInput[] = []
  const rate_keys: string[] = []
  const cv_requests: Locale[] = []
  const logs: LogEntry[] = []
  const tokens = new Map<string, DownloadTokenPayload>()
  const clock = { now: () => Date.UTC(2026, 10, 10, 12, 0, 0) }
  const cv_locales = options.cv_locales ?? ['es', 'en', 'fr']

  const deps: ContactDeps = {
    captcha: { verify: async () => options.captcha_ok ?? true },
    rate_limiter: {
      consume: async (key) => {
        rate_keys.push(key)
        return options.rate_limit_ok ?? true
      },
    },
    signer: {
      sign: async (payload) => {
        const token = `token-${tokens.size}`
        tokens.set(token, payload)
        return token
      },
      verify: async (token) => tokens.get(token) ?? null,
    },
    cv_storage: {
      get: async (locale) => {
        cv_requests.push(locale)
        if (!cv_locales.includes(locale)) return null
        return { body: new Blob(['cv']).stream(), size: 2 }
      },
    },
    email: {
      notifyOwner: async (message) => {
        if (options.email_fails) throw new Error('smtp down')
        emails.push(message)
      },
    },
    logger: {
      info: (event, data) => logs.push({ level: 'info', event, data }),
      warn: (event, data) => logs.push({ level: 'warn', event, data }),
      error: (event, data) => logs.push({ level: 'error', event, data }),
    },
    clock,
  }

  return { deps, emails, rate_keys, cv_requests, logs, clock }
}
