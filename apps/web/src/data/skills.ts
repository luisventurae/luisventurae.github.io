/**
 * Technologies grouped by how much they are used (openspec stack-map › Categorized technologies).
 * Tiers replace the old numeric self-rating: `daily` is the current work stack, `production`
 * shipped to real users, `exploring` used in side work or learning. Order inside a tier is the
 * display order. Project and experience technologies must reference these ids.
 */
export type SkillCategory = 'backend' | 'frontend' | 'other'

export type SkillTier = 'daily' | 'production' | 'exploring'

export const SKILL_TIERS: SkillTier[] = ['daily', 'production', 'exploring']

export interface Skill {
  id: string
  label: string
  category: SkillCategory
  tier: SkillTier
}

export const SKILLS: Skill[] = [
  // Backend — languages and runtime
  { id: 'nodejs', label: 'Node.js', category: 'backend', tier: 'daily' },
  { id: 'typescript', label: 'TypeScript', category: 'backend', tier: 'daily' },
  { id: 'javascript', label: 'JavaScript', category: 'backend', tier: 'daily' },
  { id: 'java', label: 'Java', category: 'backend', tier: 'exploring' },
  { id: 'php', label: 'PHP', category: 'backend', tier: 'exploring' },
  // Backend — architecture and cloud
  { id: 'aws', label: 'AWS', category: 'backend', tier: 'daily' },
  { id: 'aws-cdk', label: 'AWS CDK', category: 'backend', tier: 'daily' },
  { id: 'lambda', label: 'AWS Lambda', category: 'backend', tier: 'production' },
  { id: 'sqs', label: 'Amazon SQS', category: 'backend', tier: 'production' },
  { id: 'sns', label: 'Amazon SNS', category: 'backend', tier: 'production' },
  { id: 'eum', label: 'AWS End User Messaging', category: 'backend', tier: 'production' },
  { id: 's3', label: 'Amazon S3', category: 'backend', tier: 'production' },
  { id: 'eventbridge', label: 'Amazon EventBridge', category: 'backend', tier: 'production' },
  { id: 'ses', label: 'Amazon SES', category: 'backend', tier: 'production' },
  { id: 'dynamodb', label: 'Amazon DynamoDB', category: 'backend', tier: 'production' },
  { id: 'cloudwatch', label: 'Amazon CloudWatch', category: 'backend', tier: 'production' },
  { id: 'codepipeline', label: 'AWS CodePipeline', category: 'backend', tier: 'production' },
  { id: 'bedrock', label: 'Amazon Bedrock', category: 'backend', tier: 'production' },
  { id: 'microservices', label: 'Microservices', category: 'backend', tier: 'daily' },
  {
    id: 'hexagonal-architecture',
    label: 'Hexagonal Architecture',
    category: 'backend',
    tier: 'daily',
  },
  { id: 'cloudflare', label: 'Cloudflare Workers', category: 'backend', tier: 'production' },
  { id: 'vercel', label: 'Vercel', category: 'backend', tier: 'production' },
  { id: 'linux', label: 'Linux', category: 'backend', tier: 'production' },
  // Backend — frameworks
  { id: 'nestjs', label: 'NestJS', category: 'backend', tier: 'production' },
  { id: 'express', label: 'Express', category: 'backend', tier: 'production' },
  { id: 'adonisjs', label: 'AdonisJS', category: 'backend', tier: 'production' },
  { id: 'koajs', label: 'Koa.js', category: 'backend', tier: 'production' },
  { id: 'hono', label: 'Hono', category: 'backend', tier: 'production' },
  { id: 'mongoose', label: 'Mongoose', category: 'backend', tier: 'production' },
  // Backend — data and messaging
  { id: 'mongodb', label: 'MongoDB', category: 'backend', tier: 'daily' },
  { id: 'mysql', label: 'MySQL', category: 'backend', tier: 'production' },
  { id: 'postgresql', label: 'PostgreSQL', category: 'backend', tier: 'production' },
  { id: 'sql-server', label: 'SQL Server', category: 'backend', tier: 'production' },
  { id: 'redis', label: 'Redis', category: 'backend', tier: 'production' },
  { id: 'websockets', label: 'WebSockets', category: 'backend', tier: 'production' },
  { id: 'smtp', label: 'SMTP', category: 'backend', tier: 'production' },
  { id: 'kafka', label: 'Kafka', category: 'backend', tier: 'exploring' },
  // Frontend
  { id: 'vue', label: 'Vue.js', category: 'frontend', tier: 'production' },
  { id: 'nuxt', label: 'Nuxt', category: 'frontend', tier: 'production' },
  { id: 'react', label: 'React', category: 'frontend', tier: 'production' },
  { id: 'astro', label: 'Astro', category: 'frontend', tier: 'production' },
  { id: 'react-pdf', label: 'React PDF', category: 'frontend', tier: 'production' },
  { id: 'tailwind', label: 'Tailwind CSS', category: 'frontend', tier: 'production' },
  { id: 'electron', label: 'Electron', category: 'frontend', tier: 'production' },
  { id: 'web-components', label: 'Web Components', category: 'frontend', tier: 'production' },
  { id: 'vite', label: 'Vite', category: 'frontend', tier: 'production' },
  { id: 'sass', label: 'Sass / SCSS', category: 'frontend', tier: 'production' },
  { id: 'stylus', label: 'Stylus', category: 'frontend', tier: 'production' },
  { id: 'antdv', label: 'Ant Design Vue', category: 'frontend', tier: 'production' },
  { id: 'pwa', label: 'PWA', category: 'frontend', tier: 'production' },
  { id: 'responsive', label: 'Responsive Design', category: 'frontend', tier: 'production' },
  { id: 'seo', label: 'SEO', category: 'frontend', tier: 'production' },
  // Other — tools, integrations and practices
  { id: 'git', label: 'Git', category: 'other', tier: 'daily' },
  { id: 'claude-code', label: 'Claude Code', category: 'other', tier: 'daily' },
  { id: 'codex', label: 'Codex', category: 'other', tier: 'daily' },
  { id: 'sdd', label: 'SDD', category: 'other', tier: 'daily' },
  { id: 'tdd', label: 'TDD', category: 'other', tier: 'daily' },
  { id: 'design-patterns', label: 'Design Patterns', category: 'other', tier: 'daily' },
  { id: 'owasp', label: 'OWASP', category: 'other', tier: 'daily' },
  { id: 'scrum', label: 'Scrum', category: 'other', tier: 'daily' },
  { id: 'chatbots', label: 'Chatbots', category: 'other', tier: 'production' },
  { id: 'waba', label: 'WhatsApp Business API', category: 'other', tier: 'production' },
  { id: 'zoho-crm', label: 'Zoho CRM', category: 'other', tier: 'production' },
  { id: 'airtable', label: 'Airtable API', category: 'other', tier: 'production' },
  { id: 'twilio', label: 'Twilio', category: 'other', tier: 'production' },
  { id: 'authy', label: 'Authy', category: 'other', tier: 'production' },
  { id: 'docker', label: 'Docker', category: 'other', tier: 'production' },
  { id: 'vitest', label: 'Vitest', category: 'other', tier: 'production' },
  { id: 'playwright', label: 'Playwright', category: 'other', tier: 'production' },
  { id: 'rag', label: 'RAG', category: 'other', tier: 'exploring' },
]

/** Daily first, then production, then exploring; stable inside each tier. */
export function sortByTier<T extends { tier: SkillTier }>(skills: T[]): T[] {
  return [...skills].sort((a, b) => SKILL_TIERS.indexOf(a.tier) - SKILL_TIERS.indexOf(b.tier))
}
