import { execFileSync } from 'node:child_process'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { createGitFileSource } from './git-file-source'

let repo = ''
const git = (...args: string[]): string =>
  execFileSync('git', args, {
    cwd: repo,
    encoding: 'utf8',
    env: {
      ...process.env,
      GIT_AUTHOR_NAME: 't',
      GIT_AUTHOR_EMAIL: 't@example.test',
      GIT_COMMITTER_NAME: 't',
      GIT_COMMITTER_EMAIL: 't@example.test',
    },
  })

beforeAll(async () => {
  repo = await mkdtemp(join(tmpdir(), 'agent-rag-git-'))
  git('init', '-q')
  await mkdir(join(repo, 'src'))
  await writeFile(join(repo, 'src', 'a.ts'), 'export const A = 1\n')
  await writeFile(join(repo, 'logo.bin'), Buffer.from([0, 1, 2, 0]))
  await writeFile(join(repo, '.gitignore'), 'ignored.ts\n')
  await writeFile(join(repo, 'ignored.ts'), 'export const X = 1\n')
  git('add', '-A')
  git('commit', '-q', '-m', 'feat: first', '-m', 'Body line')
  await writeFile(join(repo, 'src', 'b.ts'), 'export const B = 2\n')
  git('add', '-A')
  git('commit', '-q', '-m', 'fix: second')
})
afterAll(async () => {
  await rm(repo, { recursive: true, force: true })
})

describe('createGitFileSource', () => {
  it('lists tracked text files and skips ignored and binary ones', async () => {
    const files = await createGitFileSource(repo).listFiles()
    expect(files.map((file) => file.path).sort()).toEqual(['.gitignore', 'src/a.ts', 'src/b.ts'])
    expect(files.find((file) => file.path === 'src/a.ts')?.content).toBe('export const A = 1\n')
  })

  it('lists recent commits with body and touched files, newest first', async () => {
    const commits = await createGitFileSource(repo).listCommits(10)
    expect(commits.map((commit) => commit.subject)).toEqual(['fix: second', 'feat: first'])
    expect(commits[1]).toMatchObject({
      body: 'Body line',
      files: expect.arrayContaining(['src/a.ts']),
    })
    expect(commits[0]?.hash).toMatch(/^[0-9a-f]{40}$/)
    expect(await createGitFileSource(repo).listCommits(1)).toHaveLength(1)
  })
})
