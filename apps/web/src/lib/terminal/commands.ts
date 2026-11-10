import { isLocale, type Locale } from '@portfolio/shared'

import { SKILL_TIERS, type SkillCategory, type SkillTier } from '../../data/skills'
import type { UiStrings } from '../../i18n/es'
import type { Theme } from '../theme'
import { parseCommand } from './input'

export const COMMAND_NAMES = [
  'help',
  'whoami',
  'ls',
  'cat',
  'skills',
  'search',
  'lang',
  'theme',
  'contact',
  'clear',
] as const
type CommandName = (typeof COMMAND_NAMES)[number]

export interface TerminalLine {
  kind: 'text' | 'muted' | 'error' | 'accent'
  text: string
}

export type TerminalEffect =
  | { type: 'clear' }
  | { type: 'lang'; locale: Locale }
  | { type: 'theme'; theme: Theme | undefined }
  | { type: 'scroll'; target: 'contact' }
  | { type: 'search'; query: string }

export interface CommandResult {
  lines: TerminalLine[]
  effect?: TerminalEffect
}

interface TerminalProject {
  slug: string
  title: string
  summary: string
  company: string
  period: string
  techs: string[]
}

interface TerminalSkill {
  label: string
  category: SkillCategory
  tier: SkillTier
}

export interface TerminalContext {
  locale: Locale
  messages: UiStrings['terminal']['messages']
  category_labels: Record<SkillCategory, string>
  tier_labels: Record<SkillTier, string>
  whoami: string
  projects: TerminalProject[]
  skills: TerminalSkill[]
}

type Handler = (args: string[], rest: string, context: TerminalContext) => CommandResult

const text = (value: string): TerminalLine => ({ kind: 'text', text: value })
const muted = (value: string): TerminalLine => ({ kind: 'muted', text: value })
const error = (value: string): TerminalLine => ({ kind: 'error', text: value })
const accent = (value: string): TerminalLine => ({ kind: 'accent', text: value })
const usage = (context: TerminalContext, value: string): CommandResult => ({
  lines: [error(context.messages.usage.replace('{usage}', value))],
})

const HANDLERS: Record<CommandName, Handler> = {
  help: (_args, _rest, { messages }) => ({
    lines: [
      muted(messages.help_title),
      ...COMMAND_NAMES.map((name) => text(`  ${name.padEnd(8)} ${messages.help[name]}`)),
    ],
  }),
  whoami: (_args, _rest, context) => ({ lines: [text(context.whoami)] }),
  ls: (args, _rest, context) => {
    if (args[0] !== 'projects') return usage(context, 'ls projects')
    return {
      lines: context.projects.map((project) =>
        text(`  ${project.slug.padEnd(20)} ${project.title} — ${project.summary}`),
      ),
    }
  },
  cat: (args, _rest, context) => {
    const project = context.projects.find((item) => item.slug === args[0]?.toLowerCase())
    if (!args[0]) return usage(context, 'cat <slug>')
    if (!project) return { lines: [error(context.messages.not_found.replace('{slug}', args[0]))] }
    return {
      lines: [
        accent(project.title),
        muted(`${project.company} · ${project.period}`),
        text(project.summary),
        muted(project.techs.join(' · ')),
      ],
    }
  },
  skills: (args, _rest, context) => {
    const requested = args[0]?.toLowerCase()
    if (requested !== undefined && !isCategory(requested)) {
      return { lines: [error(context.messages.categories_hint)] }
    }
    const categories: SkillCategory[] = requested
      ? [requested]
      : (Object.keys(context.category_labels) as SkillCategory[])
    return {
      lines: categories.flatMap((item) => [
        accent(context.category_labels[item]),
        ...skillTierLines(
          context.skills.filter((skill) => skill.category === item),
          context.tier_labels,
        ),
      ]),
    }
  },
  search: (_args, rest, context) =>
    rest.trim()
      ? { lines: [], effect: { type: 'search', query: rest.trim() } }
      : usage(context, 'search <query>'),
  lang: (args, _rest, context) => {
    const locale = args[0]?.toLowerCase()
    if (!isLocale(locale)) return usage(context, 'lang <es|en|fr>')
    return {
      lines: [muted(context.messages.lang_switch.replace('{lang}', locale))],
      effect: { type: 'lang', locale },
    }
  },
  theme: (args, _rest, context) => {
    const requested = args[0]?.toLowerCase()
    if (requested !== undefined && requested !== 'light' && requested !== 'dark') {
      return usage(context, 'theme [light|dark]')
    }
    return { lines: [], effect: { type: 'theme', theme: requested } }
  },
  contact: (_args, _rest, context) => ({
    lines: [muted(context.messages.contact)],
    effect: { type: 'scroll', target: 'contact' },
  }),
  clear: () => ({ lines: [], effect: { type: 'clear' } }),
}

/** Runs a synchronous command. Async work (search) is returned as an effect. */
export function runCommand(input: string, context: TerminalContext): CommandResult {
  const { name, args, rest } = parseCommand(input)
  if (!name) return { lines: [] }
  if (!isCommand(name))
    return { lines: [error(context.messages.unknown.replace('{command}', name))] }
  return HANDLERS[name](args, rest, context)
}

function isCommand(name: string): name is CommandName {
  return (COMMAND_NAMES as readonly string[]).includes(name)
}

function isCategory(value: string): value is SkillCategory {
  return value === 'backend' || value === 'frontend' || value === 'other'
}

function skillTierLines(
  skills: TerminalSkill[],
  tier_labels: Record<SkillTier, string>,
): TerminalLine[] {
  return SKILL_TIERS.flatMap((tier) => {
    const labels = skills.filter((skill) => skill.tier === tier).map((skill) => skill.label)
    return labels.length > 0 ? [text(`  ${tier_labels[tier]}: ${labels.join(' · ')}`)] : []
  })
}
