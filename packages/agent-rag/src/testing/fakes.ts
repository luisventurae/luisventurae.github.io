import type { EmbedRole, Embedder, FileSource, IndexStore, RagIndex } from '../core/ports.ts'
import type { CommitInfo, SourceFile } from '../core/types.ts'

const CONCEPTS: Record<string, string[]> = {
  captcha: ['captcha', 'challenge', 'turnstile', 'validation', 'verify'],
  mail: ['mail', 'email', 'notification', 'send'],
  token: ['token', 'signer', 'hmac'],
}

/** Deterministic embedder that maps synonyms onto the same dimension. */
export function conceptEmbedder(): Embedder {
  const names = Object.keys(CONCEPTS)
  return {
    model: 'fake-concepts',
    embed: async (texts) =>
      texts.map((text) => {
        const words = text.toLowerCase().split(/[^a-z]+/)
        const vector = Float32Array.from(
          names.map((name) => words.filter((word) => CONCEPTS[name]?.includes(word)).length),
        )
        const norm = Math.hypot(...vector) || 1
        return vector.map((value) => value / norm)
      }),
  }
}

export function memoryStore(
  initial: RagIndex | null = null,
): IndexStore & { saved: RagIndex | null } {
  const store = {
    saved: initial,
    load: async () => store.saved,
    save: async (index: RagIndex) => {
      store.saved = index
    },
  }
  return store
}

export interface MutableSource extends FileSource {
  files: SourceFile[]
  commits: CommitInfo[]
}

export function memorySource(files: SourceFile[], commits: CommitInfo[] = []): MutableSource {
  const source: MutableSource = {
    files,
    commits,
    listFiles: async () => source.files,
    listCommits: async (limit) => source.commits.slice(0, limit),
  }
  return source
}

/** Wraps an embedder and records how many texts it embedded. */
export function countingEmbedder(inner: Embedder): Embedder & { embedded: number } {
  const counting = {
    model: inner.model,
    embedded: 0,
    embed: async (texts: string[], role: EmbedRole) => {
      counting.embedded += texts.length
      return inner.embed(texts, role)
    },
  }
  return counting
}
