import { chunkMarkdown, type DocumentChunk, type Locale } from '@portfolio/shared'

import type { Skill, SkillCategory } from '../data/skills'

interface ProjectDocument {
  slug: string
  title: string
  summary: string
  company: string
  period: string
  tech_labels: string[]
  body: string
}

export interface LocaleDocuments {
  locale: Locale
  profile: { title: string; body: string }
  projects: ProjectDocument[]
  skills: Skill[]
  category_labels: Record<SkillCategory, string>
  stack_title: string
}

/**
 * Builds the retrieval chunks shared by the production text search and the local RAG
 * index. Every source of truth (profile, projects, skills) becomes markdown first.
 */
export function buildSearchDocuments(input: LocaleDocuments): DocumentChunk[] {
  const profile = chunkMarkdown({
    markdown: input.profile.body,
    locale: input.locale,
    source: 'profile',
    title: input.profile.title,
  })
  const projects = input.projects.flatMap((project) =>
    chunkMarkdown({
      markdown: projectMarkdown(project),
      locale: input.locale,
      source: `projects/${project.slug}`,
      title: project.title,
    }),
  )
  const skills = chunkMarkdown({
    markdown: skillsMarkdown(input.skills, input.category_labels),
    locale: input.locale,
    source: 'skills',
    title: input.stack_title,
  })
  return [...profile, ...projects, ...skills]
}

function projectMarkdown(project: ProjectDocument): string {
  return [
    `${project.summary}. ${project.company}, ${project.period}. Stack: ${project.tech_labels.join(', ')}.`,
    project.body,
  ].join('\n\n')
}

function skillsMarkdown(skills: Skill[], labels: Record<SkillCategory, string>): string {
  const categories = Object.keys(labels) as SkillCategory[]
  return categories
    .map((category) => {
      const items = skills
        .filter((skill) => skill.category === category)
        .sort((a, b) => b.level - a.level)
        .map((skill) => `${skill.label} (${skill.level}/10)`)
      return `## ${labels[category]}\n\n${items.join(', ')}.`
    })
    .join('\n\n')
}
