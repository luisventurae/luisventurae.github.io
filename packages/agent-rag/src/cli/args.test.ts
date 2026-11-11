import { describe, expect, it } from 'vitest'

import { parseArgs } from './args'

describe('parseArgs', () => {
  it('parses search with its query, k, kind and json flag', () => {
    expect(
      parseArgs(['search', 'dónde', 'se', 'valida', '--k', '3', '--kind', 'code', '--json']),
    ).toEqual({
      ok: true,
      command: { name: 'search', query: 'dónde se valida', k: 3, kind: 'code', json: true },
    })
  })

  it('applies defaults', () => {
    expect(parseArgs(['search', 'captcha'])).toEqual({
      ok: true,
      command: { name: 'search', query: 'captcha', k: undefined, kind: undefined, json: false },
    })
  })

  it('parses index and status', () => {
    expect(parseArgs(['index', '--rebuild'])).toEqual({
      ok: true,
      command: { name: 'index', rebuild: true },
    })
    expect(parseArgs(['status'])).toEqual({ ok: true, command: { name: 'status' } })
  })

  it.each([
    [[], 'Usage'],
    [['search'], 'query'],
    [['search', 'x', '--kind', 'banana'], '--kind'],
    [['search', 'x', '--k', '0'], '--k'],
    [['search', 'x', '--k', 'abc'], '--k'],
    [['fly'], 'Unknown command'],
    [['search', 'x', '--nope'], 'Usage'],
  ])('rejects %j with a message containing %s', (argv, expected) => {
    const result = parseArgs(argv)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.message).toContain(expected)
  })
})
