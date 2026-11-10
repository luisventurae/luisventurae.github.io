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
  experience: [
    {
      id: 'prestamype',
      company: 'Prestamype',
      role: 'Backend Engineer',
      kind_label: 'Tiempo completo',
      period: 'jun 2024 – actualidad',
      tech_labels: ['Node.js', 'AWS'],
      body: 'Microservicios sobre AWS.',
    },
  ],
  experience_title: 'Experiencia',
  skills: [
    { id: 'nodejs', label: 'Node.js', category: 'backend', tier: 'daily' },
    { id: 'kafka', label: 'Kafka', category: 'backend', tier: 'exploring' },
    { id: 'vue', label: 'Vue.js', category: 'frontend', tier: 'production' },
  ],
  category_labels: { backend: 'Backend', frontend: 'Frontend', other: 'Otros' },
  tier_labels: { daily: 'Uso diario', production: 'En producción', exploring: 'Explorando' },
  stack_title: 'Stack',
})

describe('buildSearchDocuments', () => {
  it('covers profile, projects and skills with their sources', () => {
    expect(new Set(documents.map((doc) => doc.source))).toEqual(
      new Set(['profile', 'projects/ticker', 'experience/prestamype', 'skills']),
    )
    expect(documents.every((doc) => doc.locale === 'es')).toBe(true)
  })

  it('puts project metadata in the first chunk', () => {
    const first = documents.find((doc) => doc.source === 'projects/ticker')
    expect(first?.text).toContain('Securitec, jun 2023. Stack: Vue.js, Redis.')
  })

  it('describes each experience entry with role, type and period', () => {
    const entry = documents.find((doc) => doc.source === 'experience/prestamype')
    expect(entry?.text).toContain(
      'Backend Engineer · Tiempo completo · jun 2024 – actualidad. Stack: Node.js, AWS.',
    )
    expect(entry?.title).toBe('Experiencia: Prestamype')
  })

  it('describes skills by category and usage tier, without numeric ratings', () => {
    const backend = documents.find((doc) => doc.source === 'skills' && doc.text.includes('Backend'))
    expect(backend?.text).toContain('Uso diario: Node.js.')
    expect(backend?.text).toContain('Explorando: Kafka.')
    expect(backend?.text).not.toMatch(/\/10/)
  })
})
