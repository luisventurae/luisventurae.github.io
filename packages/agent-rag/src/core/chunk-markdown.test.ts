import { describe, expect, it } from 'vitest'

import { chunkMarkdown } from './chunk-markdown'

const markdown = `# Reglas

Intro corta.

## Nombres

Variables en snake_case.

### Excepciones

Constantes en UPPER_SNAKE_CASE.

## Commits

Conventional Commits.
`

describe('chunkMarkdown', () => {
  it('creates one chunk per section keeping the line range', () => {
    const chunks = chunkMarkdown({ path: 'docs/development-rules.md', content: markdown })
    expect(chunks.map((chunk) => chunk.symbol)).toEqual([
      'Reglas',
      'Reglas › Nombres',
      'Reglas › Nombres › Excepciones',
      'Reglas › Commits',
    ])
    expect(chunks[1]).toMatchObject({ kind: 'doc', start_line: 5, end_line: 7 })
    expect(chunks[1]?.text).toContain('Variables en snake_case.')
  })

  it('marks openspec files as spec', () => {
    const chunks = chunkMarkdown({ path: 'openspec/specs/terminal/spec.md', content: markdown })
    expect(chunks.every((chunk) => chunk.kind === 'spec')).toBe(true)
  })

  it('ignores headings inside code fences and skips empty sections', () => {
    const content = '# T\n\n```bash\n# not a heading\n```\n\n## Vacía\n\n## Con texto\n\nhola\n'
    const chunks = chunkMarkdown({ path: 'docs/a.md', content })
    expect(chunks.map((chunk) => chunk.symbol)).toEqual(['T', 'T › Con texto'])
    expect(chunks[0]?.text).toContain('# not a heading')
  })

  it('splits long sections into overlapping windows', () => {
    const lines = Array.from({ length: 120 }, (_, index) => `linea ${index}`).join('\n')
    const chunks = chunkMarkdown({ path: 'docs/long.md', content: `# Larga\n\n${lines}\n` })
    expect(chunks.length).toBeGreaterThan(1)
    expect(chunks[1]?.start_line).toBeLessThan(chunks[0]?.end_line ?? 0)
  })
})
