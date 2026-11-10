import type { Locale } from '@portfolio/shared'

export function sortProjects<T extends { order: number }>(projects: T[]): T[] {
  return [...projects].sort((a, b) => a.order - b.order)
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
