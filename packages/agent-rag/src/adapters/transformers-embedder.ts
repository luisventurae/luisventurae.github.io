import type { Embedder } from '../core/ports.ts'

const DEFAULT_MODEL = 'Xenova/multilingual-e5-small'

/** The slice of the transformers.js feature-extraction pipeline that this adapter uses. */
export type FeatureExtractor = (
  texts: string[],
  options?: { pooling: 'mean'; normalize: boolean },
) => Promise<{ data: Float32Array | number[]; dims: number[] }>

export interface TransformersEmbedderOptions {
  model?: string
  /** Where downloaded model files are cached. */
  cache_dir?: string
  /** Replaces the real model loader (tests). */
  load?: () => Promise<FeatureExtractor>
}

/** Local in-process embeddings (e5 models want `query:` / `passage:` prefixes). */
export function createTransformersEmbedder(options: TransformersEmbedderOptions = {}): Embedder {
  const model = options.model ?? DEFAULT_MODEL
  const load = options.load ?? (() => loadPipeline(model, options.cache_dir))
  let extractor: Promise<FeatureExtractor> | undefined

  return {
    model,
    async embed(texts, role) {
      extractor ??= load()
      const output = await (
        await extractor
      )(
        texts.map((text) => `${role}: ${text}`),
        { pooling: 'mean', normalize: true },
      )
      const width = output.dims[1] ?? 0
      const data = Float32Array.from(output.data)
      return texts.map((_, row) => data.slice(row * width, (row + 1) * width))
    },
  }
}

async function loadPipeline(model: string, cache_dir?: string): Promise<FeatureExtractor> {
  const { env, pipeline } = await import('@huggingface/transformers')
  if (cache_dir) env.cacheDir = cache_dir
  const extractor = await pipeline('feature-extraction', model, { dtype: 'q8' })
  return async (texts, options) => {
    const tensor = await extractor(texts, options)
    // Embedding models of this pipeline always produce float32 data.
    return { data: Float32Array.from(tensor.data as Float32Array), dims: tensor.dims }
  }
}
