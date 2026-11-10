import { z } from 'zod'

import type { ChatMessage, ChatModel, EmbeddingProvider } from '../core/ports'

const EmbedResponseSchema = z.object({ embeddings: z.array(z.array(z.number())) })
const ChatLineSchema = z.object({
  message: z.object({ content: z.string() }).optional(),
  done: z.boolean().optional(),
})

export interface OllamaOptions {
  host: string
  model: string
  fetcher?: typeof fetch
}

/** Ollama /api/embed adapter (local only). */
export function createOllamaEmbeddings({
  host,
  model,
  fetcher = fetch,
}: OllamaOptions): EmbeddingProvider {
  return {
    async embed(texts: string[]): Promise<number[][]> {
      const response = await fetcher(`${host.replace(/\/$/, '')}/api/embed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, input: texts }),
      })
      if (!response.ok) throw new Error(`ollama_embed_${response.status}`)
      return EmbedResponseSchema.parse(await response.json()).embeddings
    },
  }
}

/** Ollama /api/chat adapter that yields content fragments from the NDJSON stream. */
export function createOllamaChat({ host, model, fetcher = fetch }: OllamaOptions): ChatModel {
  return {
    async *stream(messages: ChatMessage[]): AsyncIterable<string> {
      const response = await fetcher(`${host.replace(/\/$/, '')}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages,
          stream: true,
          think: false,
          options: { temperature: 0.2 },
        }),
      })
      if (!response.ok || !response.body) throw new Error(`ollama_chat_${response.status}`)
      for await (const line of readLines(response.body)) {
        const parsed = ChatLineSchema.safeParse(JSON.parse(line))
        if (!parsed.success) continue
        if (parsed.data.message?.content) yield parsed.data.message.content
        if (parsed.data.done) return
      }
    },
  }
}

async function* readLines(body: ReadableStream<Uint8Array>): AsyncIterable<string> {
  const reader = body.pipeThrough(new TextDecoderStream()).getReader()
  let buffer = ''
  for (;;) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += value
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) if (line.trim()) yield line
  }
  if (buffer.trim()) yield buffer
}
