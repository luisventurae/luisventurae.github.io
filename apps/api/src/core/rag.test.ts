import type { AskStreamEvent, IndexedChunk } from '@portfolio/shared'
import { describe, expect, it } from 'vitest'

import { DomainError } from './errors'
import type { ChatMessage, VectorIndex } from './ports'
import {
  askQuestion,
  buildPrompt,
  cosineSimilarity,
  indexDocuments,
  rankChunks,
  type RagDeps,
} from './rag'

function chunk(id: string, locale: 'es' | 'en', embedding: number[], text = id): IndexedChunk {
  return { id, text, locale, source: `projects/${id}`, title: id.toUpperCase(), embedding }
}

function createRagFakes(index: VectorIndex | null, question_embedding = [1, 0]) {
  let stored = index
  const prompts: ChatMessage[][] = []
  const deps: RagDeps = {
    embeddings: { embed: async (texts) => texts.map(() => question_embedding) },
    chat: {
      stream: async function* (messages) {
        prompts.push(messages)
        yield 'Uso '
        yield 'MongoDB.'
      },
    },
    index_repository: {
      load: async () => stored,
      save: async (next) => {
        stored = next
      },
    },
  }
  return { deps, prompts, stored: () => stored }
}

async function collect(stream: AsyncIterable<AskStreamEvent>): Promise<AskStreamEvent[]> {
  const events: AskStreamEvent[] = []
  for await (const event of stream) events.push(event)
  return events
}

describe('cosineSimilarity', () => {
  it('measures the angle between vectors', () => {
    expect(cosineSimilarity([1, 0], [1, 0])).toBeCloseTo(1)
    expect(cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0)
    expect(cosineSimilarity([0, 0], [1, 0])).toBe(0)
  })
})

describe('rankChunks', () => {
  const chunks = [chunk('a', 'en', [1, 0]), chunk('b', 'es', [0.9, 0.1]), chunk('c', 'es', [0, 1])]

  it('keeps only relevant chunks in the question locale when there are any', () => {
    const ranked = rankChunks(chunks, [1, 0], 'es', { top_k: 5, min_score: 0.35 })
    expect(ranked.map((item) => item.id)).toEqual(['b'])
  })

  it('falls back to other locales when the question locale has nothing relevant', () => {
    const ranked = rankChunks(chunks, [1, 0], 'fr', { top_k: 5, min_score: 0.35 })
    expect(ranked.map((item) => item.id)).toEqual(['a', 'b'])
  })

  it('limits to top_k', () => {
    expect(rankChunks(chunks, [1, 0], 'en', { top_k: 1, min_score: 0 })).toHaveLength(1)
  })
})

describe('buildPrompt', () => {
  it('grounds the model on numbered context and answers in the question language', () => {
    const messages = buildPrompt('¿Qué bases de datos?', 'es', [
      chunk('a', 'es', [1], 'Uso MongoDB'),
    ])
    expect(messages[0]?.role).toBe('system')
    expect(messages[0]?.content).toContain('español')
    expect(messages[1]?.content).toContain('[1] A\nUso MongoDB')
    expect(messages[1]?.content).toContain('¿Qué bases de datos?')
  })
})

describe('indexDocuments', () => {
  it('replaces the index and reports the count', async () => {
    const fakes = createRagFakes({ model: 'old', chunks: [chunk('x', 'es', [1, 0])] })
    const result = await indexDocuments(fakes.deps, {
      model: 'bge-m3',
      chunks: [chunk('a', 'es', [1, 0]), chunk('b', 'en', [0, 1])],
    })
    expect(result).toEqual({ indexed: 2 })
    expect(fakes.stored()?.chunks.map((item) => item.id)).toEqual(['a', 'b'])
  })

  it('rejects embeddings with mixed dimensions', async () => {
    const fakes = createRagFakes(null)
    const request = { model: 'm', chunks: [chunk('a', 'es', [1, 0]), chunk('b', 'es', [1])] }
    await expect(indexDocuments(fakes.deps, request)).rejects.toBeInstanceOf(DomainError)
  })
})

describe('askQuestion', () => {
  it('streams tokens, then sources, then done', async () => {
    const fakes = createRagFakes({ model: 'm', chunks: [chunk('ticker', 'es', [1, 0])] })
    const events = await collect(askQuestion(fakes.deps, { question: '¿BD?', locale: 'es' }))
    expect(events).toEqual([
      { type: 'token', text: 'Uso ' },
      { type: 'token', text: 'MongoDB.' },
      { type: 'sources', sources: [{ source: 'projects/ticker', title: 'TICKER', locale: 'es' }] },
      { type: 'done' },
    ])
  })

  it('says it does not know when nothing is relevant, without calling the model', async () => {
    const fakes = createRagFakes({ model: 'm', chunks: [chunk('a', 'en', [0, 1])] }, [1, 0])
    const events = await collect(askQuestion(fakes.deps, { question: 'Weather?', locale: 'en' }))
    expect(fakes.prompts).toHaveLength(0)
    expect(events[0]).toMatchObject({ type: 'token' })
    expect(events.at(-2)).toEqual({ type: 'sources', sources: [] })
  })

  it('reports a missing index', async () => {
    const events = await collect(
      askQuestion(createRagFakes(null).deps, { question: 'Hi', locale: 'en' }),
    )
    expect(events).toEqual([{ type: 'error', code: 'not_found' }])
  })
})
