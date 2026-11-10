import { CAREER_START } from '../data/site'

const YEAR_MONTH = /^(\d{4})-(0[1-9]|1[0-2])$/
const YEARS_TOKEN = /\{years\}/g

/**
 * Complete years elapsed since `start` (`YYYY-MM`, first day of that month, UTC) until `now`.
 * Computed at build time; see openspec `career-profile` › Years of experience.
 */
export function yearsOfExperience(start: string, now: Date): number {
  const match = YEAR_MONTH.exec(start)
  if (!match) throw new Error(`Invalid career start "${start}", expected YYYY-MM`)
  const start_year = Number(match[1])
  const start_month = Number(match[2]) - 1
  const months = (now.getUTCFullYear() - start_year) * 12 + (now.getUTCMonth() - start_month)
  return Math.max(0, Math.floor(months / 12))
}

/** Years of experience at build time, from the configured career start. */
export function careerYears(now: Date = new Date()): number {
  return yearsOfExperience(CAREER_START, now)
}

/** Replaces every `{years}` token in localized copy with the computed value. */
export function interpolateYears(text: string, years: number): string {
  return text.replace(YEARS_TOKEN, String(years))
}
