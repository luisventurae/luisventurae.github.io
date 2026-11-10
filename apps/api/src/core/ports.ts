import type { Locale } from '@portfolio/shared'

/** Driven ports of the hexagon. Adapters live in src/adapters. */

export interface CaptchaVerifier {
  verify(token: string, client_ip: string): Promise<boolean>
}

export interface RateLimiter {
  /** Returns false when `key` exceeded its quota. */
  consume(key: string): Promise<boolean>
}

export interface DownloadTokenPayload {
  locale: Locale
  /** Expiry, epoch milliseconds. */
  exp: number
}

export interface TokenSigner {
  sign(payload: DownloadTokenPayload): Promise<string>
  /** Returns null for malformed or tampered tokens. */
  verify(token: string): Promise<DownloadTokenPayload | null>
}

export interface CvFile {
  body: ReadableStream
  size: number
}

export interface CvStorage {
  get(locale: Locale): Promise<CvFile | null>
}

export interface EmailMessageInput {
  subject: string
  text: string
}

export interface EmailSender {
  /** Sends to the owner's configured address. */
  notifyOwner(message: EmailMessageInput): Promise<void>
}

export interface Logger {
  info(event: string, data?: Record<string, unknown>): void
  warn(event: string, data?: Record<string, unknown>): void
  error(event: string, data?: Record<string, unknown>): void
}

export interface Clock {
  now(): number
}
