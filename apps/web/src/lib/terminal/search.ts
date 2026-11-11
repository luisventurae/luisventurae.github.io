import { SearchIndexSchema, type DocumentChunk, type Locale } from '@portfolio/shared'
import MiniSearch from 'minisearch'

export interface SearchResult {
  id: string
  source: string
  title: string
  excerpt: string
}

const MAX_RESULTS = 3
const EXCERPT_LENGTH = 160

/**
 * Validates the fetched `search-index.json` against the shared zod contract. A payload that
 * breaks it yields an empty index, so the terminal answers "no results" instead of crashing.
 */
export function parseSearchIndex(json: unknown): DocumentChunk[] {
  const parsed = SearchIndexSchema.safeParse(json)
  return parsed.success ? parsed.data : []
}

/** Offline full-text search over the prebuilt chunks. */
export function createSearch(
  chunks: DocumentChunk[],
): (query: string, locale: Locale) => SearchResult[] {
  const index = new MiniSearch<DocumentChunk>({
    fields: ['text', 'title'],
    storeFields: ['source', 'title', 'text', 'locale'],
    searchOptions: { prefix: true, fuzzy: 0.2, boost: { title: 2 } },
  })
  index.addAll(chunks)
  const by_id = new Map(chunks.map((chunk) => [chunk.id, chunk]))

  return (query, locale) =>
    index
      .search(query, { filter: (result) => result['locale'] === locale })
      .slice(0, MAX_RESULTS)
      .flatMap((result) => {
        const chunk = by_id.get(String(result.id))
        if (!chunk) return []
        return [
          { id: chunk.id, source: chunk.source, title: chunk.title, excerpt: excerpt(chunk.text) },
        ]
      })
}

function excerpt(text: string): string {
  const body = text.split('\n').slice(1).join(' ').trim()
  return body.length > EXCERPT_LENGTH ? `${body.slice(0, EXCERPT_LENGTH).trimEnd()}…` : body
}
