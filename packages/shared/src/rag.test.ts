import { describe, expect, it } from 'vitest'

import {
  AskRequestSchema,
  AskStreamEventSchema,
  IndexRequestSchema,
  RAG_MAX_QUESTION_LENGTH,
} from './rag'

describe('AskRequestSchema', () => {
  it('accepts a question in a supported locale', () => {
    expect(AskRequestSchema.parse({ question: ' Which databases? ', locale: 'en' })).toEqual({
      question: 'Which databases?',
      locale: 'en',
    })
  })

  it('rejects questions over the limit', () => {
    const question = 'x'.repeat(RAG_MAX_QUESTION_LENGTH + 1)
    expect(AskRequestSchema.safeParse({ question, locale: 'es' }).success).toBe(false)
  })

  it('rejects empty questions', () => {
    expect(AskRequestSchema.safeParse({ question: '  ', locale: 'es' }).success).toBe(false)
  })
})

describe('AskStreamEventSchema', () => {
  it.each([
    { type: 'token', text: 'Hola' },
    { type: 'sources', sources: [{ source: 'projects/ticker', title: 'Ticker', locale: 'es' }] },
    { type: 'done' },
    { type: 'error', code: 'internal_error' },
  ])('accepts %o', (event) => {
    expect(AskStreamEventSchema.safeParse(event).success).toBe(true)
  })

  it('rejects unknown event types', () => {
    expect(AskStreamEventSchema.safeParse({ type: 'other' }).success).toBe(false)
  })
})

describe('IndexRequestSchema', () => {
  const chunk = {
    id: 'es:profile:0',
    text: 'Trabajo con Node.js',
    locale: 'es',
    source: 'profile',
    title: 'Perfil',
    embedding: [0.1, 0.2],
  }

  it('accepts chunks with embeddings', () => {
    expect(IndexRequestSchema.parse({ model: 'bge-m3', chunks: [chunk] }).chunks).toHaveLength(1)
  })

  it('rejects chunks with an empty embedding', () => {
    const request = { model: 'bge-m3', chunks: [{ ...chunk, embedding: [] }] }
    expect(IndexRequestSchema.safeParse(request).success).toBe(false)
  })
})
