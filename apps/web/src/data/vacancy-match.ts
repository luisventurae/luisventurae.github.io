import type { VacancyRequirementId } from '@portfolio/shared'

/** 1 = fully met, 0.5 = partially met, 0 = not met. Honest on purpose (openspec vacancy-match). */
export type RequirementStrength = 1 | 0.5 | 0

export interface VacancyRequirement {
  id: VacancyRequirementId
  strength: RequirementStrength
}

/** Display order of the chips, deliberately shuffled so unmet ones are not predictable. Labels and evidence live in i18n (`cv_match.requirements`). */
export const VACANCY_REQUIREMENTS: VacancyRequirement[] = [
  { id: 'nodejs', strength: 1 },
  { id: 'angular', strength: 0 },
  { id: 'typescript', strength: 1 },
  { id: 'aws', strength: 1 },
  { id: 'python', strength: 0 },
  { id: 'microservices', strength: 1 },
  { id: 'mongodb', strength: 1 },
  { id: 'kubernetes', strength: 0 },
  { id: 'clean-architecture', strength: 1 },
  { id: 'integrations', strength: 1 },
  { id: 'dotnet', strength: 0 },
  { id: 'ai-llm', strength: 1 },
  { id: 'rag', strength: 1 },
  { id: 'java', strength: 0.5 },
  { id: 'ai-guardrails', strength: 1 },
  { id: 'leadership', strength: 1 },
  { id: 'azure', strength: 0 },
  { id: 'scrum', strength: 1 },
  { id: 'english', strength: 1 },
  { id: 'on-site', strength: 0 },
  { id: 'remote-hybrid', strength: 1 },
]
