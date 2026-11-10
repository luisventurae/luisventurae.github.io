import { LocaleSchema } from '@portfolio/shared'
import { z } from 'zod'

import type { DownloadTokenPayload, TokenSigner } from '../core/ports'

const PayloadSchema = z.object({ locale: LocaleSchema, exp: z.number().int() })
const encoder = new TextEncoder()

/**
 * Stateless signed tokens: base64url(payload).base64url(HMAC-SHA-256).
 * Verification uses crypto.subtle.verify, which compares in constant time.
 */
export function createHmacTokenSigner(secret: string): TokenSigner {
  const key_promise = crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )

  return {
    async sign(payload: DownloadTokenPayload): Promise<string> {
      const body = toBase64Url(encoder.encode(JSON.stringify(payload)))
      const signature = await crypto.subtle.sign('HMAC', await key_promise, encoder.encode(body))
      return `${body}.${toBase64Url(new Uint8Array(signature))}`
    },

    async verify(token: string): Promise<DownloadTokenPayload | null> {
      const parts = token.split('.')
      const [body, signature] = parts
      if (parts.length !== 2 || !body || !signature) return null
      const signature_bytes = fromBase64Url(signature)
      if (!signature_bytes) return null
      const is_valid = await crypto.subtle.verify(
        'HMAC',
        await key_promise,
        signature_bytes,
        encoder.encode(body),
      )
      if (!is_valid) return null
      return parsePayload(body)
    },
  }
}

function parsePayload(body: string): DownloadTokenPayload | null {
  const bytes = fromBase64Url(body)
  if (!bytes) return null
  try {
    const parsed = PayloadSchema.safeParse(JSON.parse(new TextDecoder().decode(bytes)))
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> | null {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) return null
  let binary: string
  try {
    binary = atob(value.replace(/-/g, '+').replace(/_/g, '/'))
  } catch {
    return null
  }
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index++) bytes[index] = binary.charCodeAt(index)
  return bytes
}
