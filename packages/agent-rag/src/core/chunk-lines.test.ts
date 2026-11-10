import { describe, expect, it } from 'vitest'

import { chunkLines } from './chunk-lines'

describe('chunkLines', () => {
  it('creates a single chunk for a short file', () => {
    const chunks = chunkLines({ path: 'apps/web/src/Page.astro', content: 'a\nb\nc\n' })
    expect(chunks).toHaveLength(1)
    expect(chunks[0]).toMatchObject({ kind: 'code', symbol: null, start_line: 1, end_line: 3 })
    expect(chunks[0]?.text.startsWith('apps/web/src/Page.astro\n')).toBe(true)
  })

  it('splits long files into overlapping windows and skips blank files', () => {
    const content = Array.from({ length: 150 }, (_, line) => `line ${line}`).join('\n')
    const chunks = chunkLines({ path: 'long.mjs', content })
    expect(chunks.length).toBeGreaterThan(2)
    expect(chunks[1]?.start_line).toBeLessThan(chunks[0]?.end_line ?? 0)
    expect(chunkLines({ path: 'empty.mjs', content: '\n\n' })).toEqual([])
  })
})
