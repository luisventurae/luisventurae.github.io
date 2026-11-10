import type { Hono } from 'hono'

import { createConsoleLogger } from './adapters/console-logger'
import { createMailpitEmailSender, createResendEmailSender } from './adapters/email'
import { createHmacTokenSigner } from './adapters/hmac-token-signer'
import { createApp } from './adapters/http/app'
import { createKvRateLimiter } from './adapters/kv-rate-limiter'
import { createR2CvStorage } from './adapters/r2-cv-storage'
import { createTurnstileVerifier } from './adapters/turnstile'
import { parseConfig, type Config } from './config'
import type { ContactDeps } from './core/contact'
import type { EmailSender } from './core/ports'

export interface Bindings {
  RATE_LIMIT_KV: KVNamespace
  CV_BUCKET: R2Bucket
  [key: string]: unknown
}

const RATE_LIMIT = { max: 5, window_seconds: 600 }
/** openspec contact-api › Per-recipient rate limit: 2 CV emails per address per 24 h. */
const RECIPIENT_RATE_LIMIT = { max: 2, window_seconds: 86_400 }

let cached_app: Hono | undefined

/** Composition root: builds adapters from `env` once per isolate and wires the use cases. */
function buildApp(env: Bindings): Hono {
  const logger = createConsoleLogger()
  const config = parseConfig(env)
  const contact: ContactDeps = {
    captcha: createTurnstileVerifier(config.TURNSTILE_SECRET_KEY, logger),
    rate_limiter: createKvRateLimiter(env.RATE_LIMIT_KV, RATE_LIMIT),
    recipient_rate_limiter: createKvRateLimiter(env.RATE_LIMIT_KV, RECIPIENT_RATE_LIMIT),
    signer: createHmacTokenSigner(config.DOWNLOAD_TOKEN_SECRET),
    cv_storage: createR2CvStorage(env.CV_BUCKET),
    email: createEmailSender(config),
    logger,
    clock: { now: () => Date.now() },
  }
  return createApp(() => ({ allowed_origin: config.ALLOWED_ORIGIN, contact, logger }))
}

/** parseConfig guarantees the URL or API key that the chosen transport needs. */
function createEmailSender(config: Config): EmailSender {
  const addresses = { from: config.EMAIL_FROM, to: config.NOTIFY_EMAIL }
  if (config.EMAIL_TRANSPORT === 'mailpit') {
    return createMailpitEmailSender(config.MAILPIT_URL ?? '', addresses)
  }
  return createResendEmailSender({ ...addresses, api_key: config.RESEND_API_KEY ?? '' })
}

export default {
  fetch(request: Request, env: Bindings, ctx: ExecutionContext): Response | Promise<Response> {
    cached_app ??= buildApp(env)
    return cached_app.fetch(request, env, ctx)
  },
} satisfies ExportedHandler<Bindings>
