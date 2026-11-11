import type { Locale } from '@portfolio/shared'
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactElement,
  type RefObject,
} from 'react'

import { localePath } from '../../lib/i18n'
import {
  COMMAND_NAMES,
  runCommand,
  type TerminalContext,
  type TerminalEffect,
  type TerminalLine,
} from '../../lib/terminal/commands'
import { completeInput, navigateHistory } from '../../lib/terminal/input'
import { createSearch, parseSearchIndex, type SearchResult } from '../../lib/terminal/search'
import { applyTheme, nextTheme, readTheme } from '../../lib/theme'

export interface TerminalProps {
  input_label: string
  context: TerminalContext
}

interface Entry {
  id: number
  kind: TerminalLine['kind'] | 'command'
  text: string
}

type SearchFn = (query: string, locale: Locale) => SearchResult[]

const PROMPT = 'luis@portfolio:~$'
const HISTORY_KEY = 'terminal-history'

let next_id = 0
function createEntry(kind: Entry['kind'], text: string): Entry {
  return { id: next_id++, kind, text }
}

export function Terminal({ input_label, context }: TerminalProps): ReactElement {
  const [entries, setEntries] = useState<Entry[]>(() => [
    createEntry('muted', context.messages.welcome),
  ])
  const [value, setValue] = useState('')
  const [history, setHistory] = useState<string[]>(readStoredHistory)
  const [cursor, setCursor] = useState<number | null>(null)
  const [is_busy, setIsBusy] = useState(false)
  const input_ref = useRef<HTMLInputElement>(null)
  const log_ref = useRef<HTMLDivElement>(null)
  const search_ref = useRef<SearchFn | null>(null)
  const { messages } = context

  useFocusShortcuts(input_ref)

  useEffect(() => {
    const log = log_ref.current
    if (log) log.scrollTop = log.scrollHeight
  }, [entries])

  const append = (...lines: Entry[]): void => setEntries((current) => [...current, ...lines])

  const search = async (query: string): Promise<void> => {
    search_ref.current ??= createSearch(
      parseSearchIndex(await (await fetch('/search-index.json')).json()),
    )
    const results = search_ref.current(query, context.locale)
    if (results.length === 0) {
      append(createEntry('muted', messages.no_results.replace('{query}', query)))
      return
    }
    append(
      createEntry('muted', messages.results_title.replace('{query}', query)),
      ...results.flatMap((result) => [
        createEntry('accent', `▸ ${result.title}`),
        createEntry('text', `  ${result.excerpt}`),
      ]),
    )
  }

  const applyEffect = async (effect: TerminalEffect): Promise<void> => {
    if (effect.type === 'clear') setEntries([])
    if (effect.type === 'lang') window.location.assign(localePath(effect.locale, 'terminal'))
    if (effect.type === 'scroll') document.getElementById(effect.target)?.scrollIntoView()
    if (effect.type === 'theme') {
      const theme = effect.theme ?? nextTheme(readTheme())
      applyTheme(theme)
      append(createEntry('muted', messages.theme_switch.replace('{theme}', theme)))
    }
    if (effect.type === 'search') await search(effect.query)
  }

  const submit = async (): Promise<void> => {
    const command = value
    setValue('')
    setCursor(null)
    if (command.trim()) {
      const next_history = [...history.filter((item) => item !== command), command].slice(-50)
      setHistory(next_history)
      storeHistory(next_history)
    }
    const result = runCommand(command, context)
    append(
      createEntry('command', command),
      ...result.lines.map((line) => createEntry(line.kind, line.text)),
    )
    if (!result.effect) return
    setIsBusy(true)
    try {
      await applyEffect(result.effect)
    } finally {
      setIsBusy(false)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      event.preventDefault()
      if (!is_busy) void submit()
      return
    }
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
      const position = navigateHistory(history, cursor, event.key === 'ArrowUp' ? 'up' : 'down')
      setCursor(position.cursor)
      setValue(position.value)
      return
    }
    if (event.key === 'Tab' && value) {
      event.preventDefault()
      const completion = completeInput(value, {
        commands: [...COMMAND_NAMES],
        slugs: context.projects.map((project) => project.slug),
      })
      setValue(completion.value)
      if (completion.candidates.length > 1) {
        append(createEntry('muted', completion.candidates.join('  ')))
      }
      return
    }
    if (event.key === 'l' && event.ctrlKey) {
      event.preventDefault()
      setEntries([])
    }
  }

  return (
    <div className="terminal overflow-hidden rounded-lg font-mono text-small shadow-lift">
      <div
        className="flex items-center gap-2 border-b border-white/10 px-4 py-3"
        aria-hidden="true"
      >
        <span className="size-3 rounded-full bg-accent" />
        <span className="size-3 rounded-full bg-lime" />
        <span className="size-3 rounded-full bg-sky" />
        <span className="terminal-muted ml-3">{PROMPT}</span>
      </div>
      <div ref={log_ref} className="h-[26rem] overflow-y-auto p-4 md:p-6">
        <div
          role="log"
          aria-live="polite"
          aria-relevant="additions text"
          className="space-y-1 break-words whitespace-pre-wrap"
        >
          {entries.map((item) => (
            <TerminalEntry key={item.id} entry={item} />
          ))}
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span aria-hidden="true" className="shrink-0 text-lime">
            {PROMPT}
          </span>
          <label className="sr-only" htmlFor="terminal-input">
            {input_label}
          </label>
          <input
            ref={input_ref}
            id="terminal-input"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={handleKeyDown}
            aria-busy={is_busy}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="w-full bg-transparent caret-accent outline-none"
          />
        </div>
      </div>
    </div>
  )
}

const KIND_CLASS: Record<Entry['kind'], string> = {
  text: '',
  command: '',
  muted: 'terminal-muted',
  error: 'terminal-error',
  accent: 'text-lime',
}

function TerminalEntry({ entry }: { entry: Entry }): ReactElement {
  if (entry.kind === 'command') {
    return (
      <p>
        <span className="text-lime">{PROMPT}</span> {entry.text}
      </p>
    )
  }
  return <p className={KIND_CLASS[entry.kind]}>{entry.text}</p>
}

/** Backtick focuses the prompt from anywhere; the hero CTA dispatches `terminal:focus`. */
function useFocusShortcuts(input_ref: RefObject<HTMLInputElement | null>): void {
  useEffect(() => {
    const focusInput = (): void => input_ref.current?.focus({ preventScroll: true })
    const handleKey = (event: globalThis.KeyboardEvent): void => {
      const target = event.target instanceof HTMLElement ? event.target : null
      const is_typing = target?.closest('input, textarea, [contenteditable="true"]')
      if (event.key !== '`' || is_typing) return
      event.preventDefault()
      // Keyboard-initiated: jump instantly, no smooth scroll.
      document.getElementById('terminal')?.scrollIntoView({ block: 'center', behavior: 'instant' })
      focusInput()
    }
    window.addEventListener('keydown', handleKey)
    window.addEventListener('terminal:focus', focusInput)
    return () => {
      window.removeEventListener('keydown', handleKey)
      window.removeEventListener('terminal:focus', focusInput)
    }
  }, [input_ref])
}

function readStoredHistory(): string[] {
  try {
    const parsed: unknown = JSON.parse(sessionStorage.getItem(HISTORY_KEY) ?? '[]')
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string')
      : []
  } catch {
    return []
  }
}

function storeHistory(history: string[]): void {
  try {
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  } catch {
    // Storage blocked: history just won't survive a language switch.
  }
}
