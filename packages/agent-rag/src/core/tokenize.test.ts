import { describe, expect, it } from 'vitest'

import { tokenize } from './tokenize'

describe('tokenize', () => {
  it('keeps identifiers whole and adds their camelCase parts', () => {
    expect(tokenize('parseConfig')).toEqual(['parseconfig', 'parse', 'config'])
  })

  it('splits snake_case, acronyms and paths', () => {
    expect(tokenize('rate_limiter')).toEqual(['rate_limiter', 'rate', 'limiter'])
    expect(tokenize('HTMLParser')).toEqual(['htmlparser', 'html', 'parser'])
    expect(tokenize('apps/api/kv-rate-limiter.ts')).toEqual([
      'apps',
      'api',
      'kv',
      'rate',
      'limiter',
      'ts',
    ])
  })

  it('handles accents and ignores punctuation', () => {
    expect(tokenize('¿Configuración?')).toEqual(['configuración'])
  })

  it('drops Spanish and English stop words', () => {
    expect(tokenize('dónde se valida el captcha')).toEqual(['valida', 'captcha'])
    expect(tokenize('where is the captcha validated')).toEqual(['captcha', 'validated'])
  })
})
