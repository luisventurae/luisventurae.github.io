import { describe, expect, it } from 'vitest'

import { createKvVectorIndex } from './kv-vector-index'

function memoryKv() {
  const store = new Map<string, string>()
  return {
    store,
    get: async (key: string) => store.get(key) ?? null,
    put: async (key: string, value: string) => void store.set(key, value),
  }
}

const index = {
  model: 'bge-m3',
  chunks: [
    {
      id: 'es:profile:0',
      text: 'Hola',
      locale: 'es' as const,
      source: 'profile',
      title: 'Perfil',
      embedding: [1, 0],
    },
  ],
}

describe('createKvVectorIndex', () => {
  it('saves and loads the index', async () => {
    const repository = createKvVectorIndex(memoryKv())
    expect(await repository.load()).toBeNull()
    await repository.save(index)
    expect(await repository.load()).toEqual(index)
  })

  it('ignores corrupted values', async () => {
    const kv = memoryKv()
    kv.store.set('rag:index', JSON.stringify({ model: 1 }))
    expect(await createKvVectorIndex(kv).load()).toBeNull()
  })
})
