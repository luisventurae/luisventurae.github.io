import { EmailMessage } from 'cloudflare:email'
import type { Hono } from 'hono'

import { createConsoleLogger } from './adapters/console-logger'
import {
  createCloudflareEmailSender,
  createMailpitEmailSender,
  type SendEmailBinding,
} from './adapters/email'
import { createHmacTokenSigner } from './adapters/hmac-token-signer'
import { createApp } from './adapters/http/app'
import { createRagRoutes } from './adapters/http/rag-routes'
import { createKvRateLimiter } from './adapters/kv-rate-limiter'
import { createKvVectorIndex } from './adapters/kv-vector-index'
import { createOllamaChat, createOllamaEmbeddings } from './adapters/ollama'
import { createR2CvStorage } from './adapters/r2-cv-storage'
import { createTurnstileVerifier } from './adapters/turnstile'
import { parseConfig, type Config } from './config'
import type { ContactDeps } from './core/contact'
import type { EmailSender, Logger } from './core/ports'

export interface Bindings {
  RATE_LIMIT_KV: KVNamespace
  RAG_INDEX_KV?: KVNamespace
  CV_BUCKET: R2Bucket
  SEND_EMAIL?: SendEmailBinding
  [key: string]: unknown
}

const RATE_LIMIT = { max: 5, window_seconds: 600 }

let cached_app: Hono | undefined

/** Composition root: builds adapters from `env` once per isolate and wires the use cases. */
function buildApp(env: Bindings): Hono {
  const logger = createConsoleLogger()
  const config = parseConfig(env)
  const contact: ContactDeps = {
    captcha: createTurnstileVerifier(config.TURNSTILE_SECRET_KEY, logger),
    rate_limiter: createKvRateLimiter(env.RATE_LIMIT_KV, RATE_LIMIT),
    signer: createHmacTokenSigner(config.DOWNLOAD_TOKEN_SECRET),
    cv_storage: createR2CvStorage(env.CV_BUCKET),
    email: createEmailSender(config, env, logger),
    logger,
    clock: { now: () => Date.now() },
  }
  const rag_routes = createRagRoutesIfEnabled(config, env, logger)
  return createApp(() => ({ allowed_origin: config.ALLOWED_ORIGIN, contact, logger, rag_routes }))
}

function createRagRoutesIfEnabled(config: Config, env: Bindings, logger: Logger): Hono | undefined {
  if (!config.rag_enabled || !env.RAG_INDEX_KV) return undefined
  return createRagRoutes(
    {
      embeddings: createOllamaEmbeddings({
        host: config.OLLAMA_HOST,
        model: config.RAG_EMBED_MODEL,
      }),
      chat: createOllamaChat({ host: config.OLLAMA_HOST, model: config.RAG_CHAT_MODEL }),
      index_repository: createKvVectorIndex(env.RAG_INDEX_KV),
    },
    logger,
  )
}

function createEmailSender(config: Config, env: Bindings, logger: Logger): EmailSender {
  const addresses = { from: config.EMAIL_FROM, to: config.NOTIFY_EMAIL }
  if (config.EMAIL_TRANSPORT === 'mailpit' && config.MAILPIT_URL) {
    return createMailpitEmailSender(config.MAILPIT_URL, addresses)
  }
  if (!env.SEND_EMAIL) {
    logger.error('config.missing_send_email_binding')
    return { notifyOwner: async () => Promise.reject(new Error('send_email binding missing')) }
  }
  return createCloudflareEmailSender(
    env.SEND_EMAIL,
    addresses,
    (from, to, raw) => new EmailMessage(from, to, raw),
  )
}

export default {
  fetch(request: Request, env: Bindings, ctx: ExecutionContext): Response | Promise<Response> {
    cached_app ??= buildApp(env)
    return cached_app.fetch(request, env, ctx)
  },
} satisfies ExportedHandler<Bindings>
