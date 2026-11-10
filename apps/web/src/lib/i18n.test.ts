import { describe, expect, it } from 'vitest'

import { alternateLinks, getLocaleFromPath, localePath } from './i18n'

describe('localePath', () => {
  it('keeps the default locale at the root', () => {
    expect(localePath('es')).toBe('/')
  })

  it('prefixes other locales', () => {
    expect(localePath('en')).toBe('/en/')
    expect(localePath('fr', 'projects')).toBe('/fr/#projects')
  })
})

describe('getLocaleFromPath', () => {
  it.each([
    ['/', 'es'],
    ['/en/', 'en'],
    ['/fr/#stack', 'fr'],
    ['/de/', 'es'],
  ])('%s → %s', (path, locale) => {
    expect(getLocaleFromPath(path)).toBe(locale)
  })
})

describe('alternateLinks', () => {
  it('lists every locale plus x-default with absolute urls', () => {
    expect(alternateLinks('https://luisventurae.github.io')).toEqual([
      { hreflang: 'es', href: 'https://luisventurae.github.io/' },
      { hreflang: 'en', href: 'https://luisventurae.github.io/en/' },
      { hreflang: 'fr', href: 'https://luisventurae.github.io/fr/' },
      { hreflang: 'x-default', href: 'https://luisventurae.github.io/' },
    ])
  })
})
