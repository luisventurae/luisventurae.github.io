// @vitest-environment node
import { readdirSync } from 'node:fs'
import { join } from 'node:path'

import { LOCALES } from '@portfolio/shared'
import { describe, expect, it } from 'vitest'

import { PROJECTS } from '../data/projects'
import { SKILLS } from '../data/skills'
import { formatPeriod, projectsUsingSkill, skillUsage, sortProjects } from './projects'

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
