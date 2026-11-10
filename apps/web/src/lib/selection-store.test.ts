import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createSelectionStore } from './selection-store'

describe('selection store', () => {
  let store = createSelectionStore()

  beforeEach(() => {
    store = createSelectionStore()
  })

  it('starts empty', () => {
    expect(store.getSnapshot()).toEqual({ selected: null, previewed: null, active: null })
  })

  it('toggles the selected skill', () => {
    store.toggle('vue')
    expect(store.getSnapshot().selected).toBe('vue')
    store.toggle('vue')
    expect(store.getSnapshot().selected).toBeNull()
  })

  it('prefers the previewed skill as active while hovering', () => {
    store.toggle('vue')
    store.preview('nodejs')
    expect(store.getSnapshot().active).toBe('nodejs')
    store.preview(null)
    expect(store.getSnapshot().active).toBe('vue')
  })

  it('notifies subscribers and stops after unsubscribing', () => {
    const listener = vi.fn()
    const unsubscribe = store.subscribe(listener)
    store.toggle('vue')
    unsubscribe()
    store.clear()
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('keeps the server snapshot empty', () => {
    store.toggle('vue')
    expect(store.getServerSnapshot().selected).toBeNull()
  })

  it('returns a stable snapshot between changes', () => {
    expect(store.getSnapshot()).toBe(store.getSnapshot())
  })
})
