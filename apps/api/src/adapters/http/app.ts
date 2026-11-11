import { CONTACT_MAX_BODY_BYTES, ContactRequestSchema } from '@portfolio/shared'
import { Hono, type Context } from 'hono'
import { bodyLimit } from 'hono/body-limit'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'

import { downloadCv, submitContactRequest, type ContactDeps } from '../../core/contact'
import { DomainError } from '../../core/errors'
import type { Logger } from '../../core/ports'
import { errorResponse } from './errors'

export interface AppDeps {
  allowed_origin: string
  contact: ContactDeps
  logger: Logger
}

/** Driving adapter: thin HTTP layer that validates input and delegates to use cases. */
export function createApp(resolveDeps: (c: Context) => AppDeps): Hono {
  const app = new Hono()

  app.use(
    secureHeaders({
      contentSecurityPolicy: { defaultSrc: ["'none'"], frameAncestors: ["'none'"] },
      referrerPolicy: 'strict-origin-when-cross-origin',
      crossOriginResourcePolicy: 'cross-origin',
    }),
  )
  app.use((c, next) =>
    cors({
      origin: (origin) => (origin === resolveDeps(c).allowed_origin ? origin : null),
      allowMethods: ['GET', 'POST', 'OPTIONS'],
      allowHeaders: ['Content-Type'],
      maxAge: 600,
    })(c, next),
  )

  app.get('/health', (c) => c.json({ ok: true }))

  app.post(
    '/contact',
    bodyLimit({
      maxSize: CONTACT_MAX_BODY_BYTES,
      onError: (c) => errorResponse(c, 'payload_too_large'),
    }),
    async (c) => {
      const parsed = ContactRequestSchema.safeParse(await readJson(c))
      if (!parsed.success) return errorResponse(c, 'invalid_request')
      const result = await submitContactRequest(resolveDeps(c).contact, {
        request: parsed.data,
        client_ip: c.req.header('cf-connecting-ip') ?? '',
        base_url: new URL(c.req.url).origin,
      })
      return c.json(result)
    },
  )

  app.get('/cv/:token', async (c) => {
    const file = await downloadCv(resolveDeps(c).contact, c.req.param('token'))
    return new Response(file.body, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': String(file.size),
        'Content-Disposition': 'attachment; filename="CV-Luis-Ventura-E.pdf"',
        'Cache-Control': 'no-store',
      },
    })
  })

  app.notFound((c) => errorResponse(c, 'not_found'))
  app.onError((error, c) => {
    if (error instanceof DomainError) return errorResponse(c, error.code)
    resolveDeps(c).logger.error('http.unhandled', { name: error.name })
    return errorResponse(c, 'internal_error')
  })

  return app
}

async function readJson(c: Context): Promise<unknown> {
  try {
    return await c.req.json()
  } catch {
    return null
  }
}
