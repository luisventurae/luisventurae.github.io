import { parseArgs as parseNodeArgs } from 'node:util'

import type { ChunkKind } from '../core/types.ts'

const KINDS: readonly ChunkKind[] = ['code', 'test', 'doc', 'spec', 'commit']

const USAGE = `Usage:
  rag search <query> [--k <n>] [--kind code|test|doc|spec|commit] [--json]
  rag index [--rebuild]
  rag status`

type Command =
  | {
      name: 'search'
      query: string
      k: number | undefined
      kind: ChunkKind | undefined
      json: boolean
    }
  | { name: 'index'; rebuild: boolean }
  | { name: 'status' }

export type ParsedArgs = { ok: true; command: Command } | { ok: false; message: string }

export function parseArgs(argv: string[]): ParsedArgs {
  let parsed: ReturnType<typeof read>
  try {
    parsed = read(argv)
  } catch {
    return { ok: false, message: USAGE }
  }
  const [name, ...words] = parsed.positionals
  if (name === 'status') return { ok: true, command: { name } }
  if (name === 'index')
    return { ok: true, command: { name, rebuild: parsed.values.rebuild === true } }
  if (name !== 'search') {
    return { ok: false, message: name ? `Unknown command "${name}".\n${USAGE}` : USAGE }
  }

  const query = words.join(' ').trim()
  if (query === '') return { ok: false, message: `Missing query.\n${USAGE}` }
  const kind = parsed.values.kind
  if (kind !== undefined && !isKind(kind)) {
    return { ok: false, message: `Invalid --kind "${kind}". Use ${KINDS.join('|')}.` }
  }
  const k = parsed.values.k === undefined ? undefined : Number(parsed.values.k)
  if (k !== undefined && (!Number.isInteger(k) || k < 1)) {
    return { ok: false, message: '--k must be a positive integer.' }
  }
  return { ok: true, command: { name, query, k, kind, json: parsed.values.json === true } }
}

function read(argv: string[]) {
  return parseNodeArgs({
    args: argv,
    allowPositionals: true,
    options: {
      k: { type: 'string' },
      kind: { type: 'string' },
      json: { type: 'boolean' },
      rebuild: { type: 'boolean' },
    },
  })
}

function isKind(value: string): value is ChunkKind {
  return (KINDS as readonly string[]).includes(value)
}
