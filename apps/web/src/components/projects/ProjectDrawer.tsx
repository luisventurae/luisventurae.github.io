import { AnimatePresence, motion, useIsPresent, useReducedMotion, type PanInfo } from 'motion/react'
import { useEffect, useRef, useState, type KeyboardEvent, type ReactElement } from 'react'
import { Drawer } from 'vaul'

import { projectOrigin } from '../../lib/projects'
import { resolveSwipe } from '../../lib/swipe'
import { ProjectMediaView } from './ProjectMediaView'
import type { ProjectCard, ProjectsLabels } from './types'

export interface ProjectDrawerProps {
  projects: ProjectCard[]
  labels: ProjectsLabels
  index: number | null
  onIndexChange: (index: number) => void
  onClose: () => void
}

type ChangeSource = 'gesture' | 'keyboard'

export function ProjectDrawer(props: ProjectDrawerProps): ReactElement {
  const { projects, labels, index, onIndexChange, onClose } = props
  const reduce_motion = useReducedMotion() ?? false
  const [change, setChange] = useState<{ direction: number; source: ChangeSource }>({
    direction: 0,
    source: 'gesture',
  })
  const scroll_ref = useRef<HTMLDivElement>(null)
  const content_ref = useRef<HTMLDivElement>(null)
  const trigger_ref = useRef<HTMLElement | null>(null)
  /** Anchor to visit once the drawer has closed (the link back to the job). */
  const pending_hash_ref = useRef<string | null>(null)
  const project = index === null ? undefined : projects[index]

  useEffect(() => {
    if (scroll_ref.current) scroll_ref.current.scrollTop = 0
  }, [index])

  const goTo = (target: number, source: ChangeSource): void => {
    if (index === null || target === index || target < 0 || target >= projects.length) return
    setChange({ direction: target > index ? 1 : -1, source })
    onIndexChange(target)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (index === null) return
    if (event.key === 'ArrowRight') goTo(index + 1, 'keyboard')
    if (event.key === 'ArrowLeft') goTo(index - 1, 'keyboard')
  }

  const handleDragEnd = (_event: unknown, info: PanInfo): void => {
    if (index === null) return
    const target = resolveSwipe({
      index,
      count: projects.length,
      offset_x: info.offset.x,
      velocity_x: info.velocity.x,
    })
    goTo(target, 'gesture')
  }

  const slide: SlideCustom = {
    direction: change.direction,
    instant: reduce_motion || change.source === 'keyboard',
  }
  const is_first = index === 0
  const is_last = index === projects.length - 1

  return (
    <Drawer.Root
      open={project !== undefined}
      onOpenChange={(open) => !open && onClose()}
      handleOnly
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-ink/40" />
        <Drawer.Content
          ref={content_ref}
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          onOpenAutoFocus={(event) => {
            // Remember the card that opened the drawer and move focus inside for ← / →.
            event.preventDefault()
            trigger_ref.current =
              document.activeElement instanceof HTMLElement ? document.activeElement : null
            content_ref.current?.focus()
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault()
            const pending_hash = pending_hash_ref.current
            pending_hash_ref.current = null
            // Navigate only after the scroll lock is gone; focusing the trigger would undo it.
            if (pending_hash) window.location.hash = pending_hash
            else trigger_ref.current?.focus()
          }}
          className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[92dvh] max-w-4xl flex-col rounded-t-lg bg-paper-raised outline-none"
        >
          <Drawer.Handle className="mt-3 mb-1 !h-1.5 !w-12 !bg-line" />
          {project && (
            <>
              <div className="flex items-center justify-between gap-4 px-6 pt-2 pb-3">
                <p className="font-mono text-small text-ink-muted" aria-live="polite">
                  {(index ?? 0) + 1} / {projects.length}
                  <span className="ml-3 hidden sm:inline">· {labels.swipe_hint}</span>
                </p>
                <div className="flex gap-2">
                  <NavButton
                    label={labels.previous}
                    disabled={is_first}
                    onClick={() => goTo((index ?? 0) - 1, 'gesture')}
                  >
                    ←
                  </NavButton>
                  <NavButton
                    label={labels.next}
                    disabled={is_last}
                    onClick={() => goTo((index ?? 0) + 1, 'gesture')}
                  >
                    →
                  </NavButton>
                  <Drawer.Close
                    aria-label={labels.close}
                    className="pressable grid size-10 place-items-center rounded-full border border-line pointer-fine:hover:border-ink"
                  >
                    ✕
                  </Drawer.Close>
                </div>
              </div>

              <div ref={scroll_ref} className="overflow-y-auto overscroll-contain px-6 pb-10">
                <AnimatePresence mode="popLayout" initial={false} custom={slide}>
                  <motion.article
                    key={project.slug}
                    custom={slide}
                    variants={SLIDE_VARIANTS}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={{ left: is_last ? 0.08 : 0.5, right: is_first ? 0.08 : 0.5 }}
                    dragMomentum={false}
                    onDragEnd={handleDragEnd}
                    className="touch-pan-y"
                  >
                    <ProjectDetail
                      project={project}
                      labels={labels}
                      onEmployerClick={(hash) => {
                        pending_hash_ref.current = hash
                        onClose()
                      }}
                    />
                  </motion.article>
                </AnimatePresence>
              </div>
            </>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

interface SlideCustom {
  direction: number
  instant: boolean
}

const SLIDE_TRANSITION = { duration: 0.32, ease: [0.23, 1, 0.32, 1] } as const
const NO_TRANSITION = { duration: 0 } as const

/** Keyboard navigation and reduced motion swap content instantly (no slide). */
const SLIDE_VARIANTS = {
  enter: ({ direction, instant }: SlideCustom) =>
    instant
      ? { opacity: 1, x: '0%', filter: 'blur(0px)' }
      : { opacity: 0, x: `${direction * 24}%`, filter: 'blur(4px)' },
  center: ({ instant }: SlideCustom) => ({
    opacity: 1,
    x: '0%',
    filter: 'blur(0px)',
    transition: instant ? NO_TRANSITION : SLIDE_TRANSITION,
  }),
  exit: ({ direction, instant }: SlideCustom) =>
    instant
      ? { opacity: 0, transition: NO_TRANSITION }
      : { opacity: 0, x: `${direction * -24}%`, filter: 'blur(4px)', transition: SLIDE_TRANSITION },
}

/**
 * While the previous project slides out, its copy stays in the DOM: it is hidden from
 * assistive tech and keyboard, and only the entering one owns the dialog title.
 */
function ProjectDetail({
  project,
  labels,
  onEmployerClick,
}: {
  project: ProjectCard
  labels: ProjectsLabels
  onEmployerClick: (hash: string) => void
}): ReactElement {
  const is_present = useIsPresent()
  const title_class = 'mt-2 text-display font-extrabold'
  const summary_class = 'mt-2 text-title leading-snug text-ink-muted'
  return (
    <div aria-hidden={!is_present} inert={!is_present}>
      <div className="aspect-[16/9] overflow-hidden rounded-lg border border-line">
        <ProjectMediaView media={project.media[0]} title={project.title} eager />
      </div>
      <header className="mt-6">
        <p className="font-mono text-small text-ink-muted">
          <EmployerLink project={project} labels={labels} onClick={onEmployerClick} /> ·{' '}
          <span className="sr-only">{labels.period}: </span>
          {project.period}
        </p>
        <p className="mt-1 font-mono text-small text-accent-ink">
          {labels.role}: {project.role}
        </p>
        {is_present ? (
          <Drawer.Title className={title_class}>{project.title}</Drawer.Title>
        ) : (
          <h2 className={title_class}>{project.title}</h2>
        )}
        {is_present ? (
          <Drawer.Description className={summary_class}>{project.summary}</Drawer.Description>
        ) : (
          <p className={summary_class}>{project.summary}</p>
        )}
      </header>
      <div
        className="project-body mt-6 max-w-[65ch] space-y-4"
        // Trusted: rendered at build time from our own markdown (src/content).
        dangerouslySetInnerHTML={{ __html: project.body_html }}
      />
      <h4 className="mt-8 font-mono text-small text-ink-muted">{labels.technologies}</h4>
      <ul className="mt-3 flex flex-wrap gap-2">
        {project.techs.map((tech) => (
          <li
            key={tech.id}
            className="rounded-full border border-line px-3 py-1 text-small font-semibold"
          >
            {tech.label}
          </li>
        ))}
      </ul>
      {project.url && (
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="pressable mt-8 inline-flex rounded-md bg-accent px-5 py-3 font-semibold text-on-accent"
        >
          {labels.visit} ↗
        </a>
      )}
    </div>
  )
}

/** Links a case study back to its job in the experience timeline; personal projects get a label. */
function EmployerLink({
  project,
  labels,
  onClick,
}: {
  project: ProjectCard
  labels: ProjectsLabels
  onClick: (hash: string) => void
}): ReactElement {
  const origin = projectOrigin(project.employer, labels)
  if (!project.employer) return <>{origin}</>
  const hash = `#experience-${project.employer.experience_id}`
  return (
    <a
      href={hash}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        event.preventDefault()
        onClick(hash)
      }}
      className="text-ink underline decoration-line underline-offset-4 transition-[text-decoration-color] duration-(--duration-fast) ease-[ease] pointer-fine:hover:decoration-ink"
    >
      {origin}
    </a>
  )
}

interface NavButtonProps {
  label: string
  disabled: boolean
  onClick: () => void
  children: string
}

function NavButton({ label, disabled, onClick, children }: NavButtonProps): ReactElement {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="pressable grid size-10 place-items-center rounded-full border border-line disabled:opacity-35 pointer-fine:enabled:hover:border-ink"
    >
      <span aria-hidden="true">{children}</span>
    </button>
  )
}
