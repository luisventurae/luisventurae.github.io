import type { VacancyRequirementId } from '@portfolio/shared'

import type { EngagementKind } from '../data/experience'
import type { SkillCategory, SkillTier } from '../data/skills'
import type { ClientErrorCode } from '../lib/api-client'
import type { CommandName } from '../lib/terminal/commands'

type Placeholder<Token extends string> = `${string}{${Token}}${string}`
type UnionToIntersection<U> = (U extends unknown ? (arg: U) => void : never) extends (
  arg: infer I,
) => void
  ? I
  : never

/**
 * Copy that must contain every `{token}`, in any order: a translation that drops one fails to
 * compile instead of showing `{count}` on the page.
 */
export type Template<Token extends string> = UnionToIntersection<Placeholder<Token>>

type Copy<Key extends string> = Readonly<Record<Key, string>>

interface Requirement {
  readonly label: string
  readonly proof: string
}

/** Every localized string of the site. `es`, `en` and `fr` must each provide all of it. */
export interface UiStrings {
  readonly meta: {
    readonly title: string
    readonly description: Template<'years'>
    readonly og_image_alt: string
  }
  readonly a11y: Copy<
    'skip_to_content' | 'main_nav' | 'language' | 'theme_to_dark' | 'theme_to_light'
  >
  readonly nav: Copy<'about' | 'experience' | 'stack' | 'projects' | 'terminal' | 'contact'>
  readonly hero: {
    readonly greeting: string
    readonly social: string
    readonly facts: Template<'years'>
    /** Rotating role descriptions; the rotation needs at least one. */
    readonly roles: readonly [string, ...string[]]
    readonly tagline: string
    readonly drag_hint: string
    readonly cta_projects: string
    readonly cta_terminal: string
  }
  readonly about: Copy<'title' | 'intro'>
  readonly experience: {
    readonly title: string
    readonly intro: string
    readonly present: string
    readonly kinds: Copy<EngagementKind>
    readonly projects: string
  }
  readonly stack: {
    readonly title: string
    readonly intro: string
    readonly all: string
    readonly categories: Copy<SkillCategory>
    readonly tiers: Copy<SkillTier>
    readonly tiers_legend: string
    readonly no_projects: string
    /** Singular and plural forms. */
    readonly used_in: readonly [one: string, other: Template<'count'>]
    readonly see_projects: string
    readonly clear: string
  }
  readonly projects: {
    readonly title: string
    readonly intro: string
    readonly at_company: Template<'company'>
    readonly personal: string
    readonly open: string
    readonly role: string
    readonly period: string
    readonly technologies: string
    readonly visit: string
    readonly previous: string
    readonly next: string
    readonly close: string
    readonly swipe_hint: string
    readonly counter: Template<'n' | 'count'>
    readonly gallery: Template<'title'>
    readonly carousel: string
    readonly slide: string
    readonly screenshot_alt: Template<'title' | 'n' | 'count'>
    readonly mobile_view: string
    readonly desktop_view: string
    readonly previous_image: string
    readonly next_image: string
    readonly go_to_image: Template<'n' | 'count'>
    readonly screenshots: Template<'count'>
    readonly new_tab: string
  }
  readonly terminal: {
    readonly title: string
    readonly intro: string
    readonly shortcut_hint: string
    readonly input_label: string
    readonly messages: {
      readonly welcome: string
      readonly unknown: Template<'command'>
      readonly help_title: string
      readonly help: Copy<CommandName>
      readonly not_found: Template<'slug'>
      readonly usage: Template<'usage'>
      readonly no_results: Template<'query'>
      readonly results_title: Template<'query'>
      readonly lang_switch: Template<'lang'>
      readonly theme_switch: Template<'theme'>
      readonly contact: string
      readonly categories_hint: string
    }
  }
  readonly cv_match: {
    readonly prompt: string
    readonly hint: string
    readonly empty: string
    readonly score: string
    readonly cta: string
    readonly skip: string
    readonly levels: Copy<'met' | 'partial' | 'unmet'>
    readonly requirements: Readonly<Record<VacancyRequirementId, Requirement>>
  }
  readonly contact: {
    readonly title: string
    readonly intro: string
    readonly email: string
    readonly company: string
    readonly submit: string
    readonly sending: string
    readonly success: string
    readonly check_inbox: Template<'email'>
    readonly errors: Copy<ClientErrorCode | 'captcha_missing'>
  }
  readonly footer: Copy<'built_with' | 'source' | 'rights'>
}
