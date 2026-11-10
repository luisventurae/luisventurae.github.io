import { AskStreamEventSchema, type AskRequest, type AskStreamEvent } from '@portfolio/shared'

/** The question-answering service is not reachable (production, or no local index). */
export class RagUnavailableError extends Error {
  constructor() {
    super('rag_unavailable')
    this.name = 'RagUnavailableError'
  }
}

/** Streams NDJSON events from POST /rag/ask. */
export async function* askStream(
  api_url: string,
  body: AskRequest,
  fetcher: typeof fetch = fetch,
): AsyncGenerator<AskStreamEvent> {
  let response: Response
  try {
    response = await fetcher(`${api_url.replace(/\/$/, '')}/rag/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new RagUnavailableError()
  }
  if (!response.ok || !response.body) throw new RagUnavailableError()

  for await (const line of readLines(response.body)) {
    const parsed = safeParse(line)
    if (!parsed) continue
    if (parsed.type === 'error' && parsed.code === 'not_found') throw new RagUnavailableError()
    yield parsed
  }
}

function safeParse(line: string): AskStreamEvent | null {
  try {
    const parsed = AskStreamEventSchema.safeParse(JSON.parse(line))
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}

async function* readLines(body: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  const reader = body
    .pipeThrough<string>(
      new TextDecoderStream() as unknown as ReadableWritablePair<string, Uint8Array>,
    )
    .getReader()
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
