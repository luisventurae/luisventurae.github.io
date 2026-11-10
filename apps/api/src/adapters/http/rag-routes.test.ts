import type { AskStreamEvent } from '@portfolio/shared'
import { describe, expect, it, vi } from 'vitest'

import type { RagDeps } from '../../core/rag'
import { createFakes } from '../../testing/fakes'
import { createApp } from './app'
import { createRagRoutes } from './rag-routes'

const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn() }
const chunk = {
  id: 'es:profile:0',
  text: 'Uso MongoDB',
  locale: 'es' as const,
  source: 'profile',
  title: 'Perfil',
  embedding: [1, 0],
}

function ragDeps(overrides: Partial<RagDeps> = {}): RagDeps {
  let stored: Awaited<ReturnType<RagDeps['index_repository']['load']>> = {
    model: 'm',
    chunks: [chunk],
  }
  return {
    embeddings: { embed: async () => [[1, 0]] },
    chat: {
      stream: async function* () {
        yield 'Mongo'
      },
    },
    index_repository: { load: async () => stored, save: async (index) => void (stored = index) },
    ...overrides,
  }
}

function appWith(deps: RagDeps) {
  const fakes = createFakes()
  return createApp(() => ({
    allowed_origin: 'http://localhost:4321',
    contact: fakes.deps,
    logger,
    rag_routes: createRagRoutes(deps, logger),
  }))
}

function parseNdjson(text: string): AskStreamEvent[] {
  return text
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line) as AskStreamEvent)
}

const post = (path: string, body: unknown) => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
  path,
})

describe('RAG routes', () => {
  it('streams NDJSON events for a question', async () => {
    const request = post('/rag/ask', { question: '¿BD?', locale: 'es' })
    const response = await appWith(ragDeps()).request(request.path, request)
    expect(response.headers.get('content-type')).toContain('application/x-ndjson')
    expect(parseNdjson(await response.text()).map((event) => event.type)).toEqual([
      'token',
      'sources',
      'done',
    ])
  })

  it('rejects questions over 500 characters', async () => {
    const request = post('/rag/ask', { question: 'x'.repeat(501), locale: 'es' })
    expect((await appWith(ragDeps()).request(request.path, request)).status).toBe(400)
  })

  it('turns a model failure into an error event', async () => {
    const failing = ragDeps({
      chat: {
        stream: async function* () {
          yield* []
          throw new Error('ollama down')
        },
      },
    })
    const request = post('/rag/ask', { question: '¿BD?', locale: 'es' })
    const events = parseNdjson(await (await appWith(failing).request(request.path, request)).text())
    expect(events.at(-1)).toEqual({ type: 'error', code: 'internal_error' })
  })

  it('indexes chunks', async () => {
    const request = post('/rag/index', { model: 'bge-m3', chunks: [chunk] })
    const response = await appWith(ragDeps()).request(request.path, request)
    expect(await response.json()).toEqual({ indexed: 1 })
  })
})
