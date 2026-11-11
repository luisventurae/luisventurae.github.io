import type { SkillCategory } from '../../data/skills'
import type { MediaFrame } from '../../lib/gallery'
import type { ProjectEmployer } from '../../lib/projects'

export interface ProjectMedia {
  src: string
  srcset: string
  width: number
  height: number
  alt: string
  /** Portrait captures render inside a phone frame. */
  frame: MediaFrame
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
  /** Job the project was built in; `null` for a personal project. */
  employer: ProjectEmployer | null
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
  /** Drawer position, `{n}` and `{count}` tokens. */
  counter: string
  /** Templates: `{title}`, `{n}` and `{count}` tokens. */
  gallery: string
  /** `aria-roledescription` of the gallery and of each slide. */
  carousel: string
  slide: string
  mobile_view: string
  desktop_view: string
  previous_image: string
  next_image: string
  go_to_image: string
  /** Card badge, `{count}` token. */
  screenshots: string
  new_tab: string
  /** Template with a `{company}` token, e.g. "En {company}". */
  at_company: string
  personal: string
}
