import type { AskStreamEvent } from '@portfolio/shared'
import { describe, expect, it, vi } from 'vitest'

import { askStream, RagUnavailableError } from './ask-client'

function ndjsonResponse(chunks: string[]): Response {
  const encoder = new TextEncoder()
  return new Response(
    new ReadableStream({
      start(controller) {
        for (const chunk of chunks) controller.enqueue(encoder.encode(chunk))
        controller.close()
      },
    }),
  )
}

async function collect(stream: AsyncIterable<AskStreamEvent>): Promise<AskStreamEvent[]> {
  const events: AskStreamEvent[] = []
  for await (const event of stream) events.push(event)
  return events
}

const body = { question: 'hola', locale: 'es' as const }

describe('askStream', () => {
  it('parses NDJSON events split across chunks', async () => {
    const fetcher = vi.fn(async () =>
      ndjsonResponse([
        '{"type":"token","text":"Ho"}\n{"type":"to',
        'ken","text":"la"}\n{"type":"done"}\n',
      ]),
    ) as unknown as typeof fetch
    expect(await collect(askStream('http://api', body, fetcher))).toEqual([
      { type: 'token', text: 'Ho' },
      { type: 'token', text: 'la' },
      { type: 'done' },
    ])
  })

  it('reports RAG as unavailable on 404, a missing index or network errors', async () => {
    const notFound = vi.fn(async () => new Response('', { status: 404 })) as unknown as typeof fetch
    await expect(collect(askStream('http://api', body, notFound))).rejects.toBeInstanceOf(
      RagUnavailableError,
    )

    const noIndex = vi.fn(async () =>
      ndjsonResponse(['{"type":"error","code":"not_found"}\n']),
    ) as unknown as typeof fetch
    await expect(collect(askStream('http://api', body, noIndex))).rejects.toBeInstanceOf(
      RagUnavailableError,
    )

    const offline = vi.fn(async () => {
      throw new TypeError('offline')
    }) as unknown as typeof fetch
    await expect(collect(askStream('http://api', body, offline))).rejects.toBeInstanceOf(
      RagUnavailableError,
    )
  })

  it('skips malformed lines', async () => {
    const fetcher = vi.fn(async () =>
      ndjsonResponse(['nope\n{"type":"done"}\n']),
    ) as unknown as typeof fetch
    expect(await collect(askStream('http://api', body, fetcher))).toEqual([{ type: 'done' }])
  })
})
