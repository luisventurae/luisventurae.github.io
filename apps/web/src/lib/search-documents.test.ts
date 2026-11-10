import { describe, expect, it } from 'vitest'

import { buildSearchDocuments } from './search-documents'

const documents = buildSearchDocuments({
  locale: 'es',
  profile: { title: 'Luis Ventura E', body: 'Soy ingeniero.\n\n## Idiomas\n\nEspañol e inglés.' },
  projects: [
    {
      slug: 'ticker',
      title: 'Ticker',
      summary: 'Plataforma omnicanal',
      company: 'Securitec',
      period: 'jun 2023',
      tech_labels: ['Vue.js', 'Redis'],
      body: '### Qué hice\n\nWebSockets con Redis.',
    },
  ],
  skills: [
    { id: 'nodejs', label: 'Node.js', category: 'backend', level: 9 },
    { id: 'vue', label: 'Vue.js', category: 'frontend', level: 6 },
  ],
  category_labels: { backend: 'Backend', frontend: 'Frontend', other: 'Otros' },
  stack_title: 'Stack',
})

describe('buildSearchDocuments', () => {
  it('covers profile, projects and skills with their sources', () => {
    expect(new Set(documents.map((doc) => doc.source))).toEqual(
      new Set(['profile', 'projects/ticker', 'skills']),
    )
    expect(documents.every((doc) => doc.locale === 'es')).toBe(true)
  })

  it('puts project metadata in the first chunk', () => {
    const first = documents.find((doc) => doc.source === 'projects/ticker')
    expect(first?.text).toContain('Securitec, jun 2023. Stack: Vue.js, Redis.')
  })

  it('describes skills by category with levels', () => {
    const backend = documents.find((doc) => doc.source === 'skills' && doc.text.includes('Backend'))
    expect(backend?.text).toContain('Node.js (9/10)')
  })
})
