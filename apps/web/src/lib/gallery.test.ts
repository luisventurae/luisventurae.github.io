// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { fillTemplate, mediaFrame, slideIndexFromScroll } from './gallery'

describe('mediaFrame', () => {
  it('treats portrait screenshots as mobile', () => {
    expect(mediaFrame(389, 842)).toBe('mobile')
  })

  it('treats landscape and square screenshots as desktop', () => {
    expect(mediaFrame(1848, 931)).toBe('desktop')
    expect(mediaFrame(800, 800)).toBe('desktop')
  })
})

describe('slideIndexFromScroll', () => {
  it('rounds to the nearest slide', () => {
    expect(slideIndexFromScroll(0, 600, 4)).toBe(0)
    expect(slideIndexFromScroll(620, 600, 4)).toBe(1)
    expect(slideIndexFromScroll(1290, 600, 4)).toBe(2)
  })

  it('stays inside the slide range', () => {
    expect(slideIndexFromScroll(-40, 600, 4)).toBe(0)
    expect(slideIndexFromScroll(9000, 600, 4)).toBe(3)
  })

  it('returns the first slide before layout', () => {
    expect(slideIndexFromScroll(300, 0, 4)).toBe(0)
  })
})

describe('fillTemplate', () => {
  it('replaces every token and leaves unknown ones untouched', () => {
    expect(
      fillTemplate('{title}: {n} / {count} · {other}', { title: 'Ticker', n: 2, count: 4 }),
    ).toBe('Ticker: 2 / 4 · {other}')
  })
})
