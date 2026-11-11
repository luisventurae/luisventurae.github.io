import type { ImageMetadata } from 'astro'

import { SOURCE_URL } from './site'

import asu_home_mobile from '../assets/projects/ss-asu-1-mobile.webp'
import asu_cover from '../assets/projects/ss-asu-1.webp'
import asu_map from '../assets/projects/ss-asu-2.webp'
import asu_transactions from '../assets/projects/ss-asu-3.webp'
import busconsulting_admin from '../assets/projects/ss-busc-1.webp'
import busconsulting_site_mobile from '../assets/projects/ss-busconsulting-1-mobile.webp'
import busconsulting_site from '../assets/projects/ss-busconsulting-1.webp'
import cepeban_cover from '../assets/projects/ss-cepeban-0.webp'
import portfolio_cover from '../assets/projects/ss-portfolio-1.webp'
import prestamype_home_mobile from '../assets/projects/ss-prestamype-1-mobile.webp'
import prestamype_home from '../assets/projects/ss-prestamype-1.webp'
import prestamype_reports_mobile from '../assets/projects/ss-prestamype-2-mobile.webp'
import prestamype_reports from '../assets/projects/ss-prestamype-2.webp'
import pwc_mailer_cover from '../assets/projects/ss-pwc-0.webp'
import pwc_store_home_mobile from '../assets/projects/ss-pwc-1-mobile.webp'
import pwc_store_home from '../assets/projects/ss-pwc-1.webp'
import pwc_store_catalog_mobile from '../assets/projects/ss-pwc-2-mobile.webp'
import pwc_store_catalog from '../assets/projects/ss-pwc-2.webp'
import pwc_web_2020_mobile from '../assets/projects/ss-pwc-old-1-mobile.webp'
import pwc_web_2020 from '../assets/projects/ss-pwc-old-1.webp'
import pwc_quote from '../assets/projects/ss-pwc-intra-3.webp'
import pwc_quote_menu from '../assets/projects/ss-pwc-intra-4.webp'
import securitec_cover from '../assets/projects/ss-securitec-1.webp'
import ticker_login from '../assets/projects/ss-securitec-ticker-1.webp'
import ticker_dashboard from '../assets/projects/ss-securitec-ticker-2.webp'
import ticker_inbox_mobile from '../assets/projects/ss-securitec-ticker-4-mobile.webp'
import ticker_cover from '../assets/projects/ss-ticker-1.webp'

/**
 * Locale-independent project metadata. Localized text lives in
 * src/content/projects/<locale>/<slug>.md. The employer comes from src/data/experience.ts
 * (`project_slugs`); a project no job lists is personal. The first image is the card cover; portrait
 * images are shown as phone screens. `url` must pass `safeExternalUrl` (https only). `TODO(media)`: videos.
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
  /** Rendered more prominently in the projects grid. */
  featured?: true
}

export const PROJECTS: ProjectMeta[] = [
  {
    slug: 'prestamype-invoices',
    order: 0,
    kind: 'web-app',
    start: '2024-06',
    featured: true,
    techs: ['nodejs', 'typescript', 'aws', 'aws-cdk', 'microservices', 'hexagonal-architecture'],
    media: [prestamype_reports, prestamype_reports_mobile, prestamype_home, prestamype_home_mobile],
    url: 'https://www.prestamype.com',
  },
  {
    slug: 'ticker',
    order: 1,
    kind: 'web-app',
    start: '2020-03',
    end: '2023-10',
    featured: true,
    techs: [
      'vue',
      'nuxt',
      'nestjs',
      'nodejs',
      'mongodb',
      'websockets',
      'redis',
      'gcp',
      'huawei-cloud',
    ],
    media: [ticker_dashboard, ticker_inbox_mobile, ticker_login, ticker_cover],
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
    url: SOURCE_URL + '#luis-ventura-e--portfolio',
  },
  {
    slug: 'securitec-web',
    order: 3,
    kind: 'website',
    start: '2022-08',
    techs: ['php', 'owasp'],
    media: [securitec_cover],
  },
  {
    slug: 'pwc-store',
    order: 4,
    kind: 'website',
    start: '2024-01',
    end: '2024-03',
    techs: ['vue', 'nuxt', 'php', 'seo'],
    media: [pwc_store_home, pwc_store_home_mobile, pwc_store_catalog, pwc_store_catalog_mobile],
    url: 'https://www.poolworkconf.com',
  },
  {
    slug: 'pwc-management',
    order: 6,
    kind: 'web-app',
    start: '2024-01',
    end: '2024-03',
    techs: ['nodejs', 'typescript', 'astro', 'react-pdf', 'docker'],
    media: [pwc_quote, pwc_quote_menu],
  },
  {
    slug: 'pwc-mailer',
    order: 5,
    kind: 'software',
    start: '2023-11',
    end: '2023-12',
    techs: ['nodejs', 'typescript', 'smtp', 'cloudflare'],
    media: [pwc_mailer_cover],
  },
  {
    slug: 'pwc-web-2020',
    order: 7,
    kind: 'website',
    start: '2020-06',
    end: '2020-08',
    techs: ['vue', 'nuxt', 'php', 'sql-server', 'seo'],
    media: [pwc_web_2020, pwc_web_2020_mobile],
  },
  {
    slug: 'cepeban-crm',
    order: 8,
    kind: 'api',
    start: '2023-10',
    end: '2023-11',
    techs: ['nodejs', 'nestjs', 'zoho-crm', 'deluge'],
    media: [cepeban_cover],
  },
  {
    slug: 'asu-cuenta',
    order: 9,
    kind: 'web-app',
    start: '2019-01',
    end: '2019-08',
    techs: ['nodejs', 'adonisjs', 'websockets'],
    media: [asu_cover, asu_home_mobile, asu_map, asu_transactions],
  },
  {
    slug: 'busconsulting-web',
    order: 10,
    kind: 'website',
    start: '2018-03',
    end: '2019-06',
    techs: ['html', 'css', 'javascript', 'php', 'mysql'],
    media: [busconsulting_site, busconsulting_site_mobile],
    url: 'https://busconsultingweb.com',
  },
  {
    slug: 'busconsulting-admin',
    order: 11,
    kind: 'desktop-app',
    start: '2018-03',
    end: '2019-06',
    techs: ['java', 'netbeans', 'mysql'],
    media: [busconsulting_admin],
  },
]
