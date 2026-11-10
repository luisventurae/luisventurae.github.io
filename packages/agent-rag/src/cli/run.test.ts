import { describe, expect, it } from 'vitest'

import type { Embedder } from '../core/ports'
import { conceptEmbedder, memorySource, memoryStore } from '../testing/fakes'
import { runCli, type CliDeps } from './run'

const files = [
  {
    path: 'apps/api/src/adapters/turnstile.ts',
    content: 'export function createTurnstileVerifier(): void {}\n',
  },
  { path: 'docs/development-rules.md', content: '# Reglas\n\nNombres en snake_case.\n' },
]
const commits = [{ hash: 'abcdef1234', subject: 'feat: add captcha', body: '', files: [] }]

function setup(embedder: Embedder | null = conceptEmbedder()) {
  const store = memoryStore()
  const deps: CliDeps = {
    source: memorySource(structuredClone(files), commits),
    store,
    embedder,
    clock: { now: () => 1_000_000 },
  }
  return { deps, store }
}

describe('runCli', () => {
  it('searches, refreshing the index first, and prints locatable results', async () => {
    const { deps, store } = setup()
    const result = await runCli(['search', 'turnstile verifier'], deps)
    expect(result.code).toBe(0)
    expect(store.saved).not.toBeNull()
    expect(result.stdout).toContain('apps/api/src/adapters/turnstile.ts:1-1')
    expect(result.stdout).toContain('[code]')
    expect(result.stdout).toContain('createTurnstileVerifier')
  })

  it('prints JSON with --json', async () => {
    const { deps } = setup()
    const result = await runCli(['search', 'snake_case', '--json', '--kind', 'doc'], deps)
    const parsed: unknown = JSON.parse(result.stdout)
    expect(parsed).toEqual([
      expect.objectContaining({
        path: 'docs/development-rules.md',
        kind: 'doc',
        start_line: 1,
        end_line: 3,
      }),
    ])
  })

  it('finds commits by kind', async () => {
    const { deps } = setup()
    const result = await runCli(['search', 'captcha', '--kind', 'commit'], deps)
    expect(result.stdout).toContain('commit:abcdef1')
    expect(result.stdout).toContain('feat: add captcha')
  })

  it('answers with lexical ranking and says so when the embedder fails', async () => {
    const failing: Embedder = {
      model: 'broken',
      embed: async () => Promise.reject(new Error('offline')),
    }
    const { deps } = setup(failing)
    const result = await runCli(['search', 'turnstile'], deps)
    expect(result.code).toBe(0)
    expect(result.stdout).toContain('semantic search unavailable')
    expect(result.stdout).toContain('turnstile.ts')
  })

  it('warns when only the query embedding fails', async () => {
    const inner = conceptEmbedder()
    const flaky: Embedder = {
      model: inner.model,
      embed: async (texts, role) =>
        role === 'query' ? Promise.reject(new Error('query failed')) : inner.embed(texts, role),
    }
    const { deps } = setup(flaky)
    const result = await runCli(['search', 'turnstile'], deps)
    expect(result.stdout).toContain('semantic search unavailable')
    expect(result.stdout).toContain('turnstile.ts')
  })

  it('reports when nothing matches', async () => {
    const { deps } = setup(null)
    const result = await runCli(['search', 'zzzzqqq'], deps)
    expect(result.code).toBe(0)
    expect(result.stdout).toContain('No results')
  })

  it('indexes and reports what changed', async () => {
    const { deps } = setup()
    const first = await runCli(['index'], deps)
    expect(first.stdout).toMatch(/2 files.*changed/)
    const again = await runCli(['index'], deps)
    expect(again.stdout).toContain('0 changed')
    const rebuilt = await runCli(['index', '--rebuild'], deps)
    expect(rebuilt.stdout).toContain('embedded')
  })

  it('reports the status with counts per kind and the model', async () => {
    const { deps } = setup()
    expect((await runCli(['status'], deps)).stdout).toContain('No index yet')
    await runCli(['index'], deps)
    const status = (await runCli(['status'], deps)).stdout
    expect(status).toContain('code: 1')
    expect(status).toContain('doc: 1')
    expect(status).toContain('commit: 1')
    expect(status).toContain('fake-concepts')
    expect(status).toContain('updated')
  })

  it('shows lexical only in the status without an embedder', async () => {
    const { deps } = setup(null)
    await runCli(['index'], deps)
    expect((await runCli(['status'], deps)).stdout).toContain('lexical only')
  })

  it('exits with 2 and a usage message on bad arguments', async () => {
    const { deps } = setup()
    const result = await runCli(['search'], deps)
    expect(result.code).toBe(2)
    expect(result.stderr).toContain('query')
  })
})
