import { DEFAULT_LOCALE, type ContactRequest, type ContactResponse } from '@portfolio/shared'

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

export const DOWNLOAD_TTL_MS = 10 * 60 * 1000

export interface ContactDeps {
  captcha: CaptchaVerifier
  rate_limiter: RateLimiter
  signer: TokenSigner
  cv_storage: CvStorage
  email: EmailSender
  logger: Logger
  clock: Clock
}

export interface SubmitContactInput {
  request: ContactRequest
  client_ip: string
  /** Public origin of the API, used to build the download URL. */
  base_url: string
}

/** Verifies the visitor, notifies the owner and returns a short-lived CV download URL. */
export async function submitContactRequest(
  deps: Omit<ContactDeps, 'cv_storage'>,
  input: SubmitContactInput,
): Promise<ContactResponse> {
  const is_human = await deps.captcha.verify(input.request.captcha_token, input.client_ip)
  if (!is_human) {
    deps.logger.warn('contact.captcha_failed')
    throw new DomainError('captcha_failed')
  }

  const is_allowed = await deps.rate_limiter.consume(`contact:${input.client_ip}`)
  if (!is_allowed) {
    deps.logger.warn('contact.rate_limited')
    throw new DomainError('rate_limited')
  }

  const exp = deps.clock.now() + DOWNLOAD_TTL_MS
  const token = await deps.signer.sign({ locale: input.request.locale, exp })
  await notifyOwner(deps, input.request)

  return {
    download_url: `${input.base_url}/cv/${encodeURIComponent(token)}`,
    expires_at: new Date(exp).toISOString(),
  }
}

async function notifyOwner(
  deps: Pick<ContactDeps, 'email' | 'logger'>,
  request: ContactRequest,
): Promise<void> {
  try {
    await deps.email.notifyOwner({
      subject: `CV solicitado por ${request.company}`,
      text: `Alguien descargó tu CV.\n\nEmail: ${request.email}\nEmpresa: ${request.company}\nIdioma: ${request.locale}`,
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
