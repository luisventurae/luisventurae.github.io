import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import type { RagIndex } from '../core/ports'
import { createJsonIndexStore } from './json-index-store'

let dir = ''
beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'agent-rag-store-'))
})
afterEach(async () => {
  await rm(dir, { recursive: true, force: true })
})

const index: RagIndex = {
  model: 'm',
  built_at: 42,
  file_hashes: { 'a.ts': 'h1' },
  entries: [
    {
      id: 'a.ts:1',
      path: 'a.ts',
      kind: 'code',
      symbol: 'a',
      start_line: 1,
      end_line: 2,
      text: 'a.ts › a\nx',
      vector: Float32Array.from([0.5, -0.25, 1]),
    },
    {
      id: 'b.md:1',
      path: 'b.md',
      kind: 'doc',
      symbol: null,
      start_line: 1,
      end_line: 1,
      text: 'b',
      vector: null,
    },
  ],
}

describe('createJsonIndexStore', () => {
  it('round-trips the index including vectors', async () => {
    const store = createJsonIndexStore(join(dir, 'nested', 'index.json'))
    await store.save(index)
    const loaded = await store.load()
    expect(loaded).toMatchObject({ model: 'm', built_at: 42, file_hashes: { 'a.ts': 'h1' } })
    expect(Array.from(loaded?.entries[0]?.vector ?? [])).toEqual([0.5, -0.25, 1])
    expect(loaded?.entries[1]?.vector).toBeNull()
  })

  it('returns null when the file is missing, corrupt or from another version', async () => {
    const path = join(dir, 'index.json')
    const store = createJsonIndexStore(path)
    expect(await store.load()).toBeNull()
    await writeFile(path, '{not json')
    expect(await store.load()).toBeNull()
    await writeFile(path, JSON.stringify({ version: 999, entries: [] }))
    expect(await store.load()).toBeNull()
  })

  it('writes atomically without leaving temporary files', async () => {
    const path = join(dir, 'index.json')
    await createJsonIndexStore(path).save(index)
    expect(JSON.parse(await readFile(path, 'utf8'))).toMatchObject({ version: 1 })
    const { readdir } = await import('node:fs/promises')
    expect(await readdir(dir)).toEqual(['index.json'])
  })
})
