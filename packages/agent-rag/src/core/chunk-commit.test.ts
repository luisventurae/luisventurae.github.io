import { describe, expect, it } from 'vitest'

import { chunkCommits } from './chunk-commit'

describe('chunkCommits', () => {
  it('creates one commit chunk per commit with its short hash', () => {
    const chunks = chunkCommits([
      {
        hash: 'dd41209aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        subject: 'docs: turn docs/README into a search index',
        body: 'It maps questions to documents.',
        files: ['docs/README.md', 'CLAUDE.md'],
      },
    ])
    expect(chunks).toHaveLength(1)
    expect(chunks[0]).toMatchObject({
      id: 'commit:dd41209',
      path: 'commit:dd41209',
      kind: 'commit',
      symbol: 'docs: turn docs/README into a search index',
      start_line: 1,
    })
    expect(chunks[0]?.text).toContain('docs/README.md')
    expect(chunks[0]?.text).toContain('It maps questions to documents.')
  })
})
