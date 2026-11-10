import type { SkillCategory } from '../../data/skills'

export interface ProjectMedia {
  src: string
  srcset: string
  width: number
  height: number
  alt: string
}

interface ProjectTech {
  id: string
  label: string
  category: SkillCategory
}

/** Serializable project data handed from Astro to the React islands. */
export interface ProjectCard {
  slug: string
  title: string
  summary: string
  company: string
  period: string
  techs: ProjectTech[]
  media: ProjectMedia[]
  url?: string | undefined
  role: string
  featured: boolean
  /** HTML rendered at build time from our own markdown in src/content (trusted). */
  body_html: string
}

export interface ProjectsLabels {
  open: string
  period: string
  role: string
  technologies: string
  visit: string
  previous: string
  next: string
  close: string
  swipe_hint: string
}
