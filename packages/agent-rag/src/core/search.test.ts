import { describe, expect, it } from 'vitest'

import type { Embedder, IndexedChunk, RagIndex } from './ports'
import { searchIndex } from './search'
import { conceptEmbedder } from '../testing/fakes'

const embedder = conceptEmbedder()

async function entry(
  path: string,
  symbol: string,
  text: string,
  kind: IndexedChunk['kind'] = 'code',
): Promise<IndexedChunk> {
  const [vector] = await embedder.embed([text], 'passage')
  return {
    id: `${path}:${symbol}`,
    path,
    kind,
    symbol,
    start_line: 1,
    end_line: 10,
    text: `${path} › ${symbol}\n${text}`,
    vector: vector ?? null,
  }
}

async function buildIndex(...entries: Promise<IndexedChunk>[]): Promise<RagIndex> {
  return {
    model: embedder.model,
    built_at: 0,
    file_hashes: {},
    entries: await Promise.all(entries),
  }
}

describe('searchIndex', () => {
  it('finds a declaration by its camelCase identifier', async () => {
    const index = await buildIndex(
      entry('apps/api/src/config.ts', 'parseConfig', 'export function parseConfig(env) {}'),
      entry('apps/api/src/main.ts', 'buildApp', 'const config = parseEnv(env)\nconfig.value'),
      entry('docs/a.md', 'Config', 'La configuración del entorno', 'doc'),
    )
    const { results } = await searchIndex(index, 'parseConfig', {}, null)
    expect(results[0]).toMatchObject({ path: 'apps/api/src/config.ts', symbol: 'parseConfig' })
  })

  it('splits paths and snake_case so words match identifiers', async () => {
    const index = await buildIndex(
      entry('apps/api/src/adapters/kv-rate-limiter.ts', 'createKvRateLimiter', 'consume(key)'),
      entry('apps/api/src/adapters/email.ts', 'createEmailSender', 'send(message)'),
    )
    const { results } = await searchIndex(index, 'rate limiter', {}, null)
    expect(results[0]?.path).toBe('apps/api/src/adapters/kv-rate-limiter.ts')
  })

  it('finds synonyms through the semantic ranking', async () => {
    const index = await buildIndex(
      entry(
        'apps/api/src/adapters/turnstile.ts',
        'createTurnstileVerifier',
        'verify captcha token',
      ),
      entry('apps/api/src/adapters/email.ts', 'createEmailSender', 'send mail notification'),
    )
    const { results, semantic } = await searchIndex(index, 'challenge validation', {}, embedder)
    expect(semantic).toBe(true)
    expect(results[0]?.path).toBe('apps/api/src/adapters/turnstile.ts')
  })

  it('ranks chunks that match both rankings above chunks that match one', async () => {
    const index = await buildIndex(
      entry('a.ts', 'both', 'captcha verification of the token'),
      entry('b.ts', 'lexical_only', 'verification of the token in the cache'),
      entry('c.ts', 'semantic_only', 'challenge solved'),
    )
    const { results } = await searchIndex(index, 'captcha verification', {}, embedder)
    expect(results[0]?.path).toBe('a.ts')
  })

  it('filters by kind and limits the number of results', async () => {
    const index = await buildIndex(
      entry('a.ts', 'one', 'token signer', 'code'),
      entry('docs/a.md', 'Tokens', 'token signer docs', 'doc'),
      entry('b.ts', 'two', 'token signer again', 'code'),
    )
    const docs = await searchIndex(index, 'token signer', { kind: 'doc' }, null)
    expect(docs.results.map((result) => result.kind)).toEqual(['doc'])
    const limited = await searchIndex(index, 'token signer', { k: 1 }, null)
    expect(limited.results).toHaveLength(1)
  })

  it('falls back to lexical ranking when the embedder fails or is missing', async () => {
    const index = await buildIndex(entry('a.ts', 'signer', 'token signer'))
    const failing: Embedder = {
      model: 'broken',
      embed: async () => Promise.reject(new Error('no model')),
    }
    const outcome = await searchIndex(index, 'signer', {}, failing)
    expect(outcome.semantic).toBe(false)
    expect(outcome.results).toHaveLength(1)
    expect((await searchIndex(index, 'signer', {}, null)).semantic).toBe(false)
  })

  it('ranks archived changes below live specs with equal relevance', async () => {
    const index = await buildIndex(
      entry(
        'openspec/changes/archive/2026-11-10-x/spec.md',
        'Terminal',
        'terminal command set',
        'spec',
      ),
      entry('openspec/specs/terminal/spec.md', 'Terminal', 'terminal command set', 'spec'),
    )
    const { results } = await searchIndex(index, 'terminal command set', {}, null)
    expect(results[0]?.path).toBe('openspec/specs/terminal/spec.md')
  })

  it('returns a short excerpt without the path header', async () => {
    const text = Array.from({ length: 10 }, (_, line) => `linea ${line} token`).join('\n')
    const index = await buildIndex(entry('a.ts', 'signer', text))
    const [result] = (await searchIndex(index, 'token', {}, null)).results
    expect(result?.excerpt.split('\n')).toHaveLength(4)
    expect(result?.excerpt).not.toContain('a.ts ›')
  })
})
