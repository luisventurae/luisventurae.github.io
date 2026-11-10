import type { Locale } from './locale'
import type { DocumentChunk } from './rag'

export interface ChunkInput {
  markdown: string
  locale: Locale
  source: string
  title: string
  max_words?: number
  overlap_words?: number
}

interface Section {
  heading: string | null
  body: string
}

const DEFAULT_MAX_WORDS = 350
const DEFAULT_OVERLAP_WORDS = 50

/**
 * Splits markdown into retrieval-sized chunks: one per `##`/`###` section, and long
 * sections into overlapping word windows. Each chunk is prefixed with its title and
 * heading so it stays meaningful on its own.
 */
export function chunkMarkdown(input: ChunkInput): DocumentChunk[] {
  const max_words = input.max_words ?? DEFAULT_MAX_WORDS
  const overlap_words = input.overlap_words ?? DEFAULT_OVERLAP_WORDS
  const texts = splitSections(input.markdown).flatMap((section) => {
    const body = stripMarkdown(section.body)
    if (body.length === 0) return []
    const prefix = section.heading ? `${input.title} — ${section.heading}` : input.title
    return windowWords(body, max_words, overlap_words).map((window) => `${prefix}\n${window}`)
  })

  return texts.map((text, position) => ({
    id: `${input.locale}:${input.source}:${position}`,
    text,
    locale: input.locale,
    source: input.source,
    title: input.title,
  }))
}

function splitSections(markdown: string): Section[] {
  const sections: Section[] = [{ heading: null, body: '' }]
  for (const line of markdown.split('\n')) {
    const heading_match = /^#{1,3}\s+(.+)$/.exec(line)
    if (heading_match?.[1]) {
      sections.push({ heading: heading_match[1].trim(), body: '' })
      continue
    }
    const current = sections.at(-1)
    if (current) current.body += `${line}\n`
  }
  return sections
}

function stripMarkdown(text: string): string {
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>]/g, '')
    .replace(/^\s*[-+]\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function windowWords(text: string, max_words: number, overlap_words: number): string[] {
  const words = text.split(' ')
  if (words.length <= max_words) return [text]

  const step = Math.max(1, max_words - overlap_words)
  const windows: string[] = []
  for (let start = 0; start < words.length; start += step) {
    windows.push(words.slice(start, start + max_words).join(' '))
    if (start + max_words >= words.length) break
  }
  return windows
}
