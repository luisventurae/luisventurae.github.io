import { beforeEach, describe, expect, it } from 'vitest'

import { vi } from 'vitest'

import { applyTheme, nextTheme, readTheme, subscribeTheme, THEME_STORAGE_KEY } from './theme'

describe('theme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.dataset.theme = 'light'
  })

  it('toggles between light and dark', () => {
    expect(nextTheme('light')).toBe('dark')
    expect(nextTheme('dark')).toBe('light')
  })

  it('reads the current theme from the document', () => {
    document.documentElement.dataset.theme = 'dark'
    expect(readTheme()).toBe('dark')
  })

  it('applies and persists the theme', () => {
    applyTheme('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
  })

  it('notifies subscribers when the theme changes', async () => {
    const onChange = vi.fn()
    const unsubscribe = subscribeTheme(onChange)
    applyTheme('dark')
    await Promise.resolve()
    expect(onChange).toHaveBeenCalled()
    unsubscribe()
  })
})
