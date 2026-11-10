import {
  AskRequestSchema,
  IndexRequestSchema,
  RAG_MAX_BODY_BYTES,
  type AskStreamEvent,
} from '@portfolio/shared'
import { Hono } from 'hono'
import { bodyLimit } from 'hono/body-limit'

import type { Logger } from '../../core/ports'
import { askQuestion, indexDocuments, type RagDeps } from '../../core/rag'
import { errorResponse } from './errors'

const INDEX_MAX_BODY_BYTES = 20 * 1024 * 1024

/** Local-only RAG endpoints. Mounted by the composition root when RAG_ENABLED=true. */
export function createRagRoutes(deps: RagDeps, logger: Logger): Hono {
  const routes = new Hono().basePath('/rag')

  routes.post(
    '/ask',
    bodyLimit({
      maxSize: RAG_MAX_BODY_BYTES,
      onError: (c) => errorResponse(c, 'payload_too_large'),
    }),
    async (c) => {
      const parsed = AskRequestSchema.safeParse(await c.req.json().catch(() => null))
      if (!parsed.success) return errorResponse(c, 'invalid_request')
      const events = askQuestion(deps, parsed.data)
      return new Response(toNdjson(events, logger), {
        headers: {
          'Content-Type': 'application/x-ndjson; charset=utf-8',
          'Cache-Control': 'no-store',
        },
      })
    },
  )

  routes.post(
    '/index',
    bodyLimit({
      maxSize: INDEX_MAX_BODY_BYTES,
      onError: (c) => errorResponse(c, 'payload_too_large'),
    }),
    async (c) => {
      const parsed = IndexRequestSchema.safeParse(await c.req.json().catch(() => null))
      if (!parsed.success) return errorResponse(c, 'invalid_request')
      return c.json(await indexDocuments(deps, parsed.data))
    },
  )

  return routes
}

function toNdjson(
  events: AsyncIterable<AskStreamEvent>,
  logger: Logger,
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()
  return new ReadableStream({
    async start(controller) {
      const write = (event: AskStreamEvent): void =>
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`))
      try {
        for await (const event of events) write(event)
      } catch (error) {
        logger.error('rag.stream_failed', { name: error instanceof Error ? error.name : 'unknown' })
        write({ type: 'error', code: 'internal_error' })
      }
      controller.close()
    },
  })
}
