import { describe, expect, it } from 'vitest'

import { resolveSwipe, SWIPE_DISTANCE_PX, SWIPE_VELOCITY } from './swipe'

const base = { index: 2, count: 5 }

describe('resolveSwipe', () => {
  it('goes to the next project after a long drag to the left', () => {
    expect(resolveSwipe({ ...base, offset_x: -SWIPE_DISTANCE_PX - 1, velocity_x: 0 })).toBe(3)
  })

  it('goes to the previous project after a long drag to the right', () => {
    expect(resolveSwipe({ ...base, offset_x: SWIPE_DISTANCE_PX + 1, velocity_x: 0 })).toBe(1)
  })

  it('accepts a short but fast flick', () => {
    expect(resolveSwipe({ ...base, offset_x: -20, velocity_x: -SWIPE_VELOCITY - 1 })).toBe(3)
  })

  it('stays when the drag is short and slow', () => {
    expect(resolveSwipe({ ...base, offset_x: -20, velocity_x: -50 })).toBe(2)
  })

  it('does not wrap at the edges', () => {
    expect(resolveSwipe({ index: 0, count: 5, offset_x: 500, velocity_x: 900 })).toBe(0)
    expect(resolveSwipe({ index: 4, count: 5, offset_x: -500, velocity_x: -900 })).toBe(4)
  })
})
