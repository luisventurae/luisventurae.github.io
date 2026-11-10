import { buildIndex } from '../core/index-builder.ts'
import type { Clock, Embedder, FileSource, IndexStore } from '../core/ports.ts'
import { searchIndex } from '../core/search.ts'
import { parseArgs } from './args.ts'
import { formatJson, formatResults, formatStatus } from './format.ts'

export interface CliDeps {
  source: FileSource
  store: IndexStore
  /** `null` runs lexical only. */
  embedder: Embedder | null
  clock: Clock
}

export interface CliResult {
  code: number
  stdout: string
  stderr: string
}

export async function runCli(argv: string[], deps: CliDeps): Promise<CliResult> {
  const parsed = parseArgs(argv)
  if (!parsed.ok) return { code: 2, stdout: '', stderr: parsed.message }
  const { command } = parsed

  if (command.name === 'status') {
    return ok(formatStatus(await deps.store.load(), deps.clock.now()))
  }

  const { index, stats } = await buildIndex(deps, {
    rebuild: command.name === 'index' && command.rebuild,
  })
  if (command.name === 'index') {
    const semantic = stats.semantic ? 'semantic' : 'lexical only'
    const warning = stats.warning ? `\n⚠ ${stats.warning}` : ''
    return ok(
      `Indexed ${stats.files_total} files (${stats.files_changed} changed), ` +
        `embedded ${stats.chunks_embedded} chunks (${semantic}).${warning}`,
    )
  }

  const { results, semantic } = await searchIndex(
    index,
    command.query,
    { k: command.k, kind: command.kind },
    stats.semantic ? deps.embedder : null,
  )
  const notice =
    stats.files_changed > 0
      ? `Index refreshed: ${stats.files_changed} files changed, ${stats.chunks_embedded} chunks embedded.`
      : ''
  if (command.json) return { code: 0, stdout: formatJson(results), stderr: notice }
  const reason = semantic
    ? null
    : (stats.warning ?? 'no embedding model or the query could not be embedded')
  return { code: 0, stdout: formatResults(command.query, results, reason), stderr: notice }
}

function ok(stdout: string): CliResult {
  return { code: 0, stdout, stderr: '' }
}
