import { afterEach, describe, expect, it, vi } from 'vitest'

import { observeReveals } from './reveal'

type Callback = (entries: Partial<IntersectionObserverEntry>[]) => void

class FakeObserver {
  static last: FakeObserver | undefined
  readonly observed = new Set<Element>()
  constructor(
    readonly callback: Callback,
    readonly options: IntersectionObserverInit,
  ) {
    FakeObserver.last = this
  }
  observe(element: Element): void {
    this.observed.add(element)
  }
  unobserve(element: Element): void {
    this.observed.delete(element)
  }
  disconnect(): void {
    this.observed.clear()
  }
  enter(element: Element, is_intersecting = true): void {
    this.callback([{ target: element, isIntersecting: is_intersecting }])
  }
}

function setup(html: string): HTMLElement {
  document.body.innerHTML = html
  return document.body
}

describe('observeReveals', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    document.documentElement.removeAttribute('data-reveal-ready')
  })

  it('marks an element once it enters the viewport and stops watching it', () => {
    vi.stubGlobal('IntersectionObserver', FakeObserver)
    const root = setup(
      '<section data-reveal id="a"></section><section data-reveal id="b"></section>',
    )
    observeReveals(root)
    const observer = FakeObserver.last
    const a = root.querySelector('#a')
    if (!observer || !a) throw new Error('setup failed')

    expect(observer.observed.size).toBe(2)
    observer.enter(a, false)
    expect(a.hasAttribute('data-inview')).toBe(false)
    observer.enter(a)
    expect(a.hasAttribute('data-inview')).toBe(true)
    expect(observer.observed.has(a)).toBe(false)
  })

  it('reveals a little before the element is fully on screen', () => {
    vi.stubGlobal('IntersectionObserver', FakeObserver)
    observeReveals(setup('<div data-reveal></div>'))
    expect(FakeObserver.last?.options.rootMargin).toBe('0px 0px -10% 0px')
  })

  it('skips elements that were already revealed', () => {
    vi.stubGlobal('IntersectionObserver', FakeObserver)
    observeReveals(setup('<div data-reveal data-inview></div><div data-reveal></div>'))
    expect(FakeObserver.last?.observed.size).toBe(1)
  })

  it('shows everything at once when IntersectionObserver is missing', () => {
    vi.stubGlobal('IntersectionObserver', undefined)
    const root = setup('<div data-reveal></div><div data-reveal></div>')
    observeReveals(root)
    expect(root.querySelectorAll('[data-inview]')).toHaveLength(2)
  })

  it('tells the page that the reveal system is running', () => {
    vi.stubGlobal('IntersectionObserver', FakeObserver)
    observeReveals(setup(''))
    expect(document.documentElement.hasAttribute('data-reveal-ready')).toBe(true)
  })
})
