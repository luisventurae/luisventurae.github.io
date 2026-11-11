import type { CSSProperties, ReactElement } from 'react'

import type { SocialLink } from '../../data/site'

export interface SocialLinksProps {
  /** Accessible name of the list, e.g. "Redes sociales". */
  label: string
  new_tab: string
  links: SocialLink[]
}

/** Simple Icons glyphs (CC0), 24×24 viewBox. */
const ICON_PATHS: Record<SocialLink['key'], string> = {
  linkedin:
    'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  github:
    'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  gitlab:
    'm23.6004 9.5927-.0337-.0862L20.3.9814a.851.851 0 0 0-.3362-.405.8748.8748 0 0 0-.9997.0539.8748.8748 0 0 0-.29.4399l-2.2055 6.748H7.5375l-2.2057-6.748a.8573.8573 0 0 0-.29-.4412.8748.8748 0 0 0-.9997-.0537.8585.8585 0 0 0-.3362.4049L.4332 9.5015l-.0325.0862a6.0657 6.0657 0 0 0 2.0119 7.0105l.0113.0087.03.0213 4.976 3.7264 2.462 1.8633 1.4995 1.1321a1.0085 1.0085 0 0 0 1.2197 0l1.4995-1.1321 2.4619-1.8633 5.006-3.7489.0125-.01a6.0682 6.0682 0 0 0 2.0094-7.003z',
  twitter:
    'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z',
}

/** Play colour each logo fills with on hover (palette colours, not brand colours). */
const HOVER_COLORS: Record<SocialLink['key'], { fill: string; ink: string }> = {
  linkedin: { fill: 'var(--sky)', ink: 'var(--on-accent)' },
  github: { fill: 'var(--violet)', ink: 'var(--paper)' },
  gitlab: { fill: 'var(--lime)', ink: 'var(--on-accent)' },
  twitter: { fill: 'var(--ink)', ink: 'var(--paper)' },
}

/**
 * Social profiles in the hero, in place of the availability badge. Plain links (they work
 * without JavaScript); the hover lift, tilt, colour fill and label are CSS only.
 */
export function SocialLinks({ label, new_tab, links }: SocialLinksProps): ReactElement {
  return (
    <nav aria-label={label} className="hero-fade mb-6">
      <ul className="flex items-center gap-2.5">
        {links.map((link, index) => (
          <li
            key={link.key}
            className="social-item"
            style={{ '--social-index': index } as CSSProperties}
          >
            <a
              href={link.url}
              target="_blank"
              rel="me noopener noreferrer"
              className="social-link pressable group relative grid size-10 place-items-center rounded-full border border-line bg-paper-raised text-ink"
              style={
                {
                  '--social-fill': HOVER_COLORS[link.key].fill,
                  '--social-ink': HOVER_COLORS[link.key].ink,
                } as CSSProperties
              }
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-[1.125rem]"
                fill="currentColor"
              >
                <path d={ICON_PATHS[link.key]} />
              </svg>
              <span className="sr-only">
                {link.label} ({new_tab})
              </span>
              <span aria-hidden="true" className="social-tip">
                {link.label}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
