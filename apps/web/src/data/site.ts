export const SITE_URL = 'https://luisventurae.github.io'
export const SOURCE_URL = 'https://github.com/luisventurae/luisventurae.github.io'

export const PERSON = {
  name: 'Luis Ventura E',
  full_name: 'Luis Miguel Ventura E',
  job_title: 'Backend Engineer · Node.js',
  image_path: '/luis-83x83.jpg',
} as const

/** First month of professional work (`YYYY-MM`); years of experience are derived from it. */
export const CAREER_START = '2019-01'

export interface SocialLink {
  key: 'linkedin' | 'github' | 'gitlab' | 'twitter'
  label: string
  url: string
}

export const SOCIAL_LINKS: SocialLink[] = [
  { key: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/luisventurae' },
  { key: 'github', label: 'GitHub', url: 'https://github.com/luisventurae' },
  { key: 'gitlab', label: 'GitLab', url: 'https://gitlab.com/luisventurae' },
  { key: 'twitter', label: 'X (Twitter)', url: 'https://x.com/luisventurae' },
]
