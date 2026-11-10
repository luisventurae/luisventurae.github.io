import { describe, expect, it, vi } from 'vitest'

import { createOllamaChat, createOllamaEmbeddings } from './ollama'

function streamOf(chunks: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(encoder.encode(chunk))
      controller.close()
    },
  })
}

describe('createOllamaEmbeddings', () => {
  it('returns one embedding per input', async () => {
    const fetcher = vi.fn(async () =>
      Response.json({ embeddings: [[0.1, 0.2]] }),
    ) as unknown as typeof fetch
    const provider = createOllamaEmbeddings({
      host: 'http://ollama:11434/',
      model: 'bge-m3',
      fetcher,
    })
    expect(await provider.embed(['hola'])).toEqual([[0.1, 0.2]])
    const [url, init] = vi.mocked(fetcher).mock.calls[0] ?? []
    expect(url).toBe('http://ollama:11434/api/embed')
    expect(JSON.parse(String(init?.body))).toEqual({ model: 'bge-m3', input: ['hola'] })
  })

  it('fails on HTTP errors', async () => {
    const fetcher = vi.fn(async () => new Response('', { status: 404 })) as unknown as typeof fetch
    await expect(
      createOllamaEmbeddings({ host: 'http://o', model: 'm', fetcher }).embed(['x']),
    ).rejects.toThrow('ollama_embed_404')
  })
})

describe('createOllamaChat', () => {
  it('yields content across split NDJSON chunks until done', async () => {
    const body = streamOf([
      '{"message":{"content":"Ho"}}\n{"message":{"con',
      'tent":"la"}}\n',
      '{"done":true}\n{"message":{"content":"ignored"}}\n',
    ])
    const fetcher = vi.fn(async () => new Response(body)) as unknown as typeof fetch
    const chat = createOllamaChat({ host: 'http://o', model: 'qwen3', fetcher })
    const parts: string[] = []
    for await (const part of chat.stream([{ role: 'user', content: 'hi' }])) parts.push(part)
    expect(parts).toEqual(['Ho', 'la'])
    expect(JSON.parse(String(vi.mocked(fetcher).mock.calls[0]?.[1]?.body))).toMatchObject({
      model: 'qwen3',
      stream: true,
      think: false,
    })
  })
})
