import MiniSearch from 'minisearch'

import type { Embedder, IndexedChunk, RagIndex } from './ports.ts'
import { tokenize } from './tokenize.ts'
import type { ChunkKind } from './types.ts'

const DEFAULT_RESULTS = 8
const CANDIDATES = 50
const RRF_CONSTANT = 60
const ARCHIVE_WEIGHT = 0.7
const EXCERPT_LINES = 4
const EXCERPT_WIDTH = 140

export interface SearchOptions {
  k?: number
  kind?: ChunkKind
}

export interface SearchResult {
  path: string
  start_line: number
  end_line: number
  kind: ChunkKind
  symbol: string | null
  score: number
  excerpt: string
}

export interface SearchOutcome {
  results: SearchResult[]
  /** `false` when only lexical ranking was available. */
  semantic: boolean
}

/** Hybrid search: BM25 and embedding similarity fused with Reciprocal Rank Fusion. */
export async function searchIndex(
  index: RagIndex,
  query: string,
  options: SearchOptions,
  embedder: Embedder | null,
): Promise<SearchOutcome> {
  const entries = options.kind
    ? index.entries.filter((entry) => entry.kind === options.kind)
    : index.entries
  const lexical = rankLexical(entries, query)
  const semantic = await rankSemantic(entries, query, embedder)
  const fused = new Map<string, number>()
  for (const ranking of [lexical, semantic.ranking]) {
    ranking.forEach((id, position) => {
      fused.set(id, (fused.get(id) ?? 0) + 1 / (RRF_CONSTANT + position + 1))
    })
  }

  const by_id = new Map(entries.map((entry) => [entry.id, entry]))
  const results = [...fused]
    .flatMap(([id, score]) => {
      const entry = by_id.get(id)
      return entry ? [toResult(entry, score * weightOf(entry))] : []
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, options.k ?? DEFAULT_RESULTS)
  return { results, semantic: semantic.available }
}

function rankLexical(entries: IndexedChunk[], query: string): string[] {
  const engine = new MiniSearch<{ id: string; symbol: string; path: string; text: string }>({
    fields: ['symbol', 'path', 'text'],
    tokenize,
    searchOptions: { boost: { symbol: 2, path: 1.5 }, combineWith: 'OR' },
  })
  engine.addAll(
    entries.map((entry) => ({
      id: entry.id,
      symbol: entry.symbol ?? '',
      path: entry.path,
      text: entry.text,
    })),
  )
  return engine
    .search(query)
    .slice(0, CANDIDATES)
    .map((hit) => String(hit.id))
}

async function rankSemantic(
  entries: IndexedChunk[],
  query: string,
  embedder: Embedder | null,
): Promise<{ ranking: string[]; available: boolean }> {
  if (!embedder) return { ranking: [], available: false }
  try {
    const [query_vector] = await embedder.embed([query], 'query')
    if (!query_vector) return { ranking: [], available: false }
    const ranking = entries
      .flatMap((entry) =>
        entry.vector ? [{ id: entry.id, similarity: dot(query_vector, entry.vector) }] : [],
      )
      .filter((item) => item.similarity > 0)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, CANDIDATES)
      .map((item) => item.id)
    return { ranking, available: true }
  } catch {
    return { ranking: [], available: false }
  }
}

function dot(a: Float32Array, b: Float32Array): number {
  let total = 0
  for (let position = 0; position < Math.min(a.length, b.length); position++) {
    total += (a[position] ?? 0) * (b[position] ?? 0)
  }
  return total
}

function weightOf(entry: IndexedChunk): number {
  return entry.path.startsWith('openspec/changes/archive/') ? ARCHIVE_WEIGHT : 1
}

function toResult(entry: IndexedChunk, score: number): SearchResult {
  return {
    path: entry.path,
    start_line: entry.start_line,
    end_line: entry.end_line,
    kind: entry.kind,
    symbol: entry.symbol,
    score,
    excerpt: excerptOf(entry.text),
  }
}

/** First lines of the body, without the `path › symbol` header that every chunk carries. */
function excerptOf(text: string): string {
  return text
    .split('\n')
    .slice(1)
    .filter((line) => line.trim() !== '')
    .slice(0, EXCERPT_LINES)
    .map((line) => (line.length > EXCERPT_WIDTH ? `${line.slice(0, EXCERPT_WIDTH)}…` : line))
    .join('\n')
}
