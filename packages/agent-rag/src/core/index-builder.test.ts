import { describe, expect, it } from 'vitest'

import { buildIndex } from './index-builder'
import type { Embedder } from './ports'
import { conceptEmbedder, countingEmbedder, memorySource, memoryStore } from '../testing/fakes'

const files = [
  { path: 'apps/api/src/turnstile.ts', content: 'export function verify(): void {}\n' },
  { path: 'docs/README.md', content: '# Docs\n\nTexto del índice.\n' },
  { path: 'apps/web/src/Page.astro', content: '<h1>Hola</h1>\n' },
  { path: 'package-lock.json', content: '{}' },
  { path: '.agents/skills/x/SKILL.md', content: '# Skill\n\ntexto\n' },
  { path: 'logo.png', content: 'binary' },
]
const commits = [
  { hash: 'aaaaaaa1111', subject: 'feat: one', body: '', files: ['a.ts'] },
  { hash: 'bbbbbbb2222', subject: 'fix: two', body: '', files: ['b.ts'] },
]
const clock = { now: () => 1000 }

function setup(custom?: Embedder | null) {
  const counter = countingEmbedder(conceptEmbedder())
  const embedder = custom === undefined ? counter : custom
  const source = memorySource(structuredClone(files), commits)
  const store = memoryStore()
  const run = (options: { rebuild?: boolean; commit_limit?: number } = {}) =>
    buildIndex({ source, store, embedder, clock }, options)
  return { source, store, run, counter }
}

describe('buildIndex', () => {
  it('indexes code, docs and commits and skips lockfiles, agent skills and binaries', async () => {
    const { run, store } = setup()
    const { stats } = await run()
    const paths = new Set(store.saved?.entries.map((entry) => entry.path))
    expect([...paths].sort()).toEqual([
      'apps/api/src/turnstile.ts',
      'apps/web/src/Page.astro',
      'commit:aaaaaaa',
      'commit:bbbbbbb',
      'docs/README.md',
    ])
    expect(stats).toMatchObject({ files_changed: 3, semantic: true, warning: null })
    expect(store.saved?.model).toBe('fake-concepts')
    expect(store.saved?.built_at).toBe(1000)
  })

  it('does not embed anything when nothing changed', async () => {
    const { run, counter } = setup()
    await run()
    const before = counter.embedded
    const { stats } = await run()
    expect(stats).toMatchObject({ files_changed: 0, chunks_embedded: 0 })
    expect(counter.embedded).toBe(before)
  })

  it('re-chunks only edited files and drops removed ones', async () => {
    const { run, source, store } = setup()
    await run()
    source.files = source.files
      .filter((file) => file.path !== 'docs/README.md')
      .map((file) =>
        file.path === 'apps/api/src/turnstile.ts'
          ? { ...file, content: 'export function verify(): void {}\nexport const NEW = 1\n' }
          : file,
      )
    const { stats } = await run()
    expect(stats.files_changed).toBe(2)
    const paths = store.saved?.entries.map((entry) => entry.path) ?? []
    expect(paths).not.toContain('docs/README.md')
    expect(
      store.saved?.entries.filter((entry) => entry.path.endsWith('turnstile.ts')),
    ).toHaveLength(2)
    expect(stats.chunks_embedded).toBe(2)
  })

  it('re-embeds everything on rebuild or when the model changes', async () => {
    const { run, store } = setup()
    await run()
    const total = store.saved?.entries.length ?? 0
    expect((await run({ rebuild: true })).stats.chunks_embedded).toBe(total)

    const other: Embedder = { ...conceptEmbedder(), model: 'other-model' }
    const source = memorySource(structuredClone(files), commits)
    const changed = await buildIndex({ source, store, embedder: other, clock }, {})
    expect(changed.stats.chunks_embedded).toBe(total)
    expect(store.saved?.model).toBe('other-model')
  })

  it('keeps going without vectors when the embedder fails, then fills them later', async () => {
    const failing: Embedder = {
      model: 'broken',
      embed: async () => Promise.reject(new Error('model download failed')),
    }
    const { source, store } = setup()
    const first = await buildIndex({ source, store, embedder: failing, clock }, {})
    expect(first.stats.semantic).toBe(false)
    expect(first.stats.warning).toContain('model download failed')
    expect(store.saved?.entries.every((entry) => entry.vector === null)).toBe(true)

    const second = await buildIndex({ source, store, embedder: conceptEmbedder(), clock }, {})
    expect(second.stats).toMatchObject({ files_changed: 0, semantic: true })
    expect(second.stats.chunks_embedded).toBe(store.saved?.entries.length)
    expect(store.saved?.entries.every((entry) => entry.vector !== null)).toBe(true)
  })

  it('indexes lexically when there is no embedder', async () => {
    const { run, store } = setup(null)
    const { stats } = await run()
    expect(stats).toMatchObject({ semantic: false, warning: null, chunks_embedded: 0 })
    expect(store.saved?.model).toBeNull()
  })

  it('keeps existing vectors when a later run has no embedder, and fills the new chunks later', async () => {
    const { source, store } = setup()
    await buildIndex({ source, store, embedder: conceptEmbedder(), clock }, {})
    source.files = source.files.map((file) =>
      file.path === 'docs/README.md' ? { ...file, content: '# Docs\n\nNuevo texto.\n' } : file,
    )
    await buildIndex({ source, store, embedder: null, clock }, {})
    expect(store.saved?.model).toBe('fake-concepts')
    const without = store.saved?.entries.filter((entry) => entry.vector === null) ?? []
    expect(without.map((entry) => entry.path)).toEqual(['docs/README.md'])

    const counter = countingEmbedder(conceptEmbedder())
    const { stats } = await buildIndex({ source, store, embedder: counter, clock }, {})
    expect(stats.chunks_embedded).toBe(1)
    expect(store.saved?.entries.every((entry) => entry.vector !== null)).toBe(true)
  })

  it('limits commits and replaces ones that disappeared', async () => {
    const { run, source, store } = setup()
    await run({ commit_limit: 1 })
    expect(store.saved?.entries.filter((entry) => entry.kind === 'commit')).toHaveLength(1)
    source.commits = [{ hash: 'ccccccc3333', subject: 'chore: three', body: '', files: [] }]
    await run({ commit_limit: 5 })
    const ids = store.saved?.entries.filter((entry) => entry.kind === 'commit').map((e) => e.id)
    expect(ids).toEqual(['commit:ccccccc'])
  })
})
