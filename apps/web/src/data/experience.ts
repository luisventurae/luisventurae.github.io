/**
 * Locale-independent work history. Localized role and summary live in
 * src/content/experience/<locale>/<id>.md. Technologies must reference src/data/skills.ts ids
 * and projects must reference src/data/projects.ts slugs.
 */
export type EngagementKind = 'full-time' | 'part-time' | 'freelance'

export interface ExperienceMeta {
  id: string
  company: string
  kind: EngagementKind
  start: string
  /** Omitted while the engagement is ongoing. */
  end?: string
  project_slugs: string[]
  techs: string[]
}

export const EXPERIENCE: ExperienceMeta[] = [
  {
    id: 'prestamype',
    company: 'Prestamype',
    kind: 'full-time',
    start: '2024-06',
    project_slugs: [],
    techs: [
      'nodejs',
      'typescript',
      'aws',
      'aws-cdk',
      'microservices',
      'hexagonal-architecture',
      'mongodb',
      'chatbots',
      'claude-code',
      'scrum',
    ],
  },
  {
    id: 'securitec',
    company: 'Securitec',
    kind: 'full-time',
    start: '2019-09',
    end: '2023-10',
    project_slugs: ['ticker', 'securitec-web'],
    techs: ['nodejs', 'nestjs', 'vue', 'nuxt', 'mongodb', 'websockets', 'redis', 'aws'],
  },
  {
    // TODO(content): confirm the Pool Work Confort dates; these come from its projects.
    id: 'pool-work-confort',
    company: 'Pool Work Confort',
    kind: 'part-time',
    start: '2021-10',
    end: '2022-03',
    project_slugs: ['pwc-store', 'pwc-mailer'],
    techs: ['nodejs', 'adonisjs', 'vue', 'nuxt', 'mongodb', 'mysql'],
  },
  {
    id: 'instituto-cepeban',
    company: 'Instituto Cepeban',
    kind: 'freelance',
    start: '2021-03',
    end: '2021-03',
    project_slugs: ['cepeban-crm'],
    techs: ['nodejs', 'express', 'mysql', 'zoho-crm'],
  },
  {
    id: 'busconsulting',
    company: 'Busconsulting',
    kind: 'freelance',
    start: '2020-09',
    end: '2020-09',
    project_slugs: ['busconsulting-admin'],
    techs: ['electron', 'vue', 'nodejs', 'mysql'],
  },
  {
    id: 'asu-cuenta',
    company: 'Asu Cuenta',
    kind: 'full-time',
    start: '2019-01',
    end: '2019-08',
    project_slugs: ['asu-cuenta'],
    techs: ['vue', 'nodejs', 'mongodb'],
  },
]
