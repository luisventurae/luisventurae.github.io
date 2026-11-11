import type { Chunk, CommitInfo } from './types.ts'

const SHORT_HASH_LENGTH = 7

/** One chunk per commit, so decisions and history are searchable like code. */
export function chunkCommits(commits: CommitInfo[]): Chunk[] {
  return commits.map((commit) => {
    const short_hash = commit.hash.slice(0, SHORT_HASH_LENGTH)
    const id = `commit:${short_hash}`
    const files = commit.files.length > 0 ? `\nFiles: ${commit.files.join(', ')}` : ''
    return {
      id,
      path: id,
      kind: 'commit',
      symbol: commit.subject,
      start_line: 1,
      end_line: 1,
      text: `${short_hash} ${commit.subject}\n${commit.body}${files}`.trim(),
    }
  })
}
