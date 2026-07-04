import type { KVNamespace, ExecutionContext } from '@cloudflare/workers-types'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Env {
  TURNSTILE_SECRET_KEY: string
  NOTIFY_EMAIL: string
  ALLOWED_ORIGIN: string
  RATE_LIMIT_KV: KVNamespace
}

interface ContactBody {
  email: string
  company: string
  'cf-turnstile-response': string
}

interface TurnstileResponse {
  success: boolean
  'error-codes'?: string[]
}

interface ApiResponse {
  success: boolean
  message: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_SECONDS = 60 * 10 // 10 minutes
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'none'",
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const jsonResponse = (body: ApiResponse, status: number, origin: string): Response => {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      ...SECURITY_HEADERS,
    },
  })
}

const verifyTurnstile = async (token: string, secretKey: string, ip: string): Promise<boolean> => {
  const form = new FormData()
  form.append('secret', secretKey)
  form.append('response', token)
  form.append('remoteip', ip)

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: form,
  })
  const data = await res.json() as TurnstileResponse
  return data.success === true
}

const checkRateLimit = async (kv: KVNamespace, ip: string): Promise<boolean> => {
  const key = `rl:${ip}`
  const current = await kv.get(key)
  const count = current ? parseInt(current, 10) : 0

  if (count >= RATE_LIMIT_MAX) return false

  await kv.put(key, String(count + 1), { expirationTtl: RATE_LIMIT_WINDOW_SECONDS })
  return true
}

const validateBody = (body: unknown): body is ContactBody => {
  if (typeof body !== 'object' || body === null) return false
  const b = body as Record<string, unknown>
  return (
    typeof b.email === 'string' &&
    typeof b.company === 'string' &&
    typeof b['cf-turnstile-response'] === 'string' &&
    EMAIL_REGEX.test(b.email) &&
    b.company.trim().length >= 2 &&
    b.company.trim().length <= 200 &&
    b['cf-turnstile-response'].length > 0
  )
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const allowedOrigin = env.ALLOWED_ORIGIN ?? 'https://luisventurae.github.io'

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': allowedOrigin,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
          ...SECURITY_HEADERS,
        },
      })
    }

    // Only POST allowed
    if (request.method !== 'POST') {
      return jsonResponse({ success: false, message: 'Method not allowed.' }, 405, allowedOrigin)
    }

    // Strict CORS origin check
    const origin = request.headers.get('Origin') ?? ''
    if (origin !== allowedOrigin) {
      return jsonResponse({ success: false, message: 'Forbidden.' }, 403, allowedOrigin)
    }

    // Rate limiting
    const clientIp = request.headers.get('CF-Connecting-IP') ?? 'unknown'
    const allowed = await checkRateLimit(env.RATE_LIMIT_KV, clientIp)
    if (!allowed) {
      return jsonResponse(
        { success: false, message: 'Demasiadas solicitudes. Intenta más tarde.' },
        429,
        allowedOrigin
      )
    }

    // Parse and validate body
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return jsonResponse({ success: false, message: 'Cuerpo de solicitud inválido.' }, 400, allowedOrigin)
    }

    if (!validateBody(body)) {
      return jsonResponse({ success: false, message: 'Datos del formulario inválidos.' }, 400, allowedOrigin)
    }

    // Verify Turnstile token (Zero Trust: always validate server-side)
    const tokenValid = await verifyTurnstile(
      body['cf-turnstile-response'],
      env.TURNSTILE_SECRET_KEY,
      clientIp
    )
    if (!tokenValid) {
      return jsonResponse({ success: false, message: 'Verificación de captcha fallida.' }, 400, allowedOrigin)
    }

    // Send notification email via Cloudflare Email Workers (MailChannels)
    // Replace this block with your preferred email provider if needed
    try {
      await sendNotificationEmail(env, body.email, body.company)
    } catch (err: unknown) {
      const detail = err instanceof Error ? err.message : 'Unknown error'
      console.error('Email send failed:', detail)
      return jsonResponse(
        { success: false, message: 'Error al enviar la notificación. Intenta más tarde.' },
        500,
        allowedOrigin
      )
    }

    return jsonResponse(
      { success: true, message: '¡Mensaje enviado! Descarga tu CV a continuación.' },
      200,
      allowedOrigin
    )
  },
}

// ─── Email Notification ───────────────────────────────────────────────────────

const sendNotificationEmail = async (env: Env, fromEmail: string, company: string): Promise<void> => {
  // Uses Cloudflare Email Workers + MailChannels (free for Workers)
  // Docs: https://developers.cloudflare.com/email-routing/email-workers/
  // To switch provider: replace this fetch with your transactional email API call
  const payload = {
    personalizations: [{ to: [{ email: env.NOTIFY_EMAIL }] }],
    from: { email: 'no-reply@luisventurae.github.io', name: 'Portfolio Contact' },
    subject: `Nueva solicitud de CV — ${company}`,
    content: [
      {
        type: 'text/plain',
        value: `Alguien solicitó tu CV.\n\nEmail: ${fromEmail}\nEmpresa: ${company}`,
      },
    ],
  }

  const res = await fetch('https://api.mailchannels.net/tx/v1/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok && res.status !== 202) {
    throw new Error(`MailChannels responded with ${res.status}`)
  }
}
