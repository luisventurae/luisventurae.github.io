import { LOCALES } from '@portfolio/shared'
import type { APIRoute } from 'astro'

import { SKILLS } from '../data/skills'
import { getUi } from '../i18n'
import { loadProfile, loadProjects } from '../lib/content'
import { buildSearchDocuments } from '../lib/search-documents'

/** Prerendered chunks for the terminal's text search and the local RAG ingest. */
export const GET: APIRoute = async () => {
  const skill_labels = new Map(SKILLS.map((skill) => [skill.id, skill.label]))
  const documents = await Promise.all(
    LOCALES.map(async (locale) => {
      const ui = getUi(locale)
      const projects = await loadProjects(locale)
      return buildSearchDocuments({
        locale,
        profile: await loadProfile(locale),
        projects: projects.map((project) => ({
          slug: project.slug,
          title: project.title,
          summary: project.summary,
          company: project.company,
          period: project.period,
          tech_labels: project.techs.map((id) => skill_labels.get(id) ?? id),
          body: project.body_text,
        })),
        skills: SKILLS,
        category_labels: ui.stack.categories,
        stack_title: ui.stack.title,
      })
    }),
  )
  return Response.json(documents.flat())
}
