import type { Chunk, SourceFile } from './types.ts'

const MAX_LINES = 60
const OVERLAP_LINES = 8

/** Fallback for files without a parser (.astro, .mjs, config): overlapping line windows. */
export function chunkLines(file: SourceFile): Chunk[] {
  const lines = file.content.replace(/\n+$/, '').split('\n')
  if (lines.every((line) => line.trim() === '')) return []
  const chunks: Chunk[] = []
  const step = MAX_LINES - OVERLAP_LINES
  for (let from = 0; from < lines.length; from += step) {
    const to = Math.min(from + MAX_LINES, lines.length)
    chunks.push({
      id: `${file.path}:${from + 1}`,
      path: file.path,
      kind: 'code',
      symbol: null,
      start_line: from + 1,
      end_line: to,
      text: `${file.path}\n${lines.slice(from, to).join('\n')}`,
    })
    if (to >= lines.length) break
  }
  return chunks
}
