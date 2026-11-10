import type { DocumentChunk } from '@portfolio/shared'
import { describe, expect, it, vi } from 'vitest'

import { batches, embedChunks, fetchChunks, runIngest } from './ingest'

const chunk = (id: string): DocumentChunk => ({
  id,
  text: `text ${id}`,
  locale: 'es',
  source: 'profile',
  title: 'Perfil',
})

describe('batches', () => {
  it('splits a list into fixed-size groups', () => {
    expect(batches([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
  })
})

describe('embedChunks', () => {
  it('attaches one embedding per chunk, batching requests', async () => {
    const embed = vi.fn(async (texts: string[]) => texts.map((_text, index) => [index, 1]))
    const result = await embedChunks([chunk('a'), chunk('b'), chunk('c')], embed, 2)
    expect(embed).toHaveBeenCalledTimes(2)
    expect(result.map((item) => item.embedding)).toEqual([
      [0, 1],
      [1, 1],
      [0, 1],
    ])
  })

  it('fails when the provider returns the wrong number of vectors', async () => {
    await expect(embedChunks([chunk('a')], async () => [], 4)).rejects.toThrow(
      'embedding_count_mismatch',
    )
  })
})

describe('fetchChunks', () => {
  it('validates the search index', async () => {
    const fetcher = vi.fn(async () => Response.json([chunk('a')])) as unknown as typeof fetch
    expect(await fetchChunks('http://web:4321/', fetcher)).toEqual([chunk('a')])
    expect(vi.mocked(fetcher).mock.calls[0]?.[0]).toBe('http://web:4321/search-index.json')
  })

  it('rejects invalid payloads', async () => {
    const fetcher = vi.fn(async () => Response.json([{ id: 1 }])) as unknown as typeof fetch
    await expect(fetchChunks('http://web', fetcher)).rejects.toThrow()
  })
})

describe('runIngest', () => {
  it('fetches, embeds and uploads the index', async () => {
    const calls: string[] = []
    const fetcher = vi.fn(async (url: string, init?: RequestInit) => {
      calls.push(url)
      if (url.endsWith('/search-index.json')) return Response.json([chunk('a')])
      if (url.endsWith('/api/embed')) return Response.json({ embeddings: [[0.5, 0.5]] })
      return Response.json({ indexed: JSON.parse(String(init?.body)).chunks.length })
    }) as unknown as typeof fetch

    const result = await runIngest(
      {
        web_url: 'http://web:4321',
        api_url: 'http://api:8787',
        ollama_host: 'http://ollama:11434',
        model: 'bge-m3',
      },
      fetcher,
    )
    expect(result).toEqual({ indexed: 1 })
    expect(calls).toEqual([
      'http://web:4321/search-index.json',
      'http://ollama:11434/api/embed',
      'http://api:8787/rag/index',
    ])
  })
})
