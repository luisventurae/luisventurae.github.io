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
    project_slugs: ['prestamype-invoices'],
    techs: [
      'nodejs',
      'typescript',
      'aws',
      'aws-cdk',
      'lambda',
      'sqs',
      'sns',
      'eum',
      's3',
      'eventbridge',
      'ses',
      'dynamodb',
      'cloudwatch',
      'codepipeline',
      'microservices',
      'hexagonal-architecture',
      'mongodb',
      'koajs',
      'hono',
      'bedrock',
      'chatbots',
      'claude-code',
      'sdd',
      'tdd',
      'rag',
      'design-patterns',
      'docker',
      'owasp',
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
    techs: [
      'nodejs',
      'nestjs',
      'php',
      'vue',
      'nuxt',
      'mongodb',
      'websockets',
      'redis',
      'gcp',
      'huawei-cloud',
    ],
  },
  {
    id: 'pool-work-confort',
    company: 'Pool Work Confort',
    kind: 'part-time',
    start: '2023-11',
    end: '2024-03',
    project_slugs: ['pwc-store', 'pwc-mailer', 'pwc-management'],
    techs: [
      'nodejs',
      'typescript',
      'php',
      'vue',
      'nuxt',
      'astro',
      'react-pdf',
      'smtp',
      'cloudflare',
      'docker',
      'seo',
    ],
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
    id: 'pool-work-confort-2020',
    company: 'Pool Work Confort',
    kind: 'freelance',
    start: '2020-06',
    end: '2020-08',
    project_slugs: ['pwc-web-2020'],
    techs: ['vue', 'nuxt', 'php', 'sql-server', 'seo'],
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
