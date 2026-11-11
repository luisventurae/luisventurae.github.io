// @vitest-environment node
import type { VacancyRequirementId } from '@portfolio/shared'
import { describe, expect, expectTypeOf, it } from 'vitest'

import type { EngagementKind } from '../data/experience'
import type { SkillCategory, SkillTier } from '../data/skills'
import type { ClientErrorCode } from '../lib/api-client'
import { getUi } from './index'
import type { Template, UiStrings } from './types'

/** Type-level contract of the UI copy; `npm run typecheck` is what makes these fail. */
describe('UiStrings types', () => {
  it('only accepts templates that contain every placeholder, in any order', () => {
    expectTypeOf<'Proyecto {n} de {count}'>().toExtend<Template<'n' | 'count'>>()
    expectTypeOf<'{count}: {n}'>().toExtend<Template<'n' | 'count'>>()
    expectTypeOf<'Proyecto {n}'>().not.toExtend<Template<'n' | 'count'>>()
  })

  it('keys every map by the type it describes', () => {
    expectTypeOf<
      keyof UiStrings['cv_match']['requirements']
    >().toEqualTypeOf<VacancyRequirementId>()
    expectTypeOf<keyof UiStrings['experience']['kinds']>().toEqualTypeOf<EngagementKind>()
    expectTypeOf<keyof UiStrings['stack']['categories']>().toEqualTypeOf<SkillCategory>()
    expectTypeOf<keyof UiStrings['stack']['tiers']>().toEqualTypeOf<SkillTier>()
    expectTypeOf<keyof UiStrings['contact']['errors']>().toEqualTypeOf<
      ClientErrorCode | 'captcha_missing'
    >()
  })

  it('is read-only and needs at least one rotating role', () => {
    expectTypeOf<UiStrings['hero']['roles']>().toEqualTypeOf<readonly [string, ...string[]]>()
    const ui = getUi('es')
    // @ts-expect-error copy is read-only
    ui.hero.tagline = 'otro'
    // @ts-expect-error an empty rotation is not allowed
    const no_roles: UiStrings['hero']['roles'] = []
    expect(no_roles).toEqual([])
  })
})
