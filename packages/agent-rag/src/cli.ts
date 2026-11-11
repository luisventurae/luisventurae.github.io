// Composition root: wires the real adapters. Covered by the manual scenarios in the spec.
import { execFile } from 'node:child_process'
import { join } from 'node:path'
import { promisify } from 'node:util'

import { createGitFileSource } from './adapters/git-file-source.ts'
import { createJsonIndexStore } from './adapters/json-index-store.ts'
import { createTransformersEmbedder } from './adapters/transformers-embedder.ts'
import { runCli } from './cli/run.ts'

const CACHE_DIR = '.cache/agent-rag'

async function repoRoot(): Promise<string> {
  const { stdout } = await promisify(execFile)('git', ['rev-parse', '--show-toplevel'])
  return stdout.trim()
}

const root = await repoRoot()
const cache = join(root, CACHE_DIR)
const result = await runCli(process.argv.slice(2), {
  source: createGitFileSource(root),
  store: createJsonIndexStore(join(cache, 'index.json')),
  // AGENT_RAG_LEXICAL=1 skips the embedding model (offline, or when speed matters most).
  embedder:
    process.env.AGENT_RAG_LEXICAL === '1'
      ? null
      : createTransformersEmbedder({ cache_dir: join(cache, 'models') }),
  clock: { now: () => Date.now() },
})

if (result.stderr) console.error(result.stderr)
if (result.stdout) console.log(result.stdout)
process.exitCode = result.code
