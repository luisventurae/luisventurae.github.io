import { execFile } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { promisify } from 'node:util'

import type { FileSource } from '../core/ports.ts'
import type { CommitInfo, SourceFile } from '../core/types.ts'

const run = promisify(execFile)
const MAX_FILE_BYTES = 512 * 1024
const MAX_OUTPUT_BYTES = 64 * 1024 * 1024
const RECORD = '\u001e'
const FIELD = '\u001f'

/** Reads the repository through git, so `.gitignore` is respected for free. */
export function createGitFileSource(cwd: string): FileSource {
  const git = async (...args: string[]): Promise<string> =>
    (await run('git', args, { cwd, maxBuffer: MAX_OUTPUT_BYTES })).stdout

  return {
    async listFiles() {
      const paths = (await git('ls-files', '-z')).split('\0').filter(Boolean)
      const files = await Promise.all(paths.map((path) => readText(cwd, path)))
      return files.filter((file): file is SourceFile => file !== null)
    },
    async listCommits(limit) {
      const output = await git(
        'log',
        `-n${limit}`,
        '--name-only',
        `--format=${RECORD}%H${FIELD}%s${FIELD}%b${FIELD}`,
      )
      return output.split(RECORD).filter(Boolean).map(parseCommit)
    },
  }
}

async function readText(cwd: string, path: string): Promise<SourceFile | null> {
  try {
    const buffer = await readFile(join(cwd, path))
    if (buffer.length > MAX_FILE_BYTES || buffer.includes(0)) return null
    return { path, content: buffer.toString('utf8') }
  } catch {
    // Tracked but deleted in the working tree: nothing to index.
    return null
  }
}

function parseCommit(record: string): CommitInfo {
  const [hash = '', subject = '', body = '', files = ''] = record.split(FIELD)
  return {
    hash,
    subject,
    body: body.trim(),
    files: files.split('\n').filter((line) => line.trim() !== ''),
  }
}
