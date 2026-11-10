import { chunkMarkdown, type DocumentChunk, type Locale } from '@portfolio/shared'

import { SKILL_TIERS, type Skill, type SkillCategory, type SkillTier } from '../data/skills'

interface ProjectDocument {
  slug: string
  title: string
  summary: string
  company: string
  period: string
  tech_labels: string[]
  body: string
}

interface ExperienceDocument {
  id: string
  company: string
  role: string
  kind_label: string
  period: string
  tech_labels: string[]
  body: string
}

export interface LocaleDocuments {
  locale: Locale
  profile: { title: string; body: string }
  projects: ProjectDocument[]
  experience: ExperienceDocument[]
  experience_title: string
  skills: Skill[]
  category_labels: Record<SkillCategory, string>
  tier_labels: Record<SkillTier, string>
  stack_title: string
}

/**
 * Builds the retrieval chunks shared by the production text search and the local RAG
 * index. Every source of truth (profile, experience, projects, skills) becomes markdown first.
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
  const experience = input.experience.flatMap((item) =>
    chunkMarkdown({
      markdown: experienceMarkdown(item),
      locale: input.locale,
      source: `experience/${item.id}`,
      title: `${input.experience_title}: ${item.company}`,
    }),
  )
  const skills = chunkMarkdown({
    markdown: skillsMarkdown(input.skills, input.category_labels, input.tier_labels),
    locale: input.locale,
    source: 'skills',
    title: input.stack_title,
  })
  return [...profile, ...experience, ...projects, ...skills]
}

function experienceMarkdown(item: ExperienceDocument): string {
  return [
    `${item.role} · ${item.kind_label} · ${item.period}. Stack: ${item.tech_labels.join(', ')}.`,
    item.body,
  ].join('\n\n')
}

function projectMarkdown(project: ProjectDocument): string {
  return [
    `${project.summary}. ${project.company}, ${project.period}. Stack: ${project.tech_labels.join(', ')}.`,
    project.body,
  ].join('\n\n')
}

function skillsMarkdown(
  skills: Skill[],
  labels: Record<SkillCategory, string>,
  tier_labels: Record<SkillTier, string>,
): string {
  const categories = Object.keys(labels) as SkillCategory[]
  return categories
    .map((category) => {
      const tiers = SKILL_TIERS.flatMap((tier) => {
        const items = skills
          .filter((skill) => skill.category === category && skill.tier === tier)
          .map((skill) => skill.label)
        return items.length > 0 ? [`${tier_labels[tier]}: ${items.join(', ')}.`] : []
      })
      return `## ${labels[category]}\n\n${tiers.join('\n')}`
    })
    .join('\n\n')
}
