import { describe, expect, it } from 'vitest'

import { buildStructuredData } from './seo'

const input = {
  locale: 'en' as const,
  site_url: 'https://luisventurae.github.io',
  page_url: 'https://luisventurae.github.io/en/',
  title: 'Luis Ventura E — Full Stack Web Engineer',
  description: 'I build web software that feels right.',
  same_as: ['https://github.com/luisventurae'],
  knows_about: ['TypeScript', 'Node.js'],
  projects: [
    { name: 'Ticker', description: 'Omnichannel platform', url: 'https://ticker.example' },
    { name: 'Securitec', description: 'Company website' },
  ],
}

type Node = Record<string, unknown>

function findNode(graph: Node[], type: string): Node {
  const node = graph.find((item) => item['@type'] === type)
  if (!node) throw new Error(`missing ${type}`)
  return node
}

describe('buildStructuredData', () => {
  const data = buildStructuredData(input)
  const graph = data['@graph'] as Node[]

  it('uses the schema.org context', () => {
    expect(data['@context']).toBe('https://schema.org')
  })

  it('describes a ProfilePage whose main entity is the person', () => {
    const page = findNode(graph, 'ProfilePage')
    expect(page).toMatchObject({
      url: input.page_url,
      inLanguage: 'en',
      mainEntity: { '@id': 'https://luisventurae.github.io/#person' },
    })
  })

  it('includes the person with the fields Google uses for profile pages', () => {
    const person = findNode(graph, 'Person')
    expect(person).toMatchObject({
      '@id': 'https://luisventurae.github.io/#person',
      name: 'Luis Miguel Ventura E',
      alternateName: 'Luis Ventura E',
      jobTitle: 'Full Stack Web Engineer',
      sameAs: input.same_as,
      knowsAbout: input.knows_about,
      knowsLanguage: ['es', 'en', 'fr'],
    })
    expect(person['image']).toBe('https://luisventurae.github.io/luis-83x83.jpg')
  })

  it('lists the projects in order as creative works', () => {
    const list = findNode(graph, 'ItemList')
    expect(list['itemListElement']).toEqual([
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'CreativeWork',
          name: 'Ticker',
          description: 'Omnichannel platform',
          url: 'https://ticker.example',
          creator: { '@id': 'https://luisventurae.github.io/#person' },
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'CreativeWork',
          name: 'Securitec',
          description: 'Company website',
          creator: { '@id': 'https://luisventurae.github.io/#person' },
        },
      },
    ])
  })

  it('links the website to the person', () => {
    expect(findNode(graph, 'WebSite')).toMatchObject({
      url: 'https://luisventurae.github.io/',
      publisher: { '@id': 'https://luisventurae.github.io/#person' },
    })
  })
})
