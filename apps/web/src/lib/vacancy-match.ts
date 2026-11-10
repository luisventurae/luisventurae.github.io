import type { VacancyRequirementId } from '@portfolio/shared'

import { VACANCY_REQUIREMENTS, type RequirementStrength } from '../data/vacancy-match'

const STRENGTH_BY_ID = new Map<VacancyRequirementId, RequirementStrength>(
  VACANCY_REQUIREMENTS.map((item) => [item.id, item.strength]),
)

export function requirementStrength(id: VacancyRequirementId): RequirementStrength {
  return STRENGTH_BY_ID.get(id) ?? 0
}

/** Average strength of the selection as a whole percentage, or null with nothing selected. */
export function matchScore(selected: VacancyRequirementId[]): number | null {
  if (selected.length === 0) return null
  const total = selected.reduce((sum, id) => sum + requirementStrength(id), 0)
  return Math.round((total / selected.length) * 100)
}
