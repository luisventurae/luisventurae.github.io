import type { ImageMetadata } from 'astro'

import { SOURCE_URL } from './site'

import asu_cover from '../assets/projects/ss-asu-1.webp'
import busconsulting_cover from '../assets/projects/ss-busc-1.webp'
import cepeban_cover from '../assets/projects/ss-cepeban-0.webp'
import portfolio_cover from '../assets/projects/ss-portfolio-1.webp'
import pwc_mailer_cover from '../assets/projects/ss-pwc-0.webp'
import pwc_store_cover from '../assets/projects/ss-pwc-1.webp'
import securitec_cover from '../assets/projects/ss-securitec-1.webp'
import ticker_cover from '../assets/projects/ss-ticker-1.webp'

/**
 * Locale-independent project metadata. Localized text lives in
 * src/content/projects/<locale>/<slug>.md. The employer comes from src/data/experience.ts
 * (`project_slugs`); a project no job lists is personal. `TODO(media)`: more screenshots, videos and links.
 */
export interface ProjectMeta {
  slug: string
  order: number
  kind: 'web-app' | 'website' | 'api' | 'desktop-app' | 'software'
  start: string
  end?: string
  techs: string[]
  media: ImageMetadata[]
  url?: string
  /** Rendered more prominently as a case study. */
  featured?: true
}

export const PROJECTS: ProjectMeta[] = [
  {
    slug: 'ticker',
    order: 1,
    kind: 'web-app',
    start: '2023-06',
    end: '2023-10',
    featured: true,
    techs: ['vue', 'nuxt', 'nestjs', 'nodejs', 'mongodb', 'websockets', 'redis'],
    media: [ticker_cover],
  },
  {
    slug: 'portfolio',
    order: 2,
    kind: 'web-app',
    start: '2026-11',
    featured: true,
    techs: [
      'astro',
      'react',
      'typescript',
      'tailwind',
      'hono',
      'cloudflare',
      'hexagonal-architecture',
      'vitest',
      'playwright',
      'rag',
    ],
    media: [portfolio_cover],
    url: SOURCE_URL,
  },
  {
    slug: 'securitec-web',
    order: 3,
    kind: 'website',
    start: '2022-08',
    techs: ['nestjs', 'nodejs', 'mongodb', 'aws'],
    media: [securitec_cover],
  },
  {
    slug: 'pwc-store',
    order: 4,
    kind: 'website',
    start: '2022-03',
    techs: ['vue', 'nuxt', 'adonisjs', 'nodejs', 'mongodb'],
    media: [pwc_store_cover],
  },
  {
    slug: 'pwc-mailer',
    order: 5,
    kind: 'software',
    start: '2021-10',
    techs: ['nodejs', 'adonisjs', 'mysql'],
    media: [pwc_mailer_cover],
  },
  {
    slug: 'cepeban-crm',
    order: 6,
    kind: 'api',
    start: '2021-03',
    techs: ['nodejs', 'express', 'mysql', 'zoho-crm'],
    media: [cepeban_cover],
  },
  {
    slug: 'asu-cuenta',
    order: 7,
    kind: 'web-app',
    start: '2019-01',
    end: '2019-08',
    techs: ['vue', 'nodejs', 'mongodb'],
    media: [asu_cover],
  },
  {
    slug: 'busconsulting-admin',
    order: 8,
    kind: 'desktop-app',
    start: '2020-09',
    techs: ['electron', 'vue', 'nodejs', 'mysql'],
    media: [busconsulting_cover],
  },
]
