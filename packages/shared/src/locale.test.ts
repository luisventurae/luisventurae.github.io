import { describe, expect, it } from 'vitest'

import { isLocale } from './locale'

describe('isLocale', () => {
  it.each(['es', 'en', 'fr'])('accepts %s', (value) => {
    expect(isLocale(value)).toBe(true)
  })

  it.each(['de', '', null, 1])('rejects %o', (value) => {
    expect(isLocale(value)).toBe(false)
  })
})
