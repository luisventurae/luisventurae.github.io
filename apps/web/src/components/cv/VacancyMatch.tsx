import type { VacancyRequirementId } from '@portfolio/shared'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { CSSProperties, ReactElement } from 'react'

import { VACANCY_REQUIREMENTS, type RequirementStrength } from '../../data/vacancy-match'
import { matchScore, requirementStrength } from '../../lib/vacancy-match'

export interface VacancyMatchLabels {
  prompt: string
  hint: string
  empty: string
  score: string
  cta: string
  skip: string
  levels: { met: string; partial: string; unmet: string }
  requirements: Record<VacancyRequirementId, { label: string; proof: string }>
}

export interface VacancyMatchProps {
  selected: VacancyRequirementId[]
  labels: VacancyMatchLabels
  onToggle: (id: VacancyRequirementId) => void
  onContinue: () => void
  /** Hides the call to action once the form is already visible. */
  is_form_open: boolean
}

/** Meter fill: a short, low-bounce spring; it is feedback for a deliberate tap, not decoration. */
const METER_SPRING = { type: 'spring', duration: 0.5, bounce: 0.2 } as const
/** Evidence lines: enter with ease-out, leave faster than they came. */
const EVIDENCE_ENTER = { duration: 0.2, ease: [0.23, 1, 0.32, 1] } as const
const EVIDENCE_EXIT = { duration: 0.12, ease: [0.23, 1, 0.32, 1] } as const

/** The number confirms each change with a quick, slightly bouncy pop. */
const SCORE_POP = { type: 'spring', duration: 0.35, bounce: 0.35 } as const

const LEVEL_KEY: Record<RequirementStrength, keyof VacancyMatchLabels['levels']> = {
  1: 'met',
  0.5: 'partial',
  0: 'unmet',
}
const LEVEL_MARK: Record<RequirementStrength, string> = { 1: '✓', 0.5: '~', 0: '✕' }

export function VacancyMatch(props: VacancyMatchProps): ReactElement {
  const { selected, labels } = props
  const score = matchScore(selected)

  return (
    <div
      className="reveal-item grid gap-8 rounded-lg border border-line bg-paper-raised p-6 shadow-card md:p-8"
      style={{ '--reveal-distance': '32px' } as CSSProperties}
    >
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-[52ch]">
          <h3 className="text-title font-bold">{labels.prompt}</h3>
          <p className="mt-1 text-ink-muted">{labels.hint}</p>
        </div>
        <button
          type="button"
          onClick={props.onContinue}
          className="pressable text-small font-semibold text-ink-muted underline underline-offset-4 transition-[color,scale] duration-(--duration-fast) ease-[ease] pointer-fine:hover:text-ink"
        >
          {`${labels.skip}\u00a0↓`}
        </button>
      </header>

      <ul className="flex flex-wrap gap-2" aria-label={labels.prompt}>
        {VACANCY_REQUIREMENTS.map(({ id }, index) => {
          const is_selected = selected.includes(id)
          return (
            <li
              key={id}
              className="reveal-item"
              style={{ '--reveal-index': index + 2, '--reveal-distance': '10px' } as CSSProperties}
            >
              <button
                type="button"
                aria-pressed={is_selected}
                onClick={() => props.onToggle(id)}
                className={`pressable rounded-full border px-4 py-2 text-small font-semibold transition-[background-color,border-color,color,scale] duration-(--duration-fast) ease-[ease] ${
                  is_selected
                    ? 'border-ink bg-ink text-paper'
                    : 'border-line bg-paper pointer-fine:hover:border-ink'
                }`}
              >
                {labels.requirements[id].label}
              </button>
            </li>
          )
        })}
      </ul>

      <MatchMeter score={score} labels={labels} />
      <EvidenceList selected={selected} labels={labels} />

      <AnimatePresence initial={false}>
        {score !== null && !props.is_form_open && (
          <motion.button
            key="cta"
            type="button"
            onClick={props.onContinue}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0, transition: EVIDENCE_ENTER }}
            exit={{ opacity: 0, transition: EVIDENCE_EXIT }}
            className="pressable justify-self-start rounded-md bg-accent px-6 py-3 font-semibold text-on-accent shadow-card"
          >
            {`${labels.cta}\u00a0→`}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

function MatchMeter({
  score,
  labels,
}: {
  score: number | null
  labels: VacancyMatchLabels
}): ReactElement {
  const reduce_motion = useReducedMotion() ?? false
  return (
    <div>
      <p
        aria-live="polite"
        className="mb-2 flex items-baseline justify-between font-mono text-small"
      >
        {score === null ? (
          <span className="text-ink-muted">{labels.empty}</span>
        ) : (
          <>
            <span className="text-ink-muted">{labels.score}</span>
            <motion.span
              key={score}
              className="inline-block origin-right text-title font-bold tabular-nums"
              initial={reduce_motion ? false : { scale: 0.85, opacity: 0.4 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={SCORE_POP}
            >
              {score}%
            </motion.span>
          </>
        )}
      </p>
      <div aria-hidden="true" className="relative h-3 overflow-hidden rounded-full bg-line/70">
        <motion.div
          className="h-full origin-left rounded-full bg-lime"
          initial={false}
          animate={{ scaleX: (score ?? 0) / 100 }}
          transition={reduce_motion ? { duration: 0 } : METER_SPRING}
        />
        {score === 100 && <span className="meter-shine" />}
      </div>
    </div>
  )
}

function EvidenceList({
  selected,
  labels,
}: {
  selected: VacancyRequirementId[]
  labels: VacancyMatchLabels
}): ReactElement {
  const reduce_motion = useReducedMotion() ?? false
  const offset = reduce_motion ? 0 : 4
  return (
    <ul className="grid gap-2">
      <AnimatePresence initial={false} mode="popLayout">
        {selected.map((id) => {
          const strength = requirementStrength(id)
          return (
            <motion.li
              key={id}
              layout={!reduce_motion}
              initial={{ opacity: 0, y: offset }}
              animate={{ opacity: 1, y: 0, transition: EVIDENCE_ENTER }}
              exit={{ opacity: 0, transition: EVIDENCE_EXIT }}
              className="flex gap-3 text-small"
            >
              <span
                className={`font-mono font-bold ${strength === 1 ? 'text-ink' : 'text-ink-muted'}`}
              >
                <span aria-hidden="true">{LEVEL_MARK[strength]}</span>
                <span className="sr-only">{labels.levels[LEVEL_KEY[strength]]}</span>
              </span>
              <span>
                <strong className="font-semibold">{labels.requirements[id].label}</strong>
                <span className="text-ink-muted"> — {labels.requirements[id].proof}</span>
              </span>
            </motion.li>
          )
        })}
      </AnimatePresence>
    </ul>
  )
}
