import type { RagIndex } from '../core/ports.ts'
import type { SearchResult } from '../core/search.ts'
import type { ChunkKind } from '../core/types.ts'

const KIND_ORDER: ChunkKind[] = ['code', 'test', 'doc', 'spec', 'commit']

export function formatResults(
  query: string,
  results: SearchResult[],
  unavailable_reason: string | null,
): string {
  const lines: string[] = []
  if (unavailable_reason !== null) {
    lines.push(`⚠ semantic search unavailable — ${unavailable_reason}`)
  }
  if (results.length === 0) {
    lines.push(`No results for "${query}".`)
    return lines.join('\n')
  }
  results.forEach((result, position) => {
    const symbol = result.symbol ? `  ${result.symbol}` : ''
    lines.push(
      `${position + 1}. ${locationOf(result)}  [${result.kind}]${symbol}  ${result.score.toFixed(4)}`,
    )
    for (const line of result.excerpt.split('\n')) lines.push(`     ${line}`)
  })
  return lines.join('\n')
}

export function formatJson(results: SearchResult[]): string {
  return JSON.stringify(results, null, 2)
}

export function formatStatus(index: RagIndex | null, now: number): string {
  if (!index) return 'No index yet. Run: npm run rag -- index'
  const counts = KIND_ORDER.map(
    (kind) => [kind, index.entries.filter((entry) => entry.kind === kind).length] as const,
  ).filter(([, count]) => count > 0)
  const age = Math.max(0, Math.round((now - index.built_at) / 1000))
  return [
    `Index: ${index.entries.length} chunks from ${Object.keys(index.file_hashes).length} files`,
    ...counts.map(([kind, count]) => `  ${kind}: ${count}`),
    `Model: ${index.model ?? 'lexical only'}`,
    `Index updated ${age}s ago`,
  ].join('\n')
}

function locationOf(result: SearchResult): string {
  return result.kind === 'commit'
    ? result.path
    : `${result.path}:${result.start_line}-${result.end_line}`
}
