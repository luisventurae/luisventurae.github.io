/**
 * Technologies and proficiency (1–10), migrated from the previous site's SkillCard.
 * Entries marked `added_v3` come from this rebuild and should be reviewed by the owner.
 * Project technologies (src/data/projects.ts) must reference these ids.
 */
export type SkillCategory = 'backend' | 'frontend' | 'other'

export interface Skill {
  id: string
  label: string
  category: SkillCategory
  level: number
  added_v3?: true
}

export const SKILL_CATEGORIES: SkillCategory[] = ['backend', 'frontend', 'other']

export const SKILLS: Skill[] = [
  // Backend — languages
  { id: 'javascript', label: 'JavaScript', category: 'backend', level: 10 },
  { id: 'typescript', label: 'TypeScript', category: 'backend', level: 8.5 },
  { id: 'php', label: 'PHP', category: 'backend', level: 3 },
  { id: 'java', label: 'Java', category: 'backend', level: 4 },
  { id: 'solidity', label: 'Solidity', category: 'backend', level: 1 },
  // Backend — frameworks
  { id: 'nodejs', label: 'Node.js', category: 'backend', level: 9 },
  { id: 'nestjs', label: 'NestJS', category: 'backend', level: 7 },
  { id: 'express', label: 'Express', category: 'backend', level: 7 },
  { id: 'adonisjs', label: 'AdonisJS', category: 'backend', level: 8 },
  { id: 'mongoose', label: 'Mongoose', category: 'backend', level: 9 },
  { id: 'spring-boot', label: 'Spring Boot', category: 'backend', level: 1 },
  { id: 'hono', label: 'Hono', category: 'backend', level: 5, added_v3: true },
  // Backend — databases
  { id: 'mongodb', label: 'MongoDB', category: 'backend', level: 4 },
  { id: 'mysql', label: 'MySQL', category: 'backend', level: 4 },
  { id: 'postgresql', label: 'PostgreSQL', category: 'backend', level: 4 },
  { id: 'sql-server', label: 'SQL Server', category: 'backend', level: 4 },
  // Backend — servers & cloud
  { id: 'linux', label: 'Linux', category: 'backend', level: 4 },
  { id: 'cpanel', label: 'cPanel', category: 'backend', level: 5 },
  { id: 'aws', label: 'AWS', category: 'backend', level: 3 },
  { id: 'heroku', label: 'Heroku', category: 'backend', level: 4 },
  { id: 'vercel', label: 'Vercel', category: 'backend', level: 6 },
  { id: 'cloudflare', label: 'Cloudflare', category: 'backend', level: 4 },
  // Backend — communication
  { id: 'websockets', label: 'WebSockets', category: 'backend', level: 8 },
  { id: 'redis', label: 'Redis', category: 'backend', level: 4 },
  { id: 'kafka', label: 'Kafka', category: 'backend', level: 3 },
  // Frontend
  { id: 'vue', label: 'Vue.js', category: 'frontend', level: 6 },
  { id: 'nuxt', label: 'Nuxt', category: 'frontend', level: 4 },
  { id: 'react', label: 'React', category: 'frontend', level: 5, added_v3: true },
  { id: 'astro', label: 'Astro', category: 'frontend', level: 5, added_v3: true },
  { id: 'vite', label: 'Vite', category: 'frontend', level: 4 },
  { id: 'web-components', label: 'Web Components', category: 'frontend', level: 7 },
  { id: 'electron', label: 'Electron', category: 'frontend', level: 5, added_v3: true },
  { id: 'sass', label: 'Sass / SCSS', category: 'frontend', level: 9 },
  { id: 'stylus', label: 'Stylus', category: 'frontend', level: 8 },
  { id: 'tailwind', label: 'Tailwind CSS', category: 'frontend', level: 5, added_v3: true },
  { id: 'antdv', label: 'Ant Design Vue', category: 'frontend', level: 5 },
  { id: 'seo', label: 'SEO', category: 'frontend', level: 7 },
  { id: 'responsive', label: 'Responsive Design', category: 'frontend', level: 8 },
  { id: 'pwa', label: 'PWA', category: 'frontend', level: 8 },
  // Other — tools & integrations
  { id: 'git', label: 'Git', category: 'other', level: 9 },
  { id: 'docker', label: 'Docker', category: 'other', level: 4 },
  { id: 'waba', label: 'WhatsApp Business API', category: 'other', level: 8 },
  { id: 'zoho-crm', label: 'Zoho CRM', category: 'other', level: 5 },
  { id: 'airtable', label: 'Airtable API', category: 'other', level: 6 },
  { id: 'twilio', label: 'Twilio', category: 'other', level: 5 },
  { id: 'authy', label: 'Authy', category: 'other', level: 4 },
  { id: 'rag', label: 'RAG / Ollama', category: 'other', level: 4, added_v3: true },
  { id: 'vitest', label: 'Vitest', category: 'other', level: 5, added_v3: true },
  { id: 'playwright', label: 'Playwright', category: 'other', level: 4, added_v3: true },
  { id: 'scrum', label: 'Scrum', category: 'other', level: 6 },
]
