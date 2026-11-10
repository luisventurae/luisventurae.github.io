import { describe, expect, it } from 'vitest'

import { chunkTypeScript } from './chunk-typescript'

const source = `import { z } from 'zod'

/** Parses the environment. */
export function parseConfig(env: unknown): string {
  return String(env)
}

export interface Config {
  name: string
}

export const LIMIT = 5

export class Signer {
  sign(value: string): string {
    return value
  }
}
`

describe('chunkTypeScript', () => {
  it('creates one chunk per top-level declaration with its line range', () => {
    const chunks = chunkTypeScript({ path: 'apps/api/src/config.ts', content: source })
    expect(chunks.map((chunk) => chunk.symbol)).toEqual([
      'parseConfig',
      'Config',
      'LIMIT',
      'Signer',
    ])
    const parse = chunks[0]
    expect(parse).toMatchObject({ kind: 'code', start_line: 3, end_line: 6 })
    expect(parse?.text).toContain('apps/api/src/config.ts › parseConfig')
    expect(parse?.text).toContain('Parses the environment.')
  })

  it('skips imports and gives every chunk a unique id', () => {
    const chunks = chunkTypeScript({ path: 'a.ts', content: source })
    expect(chunks.some((chunk) => chunk.text.includes("from 'zod'"))).toBe(false)
    expect(new Set(chunks.map((chunk) => chunk.id)).size).toBe(chunks.length)
  })

  it('marks test files and splits describe blocks into their cases', () => {
    const test_source = `describe('parseConfig', () => {
  it('accepts the local environment', () => {
    expect(1).toBe(1)
${'    expect(1).toBe(1)\n'.repeat(54)}  })

  it('rejects bad input', () => {
    expect(2).toBe(2)
    expect(3).toBe(3)
    expect(4).toBe(4)
    expect(5).toBe(5)
  })
})
`
    const chunks = chunkTypeScript({ path: 'src/config.test.ts', content: test_source })
    expect(chunks.every((chunk) => chunk.kind === 'test')).toBe(true)
    expect(chunks.map((chunk) => chunk.symbol)).toEqual([
      `describe('parseConfig') › it('accepts the local environment')`,
      `describe('parseConfig') › it('rejects bad input')`,
    ])
  })

  it('splits oversized declarations into overlapping line windows', () => {
    const body = Array.from({ length: 200 }, (_, index) => `  const value_${index} = ${index}`)
    const content = `export function big(): void {\n${body.join('\n')}\n}\n`
    const chunks = chunkTypeScript({ path: 'big.ts', content })
    expect(chunks.length).toBeGreaterThan(2)
    expect(chunks.every((chunk) => chunk.symbol?.startsWith('big'))).toBe(true)
    expect(chunks[1]?.start_line).toBeLessThan(chunks[0]?.end_line ?? 0)
  })

  it('handles .tsx and files without declarations', () => {
    const tsx = chunkTypeScript({
      path: 'Button.tsx',
      content: 'export function Button() {\n  return <button />\n}\n',
    })
    expect(tsx.map((chunk) => chunk.symbol)).toEqual(['Button'])
    expect(chunkTypeScript({ path: 'empty.ts', content: "import 'x'\n" })).toEqual([])
  })
})
