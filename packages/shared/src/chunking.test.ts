import { describe, expect, it } from 'vitest'

import { chunkMarkdown } from './chunking'

const base = { locale: 'es', source: 'projects/ticker', title: 'Ticker' } as const

describe('chunkMarkdown', () => {
  it('splits by heading and keeps the heading as context', () => {
    const markdown = '## Reto\n\nEscalar sockets.\n\n## Solución\n\nRedis pub/sub.'
    const chunks = chunkMarkdown({ ...base, markdown })

    expect(chunks.map((chunk) => chunk.text)).toEqual([
      'Ticker — Reto\nEscalar sockets.',
      'Ticker — Solución\nRedis pub/sub.',
    ])
  })

  it('creates stable ids from locale, source and position', () => {
    const chunks = chunkMarkdown({ ...base, markdown: 'Uno.\n\n## Dos\n\nDos.' })
    expect(chunks.map((chunk) => chunk.id)).toEqual([
      'es:projects/ticker:0',
      'es:projects/ticker:1',
    ])
  })

  it('splits long sections into overlapping windows', () => {
    const sentence = 'palabra '.repeat(50).trim() + '.'
    const markdown = Array.from({ length: 12 }, () => sentence).join('\n\n')
    const chunks = chunkMarkdown({ ...base, markdown, max_words: 200, overlap_words: 30 })

    expect(chunks.length).toBeGreaterThan(1)
    for (const chunk of chunks) {
      expect(chunk.text.split(/\s+/).length).toBeLessThanOrEqual(200 + 5)
    }
  })

  it('ignores empty sections and strips markdown noise', () => {
    const chunks = chunkMarkdown({
      ...base,
      markdown: '## Vacío\n\n## Enlace\n\nVer [sitio](https://x.y) **ya**.',
    })
    expect(chunks).toHaveLength(1)
    expect(chunks[0]?.text).toBe('Ticker — Enlace\nVer sitio ya.')
  })

  it('carries locale, source and title in every chunk', () => {
    const [chunk] = chunkMarkdown({ ...base, markdown: 'Texto.' })
    expect(chunk).toMatchObject({ locale: 'es', source: 'projects/ticker', title: 'Ticker' })
  })
})
