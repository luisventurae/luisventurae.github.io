import type { Locale } from '@portfolio/shared'
import type { ImageMetadata } from 'astro'
import { getCollection, getEntry } from 'astro:content'

import { PROJECTS } from '../data/projects'
import { formatPeriod, sortProjects } from './projects'

export interface ProjectView {
  slug: string
  title: string
  summary: string
  company: string
  period: string
  techs: string[]
  media: ImageMetadata[]
  url?: string | undefined
  body_html: string
  body_text: string
}

/** Joins locale-independent metadata with the localized markdown of each project. */
export async function loadProjects(locale: Locale): Promise<ProjectView[]> {
  const entries = await getCollection('projects', (entry) => entry.id.startsWith(`${locale}/`))
  const by_slug = new Map(entries.map((entry) => [entry.id.split('/')[1], entry]))

  return sortProjects(PROJECTS).map((meta) => {
    const entry = by_slug.get(meta.slug)
    if (!entry) throw new Error(`Missing ${locale} translation for project "${meta.slug}"`)
    return {
      slug: meta.slug,
      title: entry.data.title,
      summary: entry.data.summary,
      company: meta.company,
      period: formatPeriod(meta, locale),
      techs: meta.techs,
      media: meta.media,
      url: meta.url,
      body_html: entry.rendered?.html ?? '',
      body_text: entry.body ?? '',
    }
  })
}

export async function loadProfile(locale: Locale): Promise<{ title: string; body: string }> {
  const entry = await getEntry('profile', locale)
  if (!entry) throw new Error(`Missing profile for ${locale}`)
  return { title: entry.data.title, body: entry.body ?? '' }
}
