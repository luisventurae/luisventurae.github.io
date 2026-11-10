import type { ImageMetadata } from 'astro'

import asu_cover from '../assets/projects/ss-asu-1.webp'
import busconsulting_cover from '../assets/projects/ss-busc-1.webp'
import cepeban_cover from '../assets/projects/ss-cepeban-0.webp'
import pwc_mailer_cover from '../assets/projects/ss-pwc-0.webp'
import pwc_store_cover from '../assets/projects/ss-pwc-1.webp'
import securitec_cover from '../assets/projects/ss-securitec-1.webp'
import ticker_cover from '../assets/projects/ss-ticker-1.webp'

/**
 * Locale-independent project metadata. Localized text lives in
 * src/content/projects/<locale>/<slug>.md. `TODO(media)`: more screenshots, videos and links.
 */
export interface ProjectMeta {
  slug: string
  order: number
  company: string
  kind: 'web-app' | 'website' | 'api' | 'desktop-app' | 'software'
  start: string
  end?: string
  techs: string[]
  media: ImageMetadata[]
  url?: string
}

export const PROJECTS: ProjectMeta[] = [
  {
    slug: 'ticker',
    order: 1,
    company: 'Securitec',
    kind: 'web-app',
    start: '2023-06',
    techs: ['vue', 'nuxt', 'nestjs', 'nodejs', 'mongodb', 'websockets', 'redis'],
    media: [ticker_cover],
  },
  {
    slug: 'securitec-web',
    order: 2,
    company: 'Securitec',
    kind: 'website',
    start: '2022-08',
    techs: ['nestjs', 'nodejs', 'mongodb', 'aws'],
    media: [securitec_cover],
  },
  {
    slug: 'pwc-store',
    order: 3,
    company: 'Pool Work Confort',
    kind: 'website',
    start: '2022-03',
    techs: ['vue', 'nuxt', 'adonisjs', 'nodejs', 'mongodb'],
    media: [pwc_store_cover],
  },
  {
    slug: 'pwc-mailer',
    order: 4,
    company: 'Pool Work Confort',
    kind: 'software',
    start: '2021-10',
    techs: ['nodejs', 'adonisjs', 'mysql'],
    media: [pwc_mailer_cover],
  },
  {
    slug: 'cepeban-crm',
    order: 5,
    company: 'Instituto Cepeban',
    kind: 'api',
    start: '2021-03',
    techs: ['nodejs', 'express', 'mysql', 'zoho-crm'],
    media: [cepeban_cover],
  },
  {
    slug: 'asu-cuenta',
    order: 6,
    company: 'Asu Cuenta',
    kind: 'web-app',
    start: '2022-11',
    techs: ['vue', 'nodejs', 'mongodb'],
    media: [asu_cover],
  },
  {
    slug: 'busconsulting-admin',
    order: 7,
    company: 'Busconsulting',
    kind: 'desktop-app',
    start: '2020-09',
    techs: ['electron', 'vue', 'nodejs', 'mysql'],
    media: [busconsulting_cover],
  },
]
