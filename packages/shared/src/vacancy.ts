import { z } from 'zod'

/**
 * Requirements a recruiter can pick in the vacancy match game (openspec vacancy-match).
 * Shared so the web and the API validate the same identifiers.
 */
export const VACANCY_REQUIREMENT_IDS = [
  'nodejs',
  'typescript',
  'aws',
  'microservices',
  'mongodb',
  'clean-architecture',
  'integrations',
  'ai-llm',
  'leadership',
  'remote-hybrid',
  'scrum',
  'english',
  'java',
  'on-site',
  'kubernetes',
] as const

export const VacancyRequirementIdSchema = z.enum(VACANCY_REQUIREMENT_IDS)
export type VacancyRequirementId = z.infer<typeof VacancyRequirementIdSchema>

export const MAX_INTERESTS = 12
