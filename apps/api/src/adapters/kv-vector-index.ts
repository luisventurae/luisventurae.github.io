import { IndexedChunkSchema } from '@portfolio/shared'
import { z } from 'zod'

import type { VectorIndex, VectorIndexRepository } from '../core/ports'
import type { KvLike } from './kv-rate-limiter'

const INDEX_KEY = 'rag:index'
const VectorIndexSchema = z.object({ model: z.string(), chunks: z.array(IndexedChunkSchema) })

/** Whole index stored as one KV value: a single put keeps replacement atomic. */
export function createKvVectorIndex(kv: KvLike): VectorIndexRepository {
  return {
    async load(): Promise<VectorIndex | null> {
      const raw = await kv.get(INDEX_KEY)
      if (!raw) return null
      const parsed = VectorIndexSchema.safeParse(JSON.parse(raw))
      return parsed.success ? parsed.data : null
    },
    async save(index: VectorIndex): Promise<void> {
      await kv.put(INDEX_KEY, JSON.stringify(index))
    },
  }
}
