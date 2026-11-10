import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
import {
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
} from 'react'

import { SPRING_SNAPPY, SPRING_TILT } from '../../lib/motion'
import { selection_store } from '../../lib/selection-store'
import { useScrollReveal } from '../../lib/use-scroll-reveal'
import { ProjectDrawer } from './ProjectDrawer'
import { ProjectMediaView } from './ProjectMediaView'
import type { ProjectCard, ProjectsLabels } from './types'

export interface ProjectGridProps {
  projects: ProjectCard[]
  labels: ProjectsLabels
}

const MAX_TILT_DEG = 6
/** Wide cards tilt less: the same angle moves their far edge twice as much. */
const MAX_TILT_FEATURED_DEG = 3

export function ProjectGrid({ projects, labels }: ProjectGridProps): ReactElement {
  const [open_index, setOpenIndex] = useState<number | null>(null)
  const selection = useSyncExternalStore(
    selection_store.subscribe,
    selection_store.getSnapshot,
    selection_store.getServerSnapshot,
  )

  const columns = gridColumns(projects)

  return (
    <>
      <ul className="grid gap-6 md:grid-cols-2">
        {projects.map((project, index) => {
          const is_match =
            selection.active !== null && project.techs.some((tech) => tech.id === selection.active)
          const is_dimmed = selection.active !== null && !is_match
          return (
            <li
              key={project.slug}
              id={`project-${project.slug}`}
              data-featured={project.featured || undefined}
              className={`scroll-mt-24 ${project.featured ? 'md:col-span-2' : ''}`}
            >
              <RevealOnScroll column={columns[index] ?? 0}>
                <TiltCard
                  project={project}
                  is_match={is_match}
                  is_dimmed={is_dimmed}
                  open_label={labels.open}
                  onOpen={() => setOpenIndex(index)}
                />
              </RevealOnScroll>
            </li>
          )
        })}
      </ul>

      <ProjectDrawer
        projects={projects}
        labels={labels}
        index={open_index}
        onIndexChange={setOpenIndex}
        onClose={() => setOpenIndex(null)}
      />
    </>
  )
}

/** Column of each card in the two-column grid; featured cards take a full row. */
function gridColumns(projects: ProjectCard[]): number[] {
  let column = 0
  return projects.map((project) => {
    if (project.featured) {
      column = 0
      return 0
    }
    const current = column
    column = (column + 1) % 2
    return current
  })
}

/** Cards rise in as they are scrolled to; the right column trails the left by 90 ms. */
function RevealOnScroll({
  column,
  children,
}: {
  column: number
  children: ReactNode
}): ReactElement {
  const { ref, state } = useScrollReveal<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className="project-reveal"
      data-reveal-state={state}
      style={{ '--reveal-index': column } as CSSProperties}
    >
      {children}
    </div>
  )
}

interface TiltCardProps {
  project: ProjectCard
  is_match: boolean
  is_dimmed: boolean
  open_label: string
  onOpen: () => void
}

function TiltCard({
  project,
  is_match,
  is_dimmed,
  open_label,
  onOpen,
}: TiltCardProps): ReactElement {
  const reduce_motion = useReducedMotion() ?? false
  const pointer_x = useMotionValue(0.5)
  const pointer_y = useMotionValue(0.5)
  const max_tilt = project.featured ? MAX_TILT_FEATURED_DEG : MAX_TILT_DEG
  const rotate_x = useTiltAxis(pointer_y, max_tilt)
  const rotate_y = useTiltAxis(pointer_x, -max_tilt)

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>): void => {
    if (event.pointerType !== 'mouse' || reduce_motion) return
    const rect = event.currentTarget.getBoundingClientRect()
    pointer_x.set((event.clientX - rect.left) / rect.width)
    pointer_y.set((event.clientY - rect.top) / rect.height)
  }

  const resetTilt = (): void => {
    pointer_x.set(0.5)
    pointer_y.set(0.5)
  }

  return (
    <motion.div
      animate={{ opacity: is_dimmed ? 0.35 : 1, scale: is_dimmed ? 0.98 : 1 }}
      transition={SPRING_SNAPPY}
      style={{ perspective: 900 }}
      data-state={is_match ? 'match' : is_dimmed ? 'dimmed' : 'idle'}
    >
      <motion.button
        type="button"
        onClick={onOpen}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
        aria-label={`${open_label}: ${project.title}`}
        style={{ rotateX: rotate_x, rotateY: rotate_y }}
        className={`pressable group block w-full overflow-hidden rounded-lg border bg-paper-raised text-left shadow-card transition-[border-color,box-shadow,scale] duration-200 pointer-fine:hover:shadow-lift ${
          is_match ? 'border-accent ring-2 ring-accent/40' : 'border-line'
        } ${project.featured ? 'md:grid md:grid-cols-[3fr_2fr]' : ''}`}
      >
        <div
          className={`project-media aspect-[16/10] overflow-hidden border-b border-line ${
            project.featured ? 'md:aspect-auto md:h-full md:border-r md:border-b-0' : ''
          }`}
        >
          <ProjectMediaView media={project.media[0]} title={project.title} eager={false} />
        </div>
        <div className="p-6">
          <p className="font-mono text-small text-ink-muted">
            {project.company} · {project.period}
          </p>
          <h3 className="mt-2 text-title font-bold">{project.title}</h3>
          <p className="mt-1 text-ink-muted">{project.summary}</p>
          <ul
            className="mt-4 flex flex-wrap gap-1.5"
            aria-label={project.techs.map((tech) => tech.label).join(', ')}
          >
            {project.techs.slice(0, 5).map((tech) => (
              <li
                key={tech.id}
                className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[0.75rem]"
              >
                {tech.label}
              </li>
            ))}
            {project.techs.length > 5 && (
              <li className="px-1 font-mono text-[0.75rem] text-ink-muted">
                +{project.techs.length - 5}
              </li>
            )}
          </ul>
        </div>
      </motion.button>
    </motion.div>
  )
}

function useTiltAxis(pointer: MotionValue<number>, max_deg: number): MotionValue<number> {
  const raw = useTransform(pointer, [0, 1], [max_deg, -max_deg])
  return useSpring(raw, SPRING_TILT)
}
