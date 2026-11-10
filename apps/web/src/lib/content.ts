import type { Locale } from '@portfolio/shared'
import type { ImageMetadata } from 'astro'
import { getCollection, getEntry, type CollectionEntry } from 'astro:content'

import { EXPERIENCE, type EngagementKind } from '../data/experience'
import { PROJECTS } from '../data/projects'
import { careerYears, interpolateYears, sortExperience } from './experience'
import { formatPeriod, projectSlugFromEntryId, sortProjects } from './projects'

type ProjectEntry = CollectionEntry<'projects'>
type ExperienceEntry = CollectionEntry<'experience'>

export interface ProfileView {
  title: string
  body: string
  body_html: string
}

export interface ExperienceView {
  id: string
  company: string
  kind: EngagementKind
  start: string
  end?: string | undefined
  role: string
  project_slugs: string[]
  techs: string[]
  body_html: string
  body_text: string
}

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
  const entries: ProjectEntry[] = await getCollection('projects', (entry: ProjectEntry): boolean =>
    entry.id.startsWith(`${locale}/`),
  )
  const by_slug = new Map<string, ProjectEntry>(
    entries.map((entry: ProjectEntry): [string, ProjectEntry] => [
      projectSlugFromEntryId(entry.id),
      entry,
    ]),
  )

  return sortProjects(PROJECTS).map((meta): ProjectView => {
    const entry: ProjectEntry | undefined = by_slug.get(meta.slug)
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

export async function loadProfile(locale: Locale): Promise<ProfileView> {
  const entry = await getEntry('profile', locale)
  if (!entry) throw new Error(`Missing profile for ${locale}`)
  const years = careerYears()
  return {
    title: entry.data.title,
    body: interpolateYears(entry.body ?? '', years),
    body_html: interpolateYears(entry.rendered?.html ?? '', years),
  }
}

/** Joins locale-independent work history with its localized role and summary. */
export async function loadExperience(locale: Locale): Promise<ExperienceView[]> {
  const entries: ExperienceEntry[] = await getCollection(
    'experience',
    (entry: ExperienceEntry): boolean => entry.id.startsWith(`${locale}/`),
  )
  const by_id = new Map<string, ExperienceEntry>(
    entries.map((entry: ExperienceEntry): [string, ExperienceEntry] => [
      projectSlugFromEntryId(entry.id),
      entry,
    ]),
  )

  return sortExperience(EXPERIENCE).map((meta): ExperienceView => {
    const entry: ExperienceEntry | undefined = by_id.get(meta.id)
    if (!entry) throw new Error(`Missing ${locale} translation for experience "${meta.id}"`)
    return {
      ...meta,
      role: entry.data.role,
      body_html: entry.rendered?.html ?? '',
      body_text: entry.body ?? '',
    }
  })
}
