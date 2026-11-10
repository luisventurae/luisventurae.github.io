import type { Locale } from '@portfolio/shared'

export function sortProjects<T extends { order: number }>(projects: T[]): T[] {
  return [...projects].sort((a, b) => a.order - b.order)
}

/** Extracts the slug from a localized content entry id (`<locale>/<slug>`). */
export function projectSlugFromEntryId(entry_id: string): string {
  const [locale, slug, ...rest] = entry_id.split('/')
  if (!locale || !slug || rest.length > 0) throw new Error(`Invalid project entry id "${entry_id}"`)
  return slug
}

export interface ProjectEmployer {
  experience_id: string
  company: string
}

/** The job a project was built in, from the experience data; `null` for a personal project. */
export function projectEmployer(
  slug: string,
  experience: { id: string; company: string; project_slugs: string[] }[],
): ProjectEmployer | null {
  const owner = experience.find((item) => item.project_slugs.includes(slug))
  return owner ? { experience_id: owner.id, company: owner.company } : null
}

/** Where a project was built, e.g. "En Securitec" or "Proyecto personal". */
export function projectOrigin(
  employer: ProjectEmployer | null,
  labels: { at_company: string; personal: string },
): string {
  return employer ? labels.at_company.replace('{company}', employer.company) : labels.personal
}

const PROJECT_HASH = /^#project-(.+)$/

/** Slug of a `#project-<slug>` anchor, the deep link to a case study. */
export function projectSlugFromHash(hash: string): string | null {
  return PROJECT_HASH.exec(hash)?.[1] ?? null
}

export function projectsUsingSkill(
  projects: { slug: string; techs: string[] }[],
  skill_id: string,
): string[] {
  return projects
    .filter((project) => project.techs.includes(skill_id))
    .map((project) => project.slug)
}

export function skillUsage(projects: { techs: string[] }[]): Record<string, number> {
  const usage: Record<string, number> = {}
  for (const project of projects) {
    for (const tech of project.techs) usage[tech] = (usage[tech] ?? 0) + 1
  }
  return usage
}

export function formatPeriod(
  period: { start: string; end?: string | undefined },
  locale: Locale,
): string {
  const format = (value: string): string => {
    const [year = '1970', month = '1'] = value.split('-')
    const date = new Date(Date.UTC(Number(year), Number(month) - 1, 1))
    return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric', timeZone: 'UTC' })
      .format(date)
      .replace('.', '')
  }
  return period.end ? `${format(period.start)} – ${format(period.end)}` : format(period.start)
}
