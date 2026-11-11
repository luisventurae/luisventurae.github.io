import { DEFAULT_LOCALE, type ContactRequest, type ContactResponse } from '@portfolio/shared'

import { buildCvEmail } from './cv-email'
import { DomainError } from './errors'
import type {
  CaptchaVerifier,
  Clock,
  CvFile,
  CvStorage,
  EmailSender,
  Logger,
  RateLimiter,
  TokenSigner,
} from './ports'

export const DOWNLOAD_TTL_MS = 7 * 24 * 60 * 60 * 1000

export interface ContactDeps {
  captcha: CaptchaVerifier
  rate_limiter: RateLimiter
  /** Caps CV emails per destination address, independently of the client IP. */
  recipient_rate_limiter: RateLimiter
  signer: TokenSigner
  cv_storage: CvStorage
  email: EmailSender
  logger: Logger
  clock: Clock
}

export interface SubmitContactInput {
  request: ContactRequest
  client_ip: string
  /** Public origin of the API, used to build the emailed download URL. */
  base_url: string
}

/** Verifies the visitor, emails them a signed CV link and notifies the owner. */
export async function submitContactRequest(
  deps: Omit<ContactDeps, 'cv_storage'>,
  input: SubmitContactInput,
): Promise<ContactResponse> {
  await assertAllowed(deps, input)

  const { locale, email } = input.request
  const exp = deps.clock.now() + DOWNLOAD_TTL_MS
  const token = await deps.signer.sign({ locale, exp })
  const download_url = `${input.base_url}/cv/${encodeURIComponent(token)}`
  try {
    await deps.email.sendCvLink(email, buildCvEmail(locale, download_url, new Date(exp)))
  } catch (error) {
    deps.logger.error('contact.cv_email_failed', { reason: errorName(error) })
    throw new DomainError('email_failed')
  }

  await notifyOwner(deps, input.request)
  return { status: 'sent' }
}

/** Captcha first (no side effects before it), then per-IP and per-recipient limits. */
async function assertAllowed(
  deps: Pick<ContactDeps, 'captcha' | 'rate_limiter' | 'recipient_rate_limiter' | 'logger'>,
  input: SubmitContactInput,
): Promise<void> {
  const is_human = await deps.captcha.verify(input.request.captcha_token, input.client_ip)
  if (!is_human) {
    deps.logger.warn('contact.captcha_failed')
    throw new DomainError('captcha_failed')
  }
  if (!(await deps.rate_limiter.consume(`contact:${input.client_ip}`))) {
    deps.logger.warn('contact.rate_limited')
    throw new DomainError('rate_limited')
  }
  if (!(await deps.recipient_rate_limiter.consume(await recipientKey(input.request.email)))) {
    deps.logger.warn('contact.recipient_rate_limited')
    throw new DomainError('rate_limited')
  }
}

/** Hashed so addresses never sit in clear text in the rate-limit store. */
async function recipientKey(email: string): Promise<string> {
  const data = new TextEncoder().encode(email.trim().toLowerCase())
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', data))
  const hex = Array.from(digest, (byte) => byte.toString(16).padStart(2, '0')).join('')
  return `contact:to:${hex}`
}

async function notifyOwner(
  deps: Pick<ContactDeps, 'email' | 'logger'>,
  request: ContactRequest,
): Promise<void> {
  try {
    await deps.email.notifyOwner({
      subject: `CV solicitado por ${request.company}`,
      text: [
        'Alguien pidió tu CV y se lo enviamos por correo.',
        `Email: ${request.email}\nEmpresa: ${request.company}\nIdioma: ${request.locale}`,
        `Requisitos marcados: ${request.interests?.join(', ') || '—'}`,
      ].join('\n\n'),
    })
  } catch (error) {
    // The visitor still gets the CV; the owner just misses this notification.
    deps.logger.error('contact.notify_failed', { reason: errorName(error) })
  }
}

/** Resolves a signed token to the CV file, falling back to the default locale. */
export async function downloadCv(
  deps: Pick<ContactDeps, 'signer' | 'cv_storage' | 'clock' | 'logger'>,
  token: string,
): Promise<CvFile> {
  const payload = await deps.signer.verify(token)
  if (!payload || payload.exp < deps.clock.now()) {
    deps.logger.warn('cv.invalid_token')
    throw new DomainError('invalid_token')
  }

  const file =
    (await deps.cv_storage.get(payload.locale)) ??
    (payload.locale === DEFAULT_LOCALE ? null : await deps.cv_storage.get(DEFAULT_LOCALE))
  if (!file) throw new DomainError('not_found')
  return file
}

function errorName(error: unknown): string {
  return error instanceof Error ? error.name : 'unknown'
}
