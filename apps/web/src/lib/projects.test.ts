// @vitest-environment node
import { readdirSync } from 'node:fs'
import { join } from 'node:path'

import { LOCALES } from '@portfolio/shared'
import { describe, expect, it } from 'vitest'

import { EXPERIENCE } from '../data/experience'
import { PROJECTS } from '../data/projects'
import { SKILLS } from '../data/skills'
import {
  formatPeriod,
  projectEmployer,
  projectOrigin,
  projectSlugFromHash,
  projectSlugFromEntryId,
  projectsUsingSkill,
  skillUsage,
  sortProjects,
} from './projects'

const content_dir = join(import.meta.dirname, '../content/projects')

describe('project data integrity', () => {
  it('references only known skills', () => {
    const skill_ids = new Set(SKILLS.map((skill) => skill.id))
    for (const project of PROJECTS) {
      for (const tech of project.techs)
        expect(skill_ids, `${project.slug}: ${tech}`).toContain(tech)
    }
  })

  it('has a translation for every locale', () => {
    for (const locale of LOCALES) {
      const slugs = readdirSync(join(content_dir, locale)).map((file) => file.replace(/\.md$/, ''))
      expect(slugs.sort()).toEqual(PROJECTS.map((project) => project.slug).sort())
    }
  })

  it('ties every project but the portfolio to exactly one job', () => {
    for (const project of PROJECTS) {
      const owners = EXPERIENCE.filter((item) => item.project_slugs.includes(project.slug))
      expect(owners.length, project.slug).toBe(project.slug === 'portfolio' ? 0 : 1)
    }
  })

  it('uses unique slugs and orders', () => {
    expect(new Set(PROJECTS.map((project) => project.slug)).size).toBe(PROJECTS.length)
    expect(new Set(PROJECTS.map((project) => project.order)).size).toBe(PROJECTS.length)
  })
})

describe('sortProjects', () => {
  it('orders by the configured order', () => {
    const sorted = sortProjects([{ order: 3 }, { order: 1 }, { order: 2 }])
    expect(sorted.map((project) => project.order)).toEqual([1, 2, 3])
  })
})

describe('projectsUsingSkill', () => {
  const projects = [
    { slug: 'a', techs: ['vue', 'nodejs'] },
    { slug: 'b', techs: ['nodejs'] },
  ]

  it('returns the slugs that use the skill', () => {
    expect(projectsUsingSkill(projects, 'nodejs')).toEqual(['a', 'b'])
    expect(projectsUsingSkill(projects, 'vue')).toEqual(['a'])
  })

  it('returns an empty list for unused skills', () => {
    expect(projectsUsingSkill(projects, 'kafka')).toEqual([])
  })

  it('counts usage per skill', () => {
    expect(skillUsage(projects)).toEqual({ vue: 1, nodejs: 2 })
  })
})

describe('formatPeriod', () => {
  it('formats a start month in the given locale', () => {
    expect(formatPeriod({ start: '2023-06' }, 'es')).toBe('jun 2023')
    expect(formatPeriod({ start: '2023-06' }, 'en')).toBe('Jun 2023')
  })

  it('includes the end month when present', () => {
    expect(formatPeriod({ start: '2021-03', end: '2022-01' }, 'en')).toBe('Mar 2021 – Jan 2022')
  })
})

describe('projectSlugFromEntryId', () => {
  it('returns the slug of a localized content entry id', () => {
    expect(projectSlugFromEntryId('es/terminal-portfolio')).toBe('terminal-portfolio')
  })

  it('rejects ids that are not "<locale>/<slug>"', () => {
    expect(() => projectSlugFromEntryId('terminal-portfolio')).toThrow('Invalid project entry id')
    expect(() => projectSlugFromEntryId('es/')).toThrow('Invalid project entry id')
    expect(() => projectSlugFromEntryId('es/a/b')).toThrow('Invalid project entry id')
  })
})

describe('projectEmployer', () => {
  const experience = [
    { id: 'securitec', company: 'Securitec', project_slugs: ['ticker', 'securitec-web'] },
    { id: 'prestamype', company: 'Prestamype', project_slugs: [] },
  ]

  it('returns the job a project was built in', () => {
    expect(projectEmployer('ticker', experience)).toEqual({
      experience_id: 'securitec',
      company: 'Securitec',
    })
  })

  it('returns null for a personal project', () => {
    expect(projectEmployer('portfolio', experience)).toBeNull()
  })
})

describe('projectOrigin', () => {
  const labels = { at_company: 'En {company}', personal: 'Proyecto personal' }

  it('names the employer', () => {
    expect(projectOrigin({ experience_id: 'securitec', company: 'Securitec' }, labels)).toBe(
      'En Securitec',
    )
  })

  it('labels a personal project', () => {
    expect(projectOrigin(null, labels)).toBe('Proyecto personal')
  })
})

describe('projectSlugFromHash', () => {
  it('reads the slug of a project anchor', () => {
    expect(projectSlugFromHash('#project-ticker')).toBe('ticker')
    expect(projectSlugFromHash('#project-pwc-store')).toBe('pwc-store')
  })

  it('ignores other anchors', () => {
    expect(projectSlugFromHash('#projects')).toBeNull()
    expect(projectSlugFromHash('#project-')).toBeNull()
    expect(projectSlugFromHash('')).toBeNull()
  })
})
