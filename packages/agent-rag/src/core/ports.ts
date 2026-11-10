import type { Chunk, CommitInfo, SourceFile } from './types.ts'

export type EmbedRole = 'query' | 'passage'

export interface Embedder {
  /** Identifies the model; a different model invalidates stored vectors. */
  readonly model: string
  /** Returns one L2-normalised vector per text. */
  embed(texts: string[], role: EmbedRole): Promise<Float32Array[]>
}

export interface FileSource {
  listFiles(): Promise<SourceFile[]>
  listCommits(limit: number): Promise<CommitInfo[]>
}

export interface IndexedChunk extends Chunk {
  /** `null` while no embedding is available for this chunk (lexical search only). */
  vector: Float32Array | null
}

export interface RagIndex {
  model: string | null
  built_at: number
  /** Content hash per indexed file, to re-chunk only what changed. */
  file_hashes: Record<string, string>
  entries: IndexedChunk[]
}

export interface IndexStore {
  load(): Promise<RagIndex | null>
  save(index: RagIndex): Promise<void>
}

export interface Clock {
  now(): number
}
