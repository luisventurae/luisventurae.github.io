// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { stripInlineMarks } from './plain-text'

describe('stripInlineMarks', () => {
  it('removes highlight tags and keeps their text', () => {
    expect(stripInlineMarks('Soy <mark>Backend Engineer</mark> en <mark>Prestamype</mark>.')).toBe(
      'Soy Backend Engineer en Prestamype.',
    )
  })

  it('leaves other text untouched', () => {
    expect(stripInlineMarks('a < b y `<code>`')).toBe('a < b y `<code>`')
  })
})
