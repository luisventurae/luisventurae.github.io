import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react'
import { useState, useSyncExternalStore, type CSSProperties, type ReactElement } from 'react'

import { SKILL_TIERS, type SkillCategory, type SkillTier } from '../../data/skills'
import { SPRING_SNAPPY } from '../../lib/motion'
import { selection_store } from '../../lib/selection-store'

export interface StackSkill {
  id: string
  label: string
  category: SkillCategory
  tier: SkillTier
  project_count: number
}

export interface StackMapProps {
  skills: StackSkill[]
  labels: {
    all: string
    categories: Record<SkillCategory, string>
    tiers: Record<SkillTier, string>
    tiers_legend: string
    no_projects: string
    used_in: string[]
    clear: string
    see_projects: string
  }
}

type Filter = SkillCategory | 'all'

const FILTERS: Filter[] = ['all', 'backend', 'frontend', 'other']
const CATEGORY_COLOR: Record<SkillCategory, string> = {
  backend: 'var(--violet)',
  frontend: 'var(--lime)',
  other: 'var(--sky)',
}

const CHIP_SIZE: Record<SkillTier, string> = {
  daily: 'text-xl font-bold px-5 py-2.5',
  production: 'text-base font-semibold px-4 py-2',
  exploring: 'text-small font-medium px-3 py-1.5',
}

/** Visual weight by usage tier: bigger and bolder means used more, never a self-rating. */
export function chipSize(tier: SkillTier): string {
  return CHIP_SIZE[tier]
}

export function StackMap({ skills, labels }: StackMapProps): ReactElement {
  const [filter, setFilter] = useState<Filter>('all')
  const selection = useSyncExternalStore(
    selection_store.subscribe,
    selection_store.getSnapshot,
    selection_store.getServerSnapshot,
  )
  const reduce_motion = useReducedMotion() ?? false
  const visible = skills.filter((skill) => filter === 'all' || skill.category === filter)
  const selected = skills.find((skill) => skill.id === selection.selected)

  return (
    <div>
      <LayoutGroup>
        <div role="group" aria-label={labels.all} className="mb-8 flex flex-wrap gap-2">
          {FILTERS.map((item) => {
            const is_active = filter === item
            return (
              <button
                key={item}
                type="button"
                aria-pressed={is_active}
                onClick={() => setFilter(item)}
                className="pressable relative rounded-full px-4 py-2 text-small font-semibold"
              >
                {is_active && (
                  <motion.span
                    layoutId="stack-filter-pill"
                    transition={reduce_motion ? { duration: 0 } : SPRING_SNAPPY}
                    className="absolute inset-0 rounded-full bg-ink"
                  />
                )}
                <span
                  className={`relative transition-colors duration-150 ${is_active ? 'text-paper' : 'text-ink-muted'}`}
                >
                  {item === 'all' ? labels.all : labels.categories[item]}
                </span>
              </button>
            )
          })}
        </div>

        <motion.ul layout className="flex flex-wrap gap-2.5">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((skill) => (
              <SkillChip
                key={skill.id}
                skill={skill}
                is_selected={selection.selected === skill.id}
                is_dimmed={selection.active !== null && selection.active !== skill.id}
                reduce_motion={reduce_motion}
              />
            ))}
          </AnimatePresence>
        </motion.ul>
      </LayoutGroup>

      <TierLegend labels={labels} />

      <p className="mt-8 min-h-[1.6em] font-mono text-small text-ink-muted" aria-live="polite">
        {selected && <SelectionSummary skill={selected} labels={labels} />}
      </p>
    </div>
  )
}

interface SkillChipProps {
  skill: StackSkill
  is_selected: boolean
  is_dimmed: boolean
  reduce_motion: boolean
}

function SkillChip({ skill, is_selected, is_dimmed, reduce_motion }: SkillChipProps): ReactElement {
  const color = CATEGORY_COLOR[skill.category]

  return (
    <motion.li
      layout={!reduce_motion}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: is_dimmed ? 0.45 : 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={SPRING_SNAPPY}
    >
      <button
        type="button"
        aria-pressed={is_selected}
        onClick={() => selection_store.toggle(skill.id)}
        onPointerEnter={(event) =>
          event.pointerType === 'mouse' && selection_store.preview(skill.id)
        }
        onPointerLeave={() => selection_store.preview(null)}
        onFocus={() => selection_store.preview(skill.id)}
        onBlur={() => selection_store.preview(null)}
        style={{ '--chip-color': color } as CSSProperties}
        className={`pressable flex items-center gap-2 rounded-full border font-display transition-[background-color,border-color,color] duration-150 ${chipSize(skill.tier)} ${
          is_selected
            ? 'border-transparent bg-(--chip-color) text-on-accent'
            : 'border-line bg-paper-raised pointer-fine:hover:border-(--chip-color)'
        }`}
      >
        <span aria-hidden="true" className="size-2 rounded-full bg-(--chip-color)" />
        {skill.label}
        {skill.project_count > 0 && (
          <span className="rounded-full bg-ink/8 px-1.5 font-mono text-[0.7em] tabular-nums">
            {skill.project_count}
          </span>
        )}
      </button>
    </motion.li>
  )
}

function SelectionSummary({
  skill,
  labels,
}: {
  skill: StackSkill
  labels: StackMapProps['labels']
}): ReactElement {
  if (skill.project_count === 0) {
    return (
      <>
        <strong className="text-ink">{skill.label}</strong> — {labels.no_projects}{' '}
        <ClearButton label={labels.clear} />
      </>
    )
  }
  const used_in = labels.used_in[Math.min(skill.project_count, 2) - 1] ?? ''
  return (
    <>
      <strong className="text-ink">{skill.label}</strong> —{' '}
      {used_in.replace('{count}', String(skill.project_count))}.{' '}
      <a href="#projects" className="text-accent-ink underline underline-offset-4">
        {labels.see_projects} ↓
      </a>{' '}
      <ClearButton label={labels.clear} />
    </>
  )
}

function TierLegend({ labels }: { labels: StackMapProps['labels'] }): ReactElement {
  return (
    <ul
      aria-label={labels.tiers_legend}
      className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-small text-ink-muted"
    >
      {SKILL_TIERS.map((tier) => (
        <li key={tier} className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className={`rounded-full border border-line font-display leading-none ${TIER_SAMPLE[tier]}`}
          >
            Aa
          </span>
          {labels.tiers[tier]}
        </li>
      ))}
    </ul>
  )
}

const TIER_SAMPLE: Record<SkillTier, string> = {
  daily: 'px-2 py-1 text-base font-bold',
  production: 'px-1.5 py-0.5 text-small font-semibold',
  exploring: 'px-1.5 py-0.5 text-[0.7rem] font-medium',
}

function ClearButton({ label }: { label: string }): ReactElement {
  return (
    <button
      type="button"
      onClick={() => selection_store.clear()}
      className="ml-2 underline underline-offset-4 pointer-fine:hover:text-ink"
    >
      {label}
    </button>
  )
}
