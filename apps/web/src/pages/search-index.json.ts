import { LOCALES, SearchIndexSchema } from '@portfolio/shared'
import type { APIRoute } from 'astro'

import { SKILLS } from '../data/skills'
import { getUi } from '../i18n'
import { loadExperience, loadProfile, loadProjects } from '../lib/content'
import { formatExperiencePeriod } from '../lib/experience'
import { projectOrigin } from '../lib/projects'
import { buildSearchDocuments } from '../lib/search-documents'

/** Prerendered chunks for the terminal's text search and the local RAG ingest. */
export const GET: APIRoute = async () => {
  const skill_labels = new Map(SKILLS.map((skill) => [skill.id, skill.label]))
  const documents = await Promise.all(
    LOCALES.map(async (locale) => {
      const ui = getUi(locale)
      const projects = await loadProjects(locale)
      const experience = await loadExperience(locale)
      return buildSearchDocuments({
        locale,
        profile: await loadProfile(locale),
        projects: projects.map((project) => ({
          slug: project.slug,
          title: project.title,
          summary: project.summary,
          origin: projectOrigin(project.employer, ui.projects),
          period: project.period,
          tech_labels: project.techs.map((id) => skill_labels.get(id) ?? id),
          body: project.body_text,
        })),
        experience: experience.map((item) => ({
          id: item.id,
          company: item.company,
          role: item.role,
          kind_label: ui.experience.kinds[item.kind],
          period: formatExperiencePeriod(item, locale, ui.experience.present),
          tech_labels: item.techs.map((id) => skill_labels.get(id) ?? id),
          body: item.body_text,
        })),
        experience_title: ui.experience.title,
        skills: SKILLS,
        category_labels: ui.stack.categories,
        tier_labels: ui.stack.tiers,
        stack_title: ui.stack.title,
      })
    }),
  )
  // Fail the build if the produced index ever breaks the contract the terminal relies on.
  return Response.json(SearchIndexSchema.parse(documents.flat()))
}
