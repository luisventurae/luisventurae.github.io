import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useRef, useState, type ReactElement } from 'react'

import { SPRING_PLAYFUL } from '../../lib/motion'
import { SocialLinks, type SocialLinksProps } from './SocialLinks'
import { useRotatingIndex } from './useRotatingIndex'

export interface HeroProps {
  name: string
  greeting: string
  /** Main role; static so recruiters never wait for it. */
  role: string
  /** Key facts line (years, main stack), already interpolated. */
  facts: string
  /** Social profiles shown above the name. */
  social: SocialLinksProps
  /** Complementary descriptions that rotate under the main role. */
  roles: string[]
  tagline: string
  drag_hint: string
  cta_projects: string
  cta_terminal: string
}

const PLAY_COLORS = ['var(--accent)', 'var(--violet)', 'var(--lime)', 'var(--sky)']
/**
 * Main stack as draggable stickers (decorative: the facts line already states it). Desktop only,
 * in the empty space right of the copy; `depth` staggers their entrance.
 */
const STICKERS = [
  { label: 'Node.js', className: 'right-[30%] bottom-[34%] -rotate-6 bg-lime', depth: 0 },
  { label: 'AWS', className: 'right-[6%] bottom-[40%] rotate-6 bg-sky', depth: 1 },
  {
    label: 'TypeScript',
    className: 'right-[14%] bottom-[8%] -rotate-3 bg-violet text-paper',
    depth: 2,
  },
  { label: 'NestJS', className: 'right-[40%] bottom-[48%] rotate-3 bg-sky', depth: 3 },
  { label: 'MongoDB', className: 'right-[3%] bottom-[18%] -rotate-2 bg-lime', depth: 4 },
  {
    label: 'Claude Code',
    className: 'right-[32%] bottom-[12%] rotate-2 bg-ink text-paper',
    depth: 5,
  },
  {
    label: 'Bedrock',
    className: 'right-[16%] bottom-[52%] -rotate-6 bg-violet text-paper',
    depth: 6,
  },
  { label: 'PostgreSQL', className: 'right-[18%] bottom-[24%] rotate-4 bg-sky', depth: 7 },
]
const ROLE_INTERVAL_MS = 2600

export function Hero(props: HeroProps): ReactElement {
  const reduce_motion = useReducedMotion() ?? false
  const role_index = useRotatingIndex(props.roles.length, ROLE_INTERVAL_MS, reduce_motion)
  const [has_dragged, setHasDragged] = useState(false)
  const bounds_ref = useRef<HTMLDivElement>(null)
  const words = props.name.split(' ')

  return (
    <div ref={bounds_ref} className="relative isolate">
      {STICKERS.map((sticker) => (
        <motion.span
          key={sticker.label}
          drag
          dragConstraints={bounds_ref}
          dragElastic={0.2}
          whileDrag={{ scale: 1.08 }}
          transition={SPRING_PLAYFUL}
          aria-hidden="true"
          className={`hero-sticker absolute z-10 hidden cursor-grab touch-none rounded-full px-4 py-2 font-mono text-small font-semibold text-on-accent shadow-card select-none active:cursor-grabbing lg:block ${sticker.className}`}
          style={{ animationDelay: `${600 + sticker.depth * 80}ms` }}
        >
          {sticker.label}
        </motion.span>
      ))}

      <SocialLinks {...props.social} />

      <p className="font-mono text-small text-ink-muted">{props.greeting}</p>

      <h1 className="relative text-hero font-extrabold">
        <span className="sr-only">{props.name}</span>
        <span aria-hidden="true" className="flex flex-wrap gap-x-[0.25em]">
          {words.map((word, word_index) => (
            <span key={word} className="inline-flex">
              {[...word].map((letter, letter_index) => (
                <DraggableLetter
                  key={`${word}-${letter_index}`}
                  letter={letter}
                  order={word_index * 6 + letter_index}
                  onFirstDrag={() => setHasDragged(true)}
                />
              ))}
              {word_index === words.length - 1 && (
                <span className="hero-letter text-accent" style={{ animationDelay: '520ms' }}>
                  .
                </span>
              )}
            </span>
          ))}
        </span>
      </h1>

      <p
        aria-hidden={has_dragged}
        className="hero-hint mt-3 font-mono text-small text-ink-muted transition-opacity duration-(--duration-base) ease-(--ease-out-strong)"
        style={{ opacity: has_dragged ? 0 : 1 }}
      >
        ↖ {props.drag_hint}
      </p>

      <p
        className="hero-fade mt-8 text-title leading-[1.3] font-semibold"
        style={{ animationDelay: '80ms' }}
      >
        {props.role}
      </p>
      <p
        className="hero-fade mt-2 font-mono text-small text-balance text-ink-muted"
        style={{ animationDelay: '120ms' }}
      >
        {props.facts}
      </p>

      <p
        className="hero-fade mt-4 h-[1.4em] overflow-hidden leading-[1.3] font-semibold"
        style={{ animationDelay: '160ms' }}
        aria-live="off"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={role_index}
            className="block"
            initial={{ opacity: 0, y: '40%', filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: '0%', filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: '-40%', filter: 'blur(4px)' }}
            transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
          >
            {props.roles[role_index]}
          </motion.span>
        </AnimatePresence>
      </p>

      <p className="hero-fade mt-4 max-w-[44ch] text-ink-muted" style={{ animationDelay: '200ms' }}>
        {props.tagline}
      </p>

      <div className="hero-fade mt-10 flex flex-wrap gap-3" style={{ animationDelay: '240ms' }}>
        <a
          href="#projects"
          className="pressable rounded-md bg-accent px-6 py-3 font-semibold text-on-accent shadow-card"
        >
          {props.cta_projects}
        </a>
        <a
          href="#terminal"
          onClick={() => window.dispatchEvent(new CustomEvent('terminal:focus'))}
          className="pressable rounded-md border border-line px-6 py-3 font-semibold pointer-fine:hover:border-ink"
        >
          {props.cta_terminal}
        </a>
      </div>
    </div>
  )
}

interface DraggableLetterProps {
  letter: string
  order: number
  onFirstDrag: () => void
}

function DraggableLetter({ letter, order, onFirstDrag }: DraggableLetterProps): ReactElement {
  const color = PLAY_COLORS[order % PLAY_COLORS.length]

  return (
    <motion.span
      drag
      dragSnapToOrigin
      dragElastic={0.6}
      dragTransition={{ bounceStiffness: 320, bounceDamping: 14 }}
      whileDrag={{ scale: 1.12, rotate: order % 2 === 0 ? -8 : 8, color }}
      whileHover={{ y: -6 }}
      transition={SPRING_PLAYFUL}
      onDragStart={onFirstDrag}
      className="hero-letter inline-block cursor-grab touch-pan-y select-none active:cursor-grabbing pointer-fine:touch-none"
      style={{ animationDelay: `${order * 40}ms` }}
    >
      {letter}
    </motion.span>
  )
}
