import { useEffect, useState } from 'react'

/**
 * Cycles through `length` items every `interval_ms`, pausing while `paused` is true or
 * the tab is hidden (no point animating what nobody sees).
 */
export function useRotatingIndex(length: number, interval_ms: number, paused: boolean): number {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (paused || length < 2) return undefined
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'hidden') return
      setIndex((current) => (current + 1) % length)
    }, interval_ms)
    return () => window.clearInterval(timer)
  }, [length, interval_ms, paused])

  return index
}
