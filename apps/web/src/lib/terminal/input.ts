export interface ParsedCommand {
  name: string
  args: string[]
  /** Everything after the command name, untouched (for `search`). */
  rest: string
}

export function parseCommand(input: string): ParsedCommand {
  const trimmed = input.trim()
  const match = /^(\S+)\s*([\s\S]*)$/.exec(trimmed)
  if (!match) return { name: '', args: [], rest: '' }
  const rest = match[2] ?? ''
  return {
    name: (match[1] ?? '').toLowerCase(),
    args: rest.split(/\s+/).filter(Boolean),
    rest,
  }
}

export interface CompletionOptions {
  commands: string[]
  slugs: string[]
}

export interface Completion {
  value: string
  candidates: string[]
}

const FIXED_ARGUMENTS: Record<string, string[]> = {
  ls: ['projects'],
  theme: ['light', 'dark'],
  lang: ['es', 'en', 'fr'],
  skills: ['backend', 'frontend', 'other'],
}

/** Tab completion for command names and their first argument. */
export function completeInput(input: string, options: CompletionOptions): Completion {
  const space_index = input.indexOf(' ')
  if (space_index === -1) return completeWord(input, options.commands, (word) => `${word} `)

  const command = input.slice(0, space_index).toLowerCase()
  const partial = input.slice(space_index + 1).trimStart()
  const pool = command === 'cat' ? options.slugs : (FIXED_ARGUMENTS[command] ?? [])
  return completeWord(partial, pool, (word) => `${command} ${word}`, `${command} `)
}

function completeWord(
  partial: string,
  pool: string[],
  formatUnique: (word: string) => string,
  prefix = '',
): Completion {
  const candidates = pool.filter((word) => word.startsWith(partial.toLowerCase()))
  if (candidates.length === 0) return { value: `${prefix}${partial}`, candidates }
  if (candidates.length === 1) return { value: formatUnique(candidates[0] ?? partial), candidates }
  return { value: `${prefix}${commonPrefix(candidates)}`, candidates }
}

function commonPrefix(words: string[]): string {
  return words.reduce((prefix, word) => {
    let length = 0
    while (length < prefix.length && prefix[length] === word[length]) length++
    return prefix.slice(0, length)
  })
}

export interface HistoryPosition {
  cursor: number | null
  value: string
}

/** ↑ / ↓ through previous commands; `cursor: null` means the fresh prompt. */
export function navigateHistory(
  history: string[],
  cursor: number | null,
  direction: 'up' | 'down',
): HistoryPosition {
  if (history.length === 0) return { cursor: null, value: '' }
  if (direction === 'up') {
    const next = cursor === null ? history.length - 1 : Math.max(0, cursor - 1)
    return { cursor: next, value: history[next] ?? '' }
  }
  if (cursor === null || cursor >= history.length - 1) return { cursor: null, value: '' }
  return { cursor: cursor + 1, value: history[cursor + 1] ?? '' }
}
