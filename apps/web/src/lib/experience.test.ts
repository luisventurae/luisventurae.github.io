// @vitest-environment node
import { readdirSync } from 'node:fs'
import { join } from 'node:path'

import { LOCALES } from '@portfolio/shared'
import { describe, expect, it } from 'vitest'

import { EXPERIENCE } from '../data/experience'
import { PROJECTS } from '../data/projects'
import { SKILLS } from '../data/skills'
import {
  careerYears,
  formatExperiencePeriod,
  interpolateYears,
  sortExperience,
  yearsOfExperience,
} from './experience'

const content_dir = join(import.meta.dirname, '../content/experience')

describe('yearsOfExperience', () => {
  it('counts complete years since the start month', () => {
    expect(yearsOfExperience('2019-01', new Date('2026-11-10T12:00:00Z'))).toBe(7)
  })

  it('adds a year when the start month comes around again', () => {
    expect(yearsOfExperience('2019-01', new Date('2027-01-01T00:00:00Z'))).toBe(8)
  })

  it('does not count an incomplete year', () => {
    expect(yearsOfExperience('2019-06', new Date('2026-05-31T23:59:59Z'))).toBe(6)
    expect(yearsOfExperience('2019-06', new Date('2026-06-01T00:00:00Z'))).toBe(7)
  })

  it('never returns a negative value', () => {
    expect(yearsOfExperience('2030-01', new Date('2026-11-10T00:00:00Z'))).toBe(0)
  })

  it('rejects malformed start values', () => {
    expect(() => yearsOfExperience('2019', new Date())).toThrow()
  })
})

describe('careerYears', () => {
  it('derives the value from the 2019-01 career start', () => {
    expect(careerYears(new Date('2026-11-10T12:00:00Z'))).toBe(7)
  })
})

describe('interpolateYears', () => {
  it('replaces every {years} token', () => {
    expect(interpolateYears('{years} años; más de {years}', 7)).toBe('7 años; más de 7')
  })

  it('leaves text without tokens untouched', () => {
    expect(interpolateYears('Hola', 7)).toBe('Hola')
  })
})

describe('sortExperience', () => {
  it('lists ongoing and most recent engagements first', () => {
    const sorted = sortExperience([
      { id: 'old', start: '2019-01', end: '2019-08' },
      { id: 'current', start: '2024-06' },
      { id: 'middle', start: '2019-09', end: '2023-10' },
    ])
    expect(sorted.map((item) => item.id)).toEqual(['current', 'middle', 'old'])
  })

  it('orders overlapping engagements by end month, then by start', () => {
    const sorted = sortExperience([
      { id: 'short-freelance', start: '2020-09', end: '2020-09' },
      { id: 'long-job', start: '2019-09', end: '2023-10' },
      { id: 'part-time', start: '2021-10', end: '2022-03' },
      { id: 'same-end-later-start', start: '2023-01', end: '2023-10' },
    ])
    expect(sorted.map((item) => item.id)).toEqual([
      'same-end-later-start',
      'long-job',
      'part-time',
      'short-freelance',
    ])
  })
})

describe('formatExperiencePeriod', () => {
  it('ends ongoing engagements with the localized present label', () => {
    expect(formatExperiencePeriod({ start: '2024-06' }, 'es', 'actualidad')).toBe(
      'jun 2024 – actualidad',
    )
  })

  it('shows a closed range', () => {
    expect(formatExperiencePeriod({ start: '2019-09', end: '2023-10' }, 'en', 'present')).toBe(
      'Sep 2019 – Oct 2023',
    )
  })

  it('shows a single month when start and end match', () => {
    expect(formatExperiencePeriod({ start: '2021-03', end: '2021-03' }, 'es', 'actualidad')).toBe(
      'mar 2021',
    )
  })
})

describe('experience data integrity', () => {
  it('references only known skills and projects', () => {
    const skill_ids = new Set(SKILLS.map((skill) => skill.id))
    const project_slugs = new Set(PROJECTS.map((project) => project.slug))
    for (const item of EXPERIENCE) {
      for (const tech of item.techs) expect(skill_ids, `${item.id}: ${tech}`).toContain(tech)
      for (const slug of item.project_slugs)
        expect(project_slugs, `${item.id}: ${slug}`).toContain(slug)
    }
  })

  it('has a translation for every locale', () => {
    for (const locale of LOCALES) {
      const ids = readdirSync(join(content_dir, locale)).map((file) => file.replace(/\.md$/, ''))
      expect(ids.sort()).toEqual(EXPERIENCE.map((item) => item.id).sort())
    }
  })

  it('has a single ongoing engagement: Prestamype', () => {
    expect(EXPERIENCE.filter((item) => !item.end).map((item) => item.id)).toEqual(['prestamype'])
  })
})
