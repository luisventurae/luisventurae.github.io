import { useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState, type KeyboardEvent, type ReactElement } from 'react'

import { fillTemplate, slideIndexFromScroll } from '../../lib/gallery'
import { ProjectMediaView } from './ProjectMediaView'
import type { ProjectMedia, ProjectsLabels } from './types'

type GalleryLabels = Pick<
  ProjectsLabels,
  | 'gallery'
  | 'carousel'
  | 'slide'
  | 'mobile_view'
  | 'desktop_view'
  | 'previous_image'
  | 'next_image'
  | 'go_to_image'
>

interface ProjectGalleryProps {
  media: ProjectMedia[]
  title: string
  labels: GalleryLabels
}

/**
 * Screenshot slider for the case study drawer: a native scroll-snap track (touch swipe with
 * real momentum), arrow buttons for pointers, dots and ← / → while it has focus.
 * Swipes on the track never reach the drawer, so they change the screenshot, not the project.
 */
export function ProjectGallery({ media, title, labels }: ProjectGalleryProps): ReactElement {
  const reduce_motion = useReducedMotion() ?? false
  const track_ref = useRef<HTMLDivElement>(null)
  const frame_ref = useRef(0)
  const [active, setActive] = useState(0)
  const count = media.length

  useEffect(() => {
    const track = track_ref.current
    if (!track) return
    // Native listener: the drawer's drag starts on pointerdown, before React's root handler.
    const stopDrawerDrag = (event: PointerEvent): void => event.stopPropagation()
    track.addEventListener('pointerdown', stopDrawerDrag)
    return () => track.removeEventListener('pointerdown', stopDrawerDrag)
  }, [])

  useEffect(() => () => cancelAnimationFrame(frame_ref.current), [])

  if (count === 0) {
    return (
      <div className="aspect-[16/10] overflow-hidden rounded-lg border border-line">
        <ProjectMediaView media={undefined} title={title} eager />
      </div>
    )
  }

  const goTo = (target: number, instant: boolean): void => {
    const next = Math.min(count - 1, Math.max(0, target))
    setActive(next)
    const track = track_ref.current
    track?.scrollTo({
      left: next * track.clientWidth,
      behavior: instant || reduce_motion ? 'instant' : 'smooth',
    })
  }

  const handleScroll = (): void => {
    cancelAnimationFrame(frame_ref.current)
    frame_ref.current = requestAnimationFrame(() => {
      const track = track_ref.current
      if (track) setActive(slideIndexFromScroll(track.scrollLeft, track.clientWidth, count))
    })
  }

  return (
    <div
      role="region"
      aria-roledescription={labels.carousel}
      aria-label={fillTemplate(labels.gallery, { title })}
    >
      <div className="relative">
        <div
          ref={track_ref}
          onScroll={handleScroll}
          className="gallery-track flex aspect-[16/10] max-h-[min(52dvh,30rem)] w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-lg border border-line bg-paper"
        >
          {media.map((item, index) => (
            <GallerySlide
              key={item.src}
              media={item}
              label={`${index + 1} / ${count}`}
              roledescription={labels.slide}
              view_label={item.frame === 'mobile' ? labels.mobile_view : labels.desktop_view}
              eager={index === 0}
            />
          ))}
        </div>
        {count > 1 && (
          <>
            <GalleryArrow
              side="left"
              label={labels.previous_image}
              disabled={active === 0}
              onClick={() => goTo(active - 1, false)}
            />
            <GalleryArrow
              side="right"
              label={labels.next_image}
              disabled={active === count - 1}
              onClick={() => goTo(active + 1, false)}
            />
          </>
        )}
      </div>
      {count > 1 && (
        <GalleryDots count={count} active={active} label={labels.go_to_image} onSelect={goTo} />
      )}
    </div>
  )
}

interface GallerySlideProps {
  media: ProjectMedia
  label: string
  roledescription: string
  view_label: string
  eager: boolean
}

/** Desktop captures fill the frame; phone captures sit in a device outline on paper. */
function GallerySlide(props: GallerySlideProps): ReactElement {
  const { media, label, roledescription, view_label, eager } = props
  const is_mobile = media.frame === 'mobile'
  return (
    <div
      role="group"
      aria-roledescription={roledescription}
      aria-label={label}
      data-frame={media.frame}
      className="relative grid w-full shrink-0 snap-center snap-always place-items-center overflow-hidden"
    >
      {is_mobile ? (
        <div className="gallery-phone h-[88%] overflow-hidden rounded-[1.4rem] border-[5px] border-ink bg-ink shadow-lift">
          <GalleryImage media={media} eager={eager} sizes="(min-width: 768px) 260px, 45vw" />
        </div>
      ) : (
        <GalleryImage media={media} eager={eager} sizes="(min-width: 768px) 880px, 100vw" />
      )}
      <span
        aria-hidden="true"
        className="absolute top-3 left-3 rounded-full border border-line bg-paper-raised/90 px-2.5 py-0.5 font-mono text-[0.75rem] text-ink-muted"
      >
        {view_label}
      </span>
    </div>
  )
}

function GalleryImage({
  media,
  eager,
  sizes,
}: {
  media: ProjectMedia
  eager: boolean
  sizes: string
}): ReactElement {
  return (
    <img
      src={media.src}
      srcSet={media.srcset}
      sizes={sizes}
      width={media.width}
      height={media.height}
      alt={media.alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      className={
        media.frame === 'mobile'
          ? 'h-full w-auto rounded-[1rem] object-cover object-top'
          : 'size-full object-cover object-top'
      }
    />
  )
}

interface GalleryArrowProps {
  side: 'left' | 'right'
  label: string
  disabled: boolean
  onClick: () => void
}

/** Only for fine pointers: touch swipes the track, keyboard uses ← / →. */
function GalleryArrow({ side, label, disabled, onClick }: GalleryArrowProps): ReactElement {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`gallery-arrow pressable absolute top-1/2 hidden size-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-paper-raised/90 shadow-card disabled:opacity-0 pointer-fine:grid pointer-fine:enabled:hover:border-ink ${
        side === 'left' ? 'left-3' : 'right-3'
      }`}
    >
      <span aria-hidden="true">{side === 'left' ? '←' : '→'}</span>
    </button>
  )
}

interface GalleryDotsProps {
  count: number
  active: number
  /** Template with `{n}` and `{count}`. */
  label: string
  onSelect: (index: number, instant: boolean) => void
}

/**
 * One tab stop (roving tabindex, like a tablist): ← / → move the screenshot and the focus.
 * They stop there, so the drawer does not also change project.
 */
function GalleryDots({ count, active, label, onSelect }: GalleryDotsProps): ReactElement {
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    event.stopPropagation()
    const next = Math.min(count - 1, Math.max(0, active + (event.key === 'ArrowRight' ? 1 : -1)))
    onSelect(next, true)
    const target = event.currentTarget.parentElement?.children.item(next)
    if (target instanceof HTMLElement) target.focus()
  }

  return (
    <div className="mt-2 flex justify-center">
      {Array.from({ length: count }, (_, index) => {
        const is_active = index === active
        return (
          <button
            key={index}
            type="button"
            aria-label={fillTemplate(label, { n: index + 1, count })}
            aria-current={is_active ? 'true' : undefined}
            tabIndex={is_active ? 0 : -1}
            onClick={() => onSelect(index, false)}
            onKeyDown={handleKeyDown}
            className="group/dot grid size-6 place-items-center"
          >
            <span
              aria-hidden="true"
              className={`size-2 rounded-full transition-[scale,background-color] duration-(--duration-fast) ease-out-strong ${
                is_active ? 'scale-125 bg-ink' : 'bg-line pointer-fine:group-hover/dot:bg-ink-muted'
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}
