import { LOCALES, type Locale } from '@portfolio/shared'

import { PERSON } from '../data/site'

export interface StructuredProject {
  name: string
  description: string
  url?: string | undefined
}

export interface StructuredDataInput {
  locale: Locale
  site_url: string
  page_url: string
  title: string
  description: string
  same_as: string[]
  knows_about: string[]
  projects: StructuredProject[]
}

type JsonLd = Record<string, unknown>

/**
 * JSON-LD graph for Google rich results (Profile page). Every node is linked by `@id`
 * so the person is described once. See openspec site-shell › Structured data.
 */
export function buildStructuredData(input: StructuredDataInput): JsonLd {
  const origin = input.site_url.replace(/\/$/, '')
  const person_id = `${origin}/#person`
  const person_ref = { '@id': person_id }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${input.page_url}#profile`,
        url: input.page_url,
        name: input.title,
        description: input.description,
        inLanguage: input.locale,
        isPartOf: { '@id': `${origin}/#website` },
        mainEntity: person_ref,
      },
      {
        '@type': 'Person',
        '@id': person_id,
        name: PERSON.full_name,
        alternateName: PERSON.name,
        jobTitle: PERSON.job_title,
        url: `${origin}/`,
        image: `${origin}${PERSON.image_path}`,
        sameAs: input.same_as,
        knowsAbout: input.knows_about,
        knowsLanguage: [...LOCALES],
      },
      {
        '@type': 'WebSite',
        '@id': `${origin}/#website`,
        url: `${origin}/`,
        name: PERSON.name,
        inLanguage: [...LOCALES],
        publisher: person_ref,
      },
      {
        '@type': 'ItemList',
        '@id': `${input.page_url}#projects`,
        itemListElement: input.projects.map((project, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'CreativeWork',
            name: project.name,
            description: project.description,
            ...(project.url ? { url: project.url } : {}),
            creator: person_ref,
          },
        })),
      },
    ],
  }
}
