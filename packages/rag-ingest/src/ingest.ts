import {
  DocumentChunkSchema,
  IndexResponseSchema,
  type DocumentChunk,
  type IndexedChunk,
  type IndexResponse,
} from '@portfolio/shared'
import { z } from 'zod'

const EMBED_BATCH_SIZE = 16
const EmbedResponseSchema = z.object({ embeddings: z.array(z.array(z.number())) })

export interface IngestConfig {
  web_url: string
  api_url: string
  ollama_host: string
  model: string
}

export function batches<T>(items: T[], size: number): T[][] {
  const groups: T[][] = []
  for (let start = 0; start < items.length; start += size)
    groups.push(items.slice(start, start + size))
  return groups
}

export async function fetchChunks(
  web_url: string,
  fetcher: typeof fetch = fetch,
): Promise<DocumentChunk[]> {
  const response = await fetcher(`${trimSlash(web_url)}/search-index.json`)
  if (!response.ok) throw new Error(`search_index_${response.status}`)
  return z.array(DocumentChunkSchema).parse(await response.json())
}

export async function embedChunks(
  chunks: DocumentChunk[],
  embed: (texts: string[]) => Promise<number[][]>,
  batch_size = EMBED_BATCH_SIZE,
): Promise<IndexedChunk[]> {
  const indexed: IndexedChunk[] = []
  for (const group of batches(chunks, batch_size)) {
    const embeddings = await embed(group.map((chunk) => chunk.text))
    if (embeddings.length !== group.length) throw new Error('embedding_count_mismatch')
    group.forEach((chunk, index) => indexed.push({ ...chunk, embedding: embeddings[index] ?? [] }))
  }
  return indexed
}

/** Fetches the site's search index, embeds every chunk with Ollama and uploads it to the API. */
export async function runIngest(
  config: IngestConfig,
  fetcher: typeof fetch = fetch,
): Promise<IndexResponse> {
  const chunks = await fetchChunks(config.web_url, fetcher)
  const embed = async (texts: string[]): Promise<number[][]> => {
    const response = await fetcher(`${trimSlash(config.ollama_host)}/api/embed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: config.model, input: texts }),
    })
    if (!response.ok) throw new Error(`ollama_embed_${response.status}`)
    return EmbedResponseSchema.parse(await response.json()).embeddings
  }
  const indexed = await embedChunks(chunks, embed)
  const response = await fetcher(`${trimSlash(config.api_url)}/rag/index`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: config.model, chunks: indexed }),
  })
  if (!response.ok) throw new Error(`rag_index_${response.status}`)
  return IndexResponseSchema.parse(await response.json())
}

function trimSlash(url: string): string {
  return url.replace(/\/$/, '')
}
