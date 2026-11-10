import { z } from 'zod'

import { ApiErrorCodeSchema } from './errors'
import { LocaleSchema } from './locale'

export const RAG_MAX_QUESTION_LENGTH = 500
export const RAG_MAX_BODY_BYTES = 2 * 1024
export const RAG_MAX_INDEX_CHUNKS = 2000

export const AskRequestSchema = z.strictObject({
  question: z.string().trim().min(1).max(RAG_MAX_QUESTION_LENGTH),
  locale: LocaleSchema,
})
export type AskRequest = z.infer<typeof AskRequestSchema>

export const RagSourceSchema = z.object({
  source: z.string().min(1),
  title: z.string().min(1),
  locale: LocaleSchema,
})
export type RagSource = z.infer<typeof RagSourceSchema>

/** The `/rag/ask` response is NDJSON: one event per line. */
export const AskStreamEventSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('token'), text: z.string() }),
  z.object({ type: z.literal('sources'), sources: z.array(RagSourceSchema) }),
  z.object({ type: z.literal('done') }),
  z.object({ type: z.literal('error'), code: ApiErrorCodeSchema }),
])
export type AskStreamEvent = z.infer<typeof AskStreamEventSchema>

export const DocumentChunkSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  locale: LocaleSchema,
  source: z.string().min(1),
  title: z.string().min(1),
})
export type DocumentChunk = z.infer<typeof DocumentChunkSchema>

export const IndexedChunkSchema = DocumentChunkSchema.extend({
  embedding: z.array(z.number()).min(1),
})
export type IndexedChunk = z.infer<typeof IndexedChunkSchema>

export const IndexRequestSchema = z.strictObject({
  model: z.string().min(1),
  chunks: z.array(IndexedChunkSchema).min(1).max(RAG_MAX_INDEX_CHUNKS),
})
export type IndexRequest = z.infer<typeof IndexRequestSchema>

export const IndexResponseSchema = z.object({ indexed: z.number().int().nonnegative() })
export type IndexResponse = z.infer<typeof IndexResponseSchema>
