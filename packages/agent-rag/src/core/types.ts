export type ChunkKind = 'code' | 'test' | 'doc' | 'spec' | 'commit'

/** A retrievable fragment with its location, so an agent can read just that range. */
export interface Chunk {
  id: string
  path: string
  kind: ChunkKind
  symbol: string | null
  start_line: number
  end_line: number
  text: string
}

export interface SourceFile {
  path: string
  content: string
}

export interface CommitInfo {
  hash: string
  subject: string
  body: string
  files: string[]
}
