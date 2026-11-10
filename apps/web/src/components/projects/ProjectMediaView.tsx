import type { ReactElement } from 'react'

import type { ProjectMedia } from './types'

interface ProjectMediaViewProps {
  media: ProjectMedia | undefined
  title: string
  eager: boolean
}

export function initials(title: string): string {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
}

/** Project image, or a styled placeholder with the initials while media is pending. */
export function ProjectMediaView({ media, title, eager }: ProjectMediaViewProps): ReactElement {
  if (!media) {
    return (
      <div
        role="img"
        aria-label={title}
        className="grid size-full place-items-center bg-gradient-to-br from-paper to-line font-display text-display font-extrabold text-ink-muted"
      >
        {initials(title)}
      </div>
    )
  }

  return (
    <img
      src={media.src}
      srcSet={media.srcset}
      sizes="(min-width: 768px) 50vw, 100vw"
      width={media.width}
      height={media.height}
      alt={media.alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      className="size-full object-cover object-top transition-transform duration-500 ease-out-strong pointer-fine:group-hover:scale-[1.03]"
    />
  )
}
