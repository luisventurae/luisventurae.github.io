import { act, render, screen } from '@testing-library/react'
import type { ReactElement } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { isInViewport, useScrollReveal } from './use-scroll-reveal'

let notify: ((entries: Partial<IntersectionObserverEntry>[]) => void) | undefined

class FakeObserver {
  constructor(callback: (entries: Partial<IntersectionObserverEntry>[]) => void) {
    notify = callback
  }
  observe(): void {}
  disconnect(): void {}
}

function Probe(): ReactElement {
  const { ref, state } = useScrollReveal<HTMLDivElement>()
  return <div ref={ref} data-testid="probe" data-state={state} />
}

describe('useScrollReveal', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    notify = undefined
  })

  it('hides an element that starts below the fold and shows it once it scrolls in', () => {
    vi.stubGlobal('IntersectionObserver', FakeObserver)
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      top: 2000,
      bottom: 2400,
    } as DOMRect)
    render(<Probe />)
    expect(screen.getByTestId('probe')).toHaveAttribute('data-state', 'hidden')
    act(() => notify?.([{ isIntersecting: true }]))
    expect(screen.getByTestId('probe')).toHaveAttribute('data-state', 'shown')
  })

  it('leaves an element that is already on screen untouched, avoiding a flash', () => {
    vi.stubGlobal('IntersectionObserver', FakeObserver)
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      bottom: 400,
    } as DOMRect)
    render(<Probe />)
    expect(screen.getByTestId('probe')).toHaveAttribute('data-state', 'static')
  })

  it('stays static without IntersectionObserver', () => {
    vi.stubGlobal('IntersectionObserver', undefined)
    render(<Probe />)
    expect(screen.getByTestId('probe')).toHaveAttribute('data-state', 'static')
  })
})

describe('isInViewport', () => {
  it('detects overlap with the viewport', () => {
    expect(isInViewport({ top: 100, bottom: 300 }, 800)).toBe(true)
    expect(isInViewport({ top: 900, bottom: 1200 }, 800)).toBe(false)
    expect(isInViewport({ top: -400, bottom: -10 }, 800)).toBe(false)
  })
})
