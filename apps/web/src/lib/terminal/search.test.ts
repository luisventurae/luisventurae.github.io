import type { DocumentChunk } from '@portfolio/shared'
import { describe, expect, it } from 'vitest'

import { createSearch, parseSearchIndex } from './search'

const chunks: DocumentChunk[] = [
  {
    id: 'es:projects/ticker:0',
    text: 'Ticker\nWebSockets con Redis',
    locale: 'es',
    source: 'projects/ticker',
    title: 'Ticker',
  },
  {
    id: 'en:projects/ticker:0',
    text: 'Ticker\nWebSockets with Redis',
    locale: 'en',
    source: 'projects/ticker',
    title: 'Ticker',
  },
  {
    id: 'es:skills:0',
    text: 'Stack — Backend\nNode.js, MongoDB',
    locale: 'es',
    source: 'skills',
    title: 'Stack',
  },
]

describe('createSearch', () => {
  const search = createSearch(chunks)

  it('finds fragments in the requested locale', () => {
    const results = search('redis', 'es')
    expect(results.map((result) => result.id)).toEqual(['es:projects/ticker:0'])
  })

  it('tolerates prefixes and small typos', () => {
    expect(search('mongo', 'es')[0]?.source).toBe('skills')
    expect(search('websokets', 'en')[0]?.id).toBe('en:projects/ticker:0')
  })

  it('returns an excerpt without the title line', () => {
    expect(search('redis', 'en')[0]?.excerpt).toBe('WebSockets with Redis')
  })

  it('returns nothing for unmatched queries', () => {
    expect(search('kubernetes', 'es')).toEqual([])
  })
})

describe('parseSearchIndex', () => {
  it('returns the validated chunks', () => {
    expect(parseSearchIndex(chunks)).toEqual(chunks)
  })

  it('falls back to an empty index when the payload breaks the contract', () => {
    expect(parseSearchIndex({ chunks })).toEqual([])
    expect(parseSearchIndex([{ ...chunks[0], locale: 'de' }])).toEqual([])
  })
})
