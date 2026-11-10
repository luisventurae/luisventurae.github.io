import { createHash } from 'node:crypto'

import { chunkCommits } from './chunk-commit.ts'
import { chunkLines } from './chunk-lines.ts'
import { chunkMarkdown } from './chunk-markdown.ts'
import { chunkTypeScript } from './chunk-typescript.ts'
import type { Clock, Embedder, FileSource, IndexedChunk, IndexStore, RagIndex } from './ports.ts'
import type { Chunk, SourceFile } from './types.ts'

const DEFAULT_COMMIT_LIMIT = 200
const EMBED_BATCH = 32
const INDEXABLE = /\.(tsx?|md|astro|mjs|js|ya?ml|toml)$/
const EXCLUDED = /^(\.agents\/|\.claude\/|coverage\/)|(^|\/)package-lock\.json$/

export interface BuildDeps {
  source: FileSource
  store: IndexStore
  /** `null` builds a lexical-only index. */
  embedder: Embedder | null
  clock: Clock
}

export interface BuildOptions {
  rebuild?: boolean
  commit_limit?: number
}

export interface BuildStats {
  files_total: number
  /** Files that were added, edited or removed since the previous index. */
  files_changed: number
  chunks_embedded: number
  semantic: boolean
  warning: string | null
}

/** Builds or refreshes the index, re-chunking and re-embedding only what changed. */
export async function buildIndex(
  deps: BuildDeps,
  options: BuildOptions,
): Promise<{ index: RagIndex; stats: BuildStats }> {
  const previous = options.rebuild ? null : await deps.store.load()
  // Without an embedder, existing vectors are kept; a different model invalidates them.
  const keep_vectors =
    previous !== null && (deps.embedder === null || previous.model === deps.embedder.model)
  const known = groupByPath(previous?.entries ?? [])

  const files = (await deps.source.listFiles()).filter(isIndexable)
  const file_hashes: Record<string, string> = {}
  const entries: IndexedChunk[] = []
  let files_changed = 0
  for (const file of files) {
    const hash = hashOf(file.content)
    file_hashes[file.path] = hash
    const unchanged = previous?.file_hashes[file.path] === hash
    if (!unchanged) files_changed++
    const reused = unchanged ? (known.get(file.path) ?? []) : null
    entries.push(...(reused ?? chunkFile(file).map(withoutVector)))
  }
  files_changed += Object.keys(previous?.file_hashes ?? {}).filter(
    (path) => !(path in file_hashes),
  ).length

  const commit_chunks = chunkCommits(
    await deps.source.listCommits(options.commit_limit ?? DEFAULT_COMMIT_LIMIT),
  )
  const previous_by_id = new Map((previous?.entries ?? []).map((entry) => [entry.id, entry]))
  entries.push(
    ...commit_chunks.map((chunk) => previous_by_id.get(chunk.id) ?? withoutVector(chunk)),
  )

  if (!keep_vectors && previous) for (const entry of entries) entry.vector = null

  const embedding = await embedMissing(entries, deps.embedder)
  entries.sort((a, b) => a.path.localeCompare(b.path) || a.start_line - b.start_line)

  const index: RagIndex = {
    model: deps.embedder
      ? embedding.warning === null
        ? deps.embedder.model
        : null
      : (previous?.model ?? null),
    built_at: deps.clock.now(),
    file_hashes,
    entries,
  }
  await deps.store.save(index)
  return {
    index,
    stats: {
      files_total: files.length,
      files_changed,
      chunks_embedded: embedding.embedded,
      semantic: deps.embedder !== null && embedding.warning === null,
      warning: embedding.warning,
    },
  }
}

async function embedMissing(
  entries: IndexedChunk[],
  embedder: Embedder | null,
): Promise<{ embedded: number; warning: string | null }> {
  const missing = entries.filter((entry) => entry.vector === null)
  if (!embedder || missing.length === 0) return { embedded: 0, warning: null }
  let embedded = 0
  try {
    for (let from = 0; from < missing.length; from += EMBED_BATCH) {
      const batch = missing.slice(from, from + EMBED_BATCH)
      const vectors = await embedder.embed(
        batch.map((entry) => entry.text),
        'passage',
      )
      batch.forEach((entry, position) => {
        entry.vector = vectors[position] ?? null
      })
      embedded += batch.length
    }
    return { embedded, warning: null }
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    return { embedded, warning: `Embeddings unavailable (${reason}); using lexical search only.` }
  }
}

function isIndexable(file: SourceFile): boolean {
  return INDEXABLE.test(file.path) && !EXCLUDED.test(file.path)
}

function chunkFile(file: SourceFile): Chunk[] {
  if (/\.tsx?$/.test(file.path)) return chunkTypeScript(file)
  if (file.path.endsWith('.md')) return chunkMarkdown(file)
  return chunkLines(file)
}

function withoutVector(chunk: Chunk): IndexedChunk {
  return { ...chunk, vector: null }
}

function groupByPath(entries: IndexedChunk[]): Map<string, IndexedChunk[]> {
  const groups = new Map<string, IndexedChunk[]>()
  for (const entry of entries) groups.set(entry.path, [...(groups.get(entry.path) ?? []), entry])
  return groups
}

function hashOf(content: string): string {
  return createHash('sha1').update(content).digest('hex')
}
