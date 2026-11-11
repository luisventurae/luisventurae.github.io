import { useLayoutEffect, useRef, useState, type RefObject } from 'react'

/**
 * - `static`: rendered as-is (server render, already on screen at hydration, or no observer).
 * - `hidden`: below the fold at hydration, waiting to be scrolled into view.
 * - `shown`: entered the viewport; CSS plays the entrance once.
 */
export type RevealState = 'static' | 'hidden' | 'shown'

const ROOT_MARGIN = '0px 0px -10% 0px'

export function isInViewport(
  rect: { top: number; bottom: number },
  viewport_height: number,
): boolean {
  return rect.top < viewport_height && rect.bottom > 0
}

/**
 * Scroll reveal for React islands, where the global observer must not touch the DOM.
 * Only elements that start off screen are hidden, so hydration never makes visible
 * content blink. Layout effect: the hidden state lands before the first paint.
 */
export function useScrollReveal<T extends Element>(): {
  ref: RefObject<T | null>
  state: RevealState
} {
  const ref = useRef<T>(null)
  const [state, setState] = useState<RevealState>('static')

  useLayoutEffect(() => {
    const element = ref.current
    if (!element || typeof IntersectionObserver === 'undefined') return
    if (isInViewport(element.getBoundingClientRect(), window.innerHeight)) return

    setState('hidden')
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        setState('shown')
        observer.disconnect()
      },
      { rootMargin: ROOT_MARGIN, threshold: 0.1 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return { ref, state }
}
