import { useSyncExternalStore, type MouseEvent, type ReactElement } from 'react'

import {
  applyTheme,
  nextTheme,
  prefersReducedMotion,
  readTheme,
  subscribeTheme,
} from '../lib/theme'

interface ThemeToggleProps {
  label_to_dark: string
  label_to_light: string
}

const REVEAL_DURATION_MS = 420

export function ThemeToggle({ label_to_dark, label_to_light }: ThemeToggleProps): ReactElement {
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => 'light' as const)

  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    const target_theme = nextTheme(theme)
    const commit = (): void => applyTheme(target_theme)
    // Keyboard activation (detail === 0) and reduced motion switch instantly.
    const should_animate = event.detail > 0 && !prefersReducedMotion()
    if (!should_animate || typeof document.startViewTransition !== 'function') {
      commit()
      return
    }
    revealFrom(event.currentTarget, commit)
  }

  const label = theme === 'dark' ? label_to_light : label_to_dark

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      title={label}
      className="pressable grid size-10 place-items-center rounded-full border border-line bg-paper-raised text-ink pointer-fine:hover:border-ink"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
        {theme === 'dark' ? (
          <path
            fill="currentColor"
            d="M12 4.5a1 1 0 0 1 1 1V7a1 1 0 1 1-2 0V5.5a1 1 0 0 1 1-1Zm0 11.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 1a1 1 0 0 1 1 1v1.5a1 1 0 1 1-2 0V18a1 1 0 0 1 1-1Zm7.5-6a1 1 0 1 1 0 2H18a1 1 0 1 1 0-2h1.5ZM7 12a1 1 0 0 1-1 1H4.5a1 1 0 1 1 0-2H6a1 1 0 0 1 1 1Zm10.66-5.66a1 1 0 0 1 0 1.42l-1.06 1.06a1 1 0 1 1-1.42-1.42l1.06-1.06a1 1 0 0 1 1.42 0ZM8.82 15.18a1 1 0 0 1 0 1.42l-1.06 1.06a1 1 0 1 1-1.42-1.42l1.06-1.06a1 1 0 0 1 1.42 0Zm8.84 2.48a1 1 0 0 1-1.42 0l-1.06-1.06a1 1 0 1 1 1.42-1.42l1.06 1.06a1 1 0 0 1 0 1.42ZM8.82 8.82a1 1 0 0 1-1.42 0L6.34 7.76a1 1 0 1 1 1.42-1.42l1.06 1.06a1 1 0 0 1 0 1.42Z"
          />
        ) : (
          <path
            fill="currentColor"
            d="M20.35 14.6A8.5 8.5 0 0 1 9.4 3.65a.75.75 0 0 0-.96-.96A10 10 0 1 0 21.31 15.56a.75.75 0 0 0-.96-.96Z"
          />
        )}
      </svg>
    </button>
  )
}

/** Circular reveal of the new theme, growing from the toggle (View Transitions API). */
function revealFrom(origin: HTMLElement, commit: () => void): void {
  const rect = origin.getBoundingClientRect()
  const x = rect.left + rect.width / 2
  const y = rect.top + rect.height / 2
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  const transition = document.startViewTransition(commit)

  void transition.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      {
        duration: REVEAL_DURATION_MS,
        easing: 'cubic-bezier(0.77, 0, 0.175, 1)',
        pseudoElement: '::view-transition-new(root)',
      },
    )
  })
}
