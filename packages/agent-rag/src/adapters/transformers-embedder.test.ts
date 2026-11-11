import { describe, expect, it, vi } from 'vitest'

import { createTransformersEmbedder, type FeatureExtractor } from './transformers-embedder'

function fakeExtractor(): FeatureExtractor & { calls: string[][] } {
  const extractor = Object.assign(
    async (texts: string[]) => {
      extractor.calls.push(texts)
      return {
        data: Float32Array.from(texts.flatMap((_, row) => [row + 1, 0, 0])),
        dims: [texts.length, 3],
      }
    },
    { calls: [] as string[][] },
  )
  return extractor
}

describe('createTransformersEmbedder', () => {
  it('prefixes texts by role and returns one vector per text', async () => {
    const extractor = fakeExtractor()
    const embedder = createTransformersEmbedder({ load: async () => extractor })
    const vectors = await embedder.embed(['uno', 'dos'], 'passage')
    expect(extractor.calls).toEqual([['passage: uno', 'passage: dos']])
    expect(vectors.map((vector) => Array.from(vector))).toEqual([
      [1, 0, 0],
      [2, 0, 0],
    ])
    await embedder.embed(['pregunta'], 'query')
    expect(extractor.calls[1]).toEqual(['query: pregunta'])
  })

  it('loads the model once, lazily', async () => {
    const load = vi.fn(async () => fakeExtractor())
    const embedder = createTransformersEmbedder({ load })
    expect(load).not.toHaveBeenCalled()
    await embedder.embed(['a'], 'query')
    await embedder.embed(['b'], 'query')
    expect(load).toHaveBeenCalledTimes(1)
  })

  it('exposes the model name and propagates load failures', async () => {
    const embedder = createTransformersEmbedder({
      model: 'org/model',
      load: async () => Promise.reject(new Error('offline')),
    })
    expect(embedder.model).toBe('org/model')
    await expect(embedder.embed(['a'], 'query')).rejects.toThrow('offline')
  })
})
