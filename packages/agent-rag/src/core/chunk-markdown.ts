import type { Chunk, ChunkKind, SourceFile } from './types.ts'

const MAX_LINES = 60
const OVERLAP_LINES = 8
const HEADING = /^(#{1,3})\s+(.+?)\s*$/

interface Section {
  symbol: string
  start_line: number
  lines: string[]
}

/** Splits Markdown into one chunk per `#`–`###` section, keeping line ranges. */
export function chunkMarkdown(file: SourceFile): Chunk[] {
  const kind: ChunkKind = file.path.startsWith('openspec/') ? 'spec' : 'doc'
  return splitSections(file.content).flatMap((section) => {
    const last_content = section.lines.findLastIndex((line) => line.trim() !== '')
    const has_body = section.lines.slice(1).some((line) => line.trim() !== '')
    if (!has_body) return []
    const lines = section.lines.slice(0, last_content + 1)
    return windows(lines.length).map(({ from, to }) => {
      const start_line = section.start_line + from
      return {
        id: `${file.path}:${start_line}`,
        path: file.path,
        kind,
        symbol: section.symbol,
        start_line,
        end_line: section.start_line + to - 1,
        text: `${file.path} › ${section.symbol}\n${lines.slice(from, to).join('\n')}`,
      }
    })
  })
}

function splitSections(content: string): Section[] {
  const sections: Section[] = []
  const trail: string[] = []
  let in_fence = false
  let current: Section = { symbol: '', start_line: 1, lines: [] }
  content.split('\n').forEach((line, index) => {
    if (line.trimStart().startsWith('```')) in_fence = !in_fence
    const match = in_fence ? null : HEADING.exec(line)
    if (match?.[1] && match[2]) {
      sections.push(current)
      trail.length = match[1].length - 1
      trail[match[1].length - 1] = match[2]
      current = { symbol: trail.filter(Boolean).join(' › '), start_line: index + 1, lines: [line] }
      return
    }
    current.lines.push(line)
  })
  sections.push(current)
  return sections.filter((section) => section.symbol !== '')
}

function windows(total: number): { from: number; to: number }[] {
  if (total <= MAX_LINES) return [{ from: 0, to: total }]
  const result: { from: number; to: number }[] = []
  const step = MAX_LINES - OVERLAP_LINES
  for (let from = 0; from < total; from += step) {
    const to = Math.min(from + MAX_LINES, total)
    result.push({ from, to })
    if (to >= total) break
  }
  return result
}
