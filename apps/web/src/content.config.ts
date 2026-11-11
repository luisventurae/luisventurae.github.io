import { glob } from 'astro/loaders'
import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'

const projects = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string().min(1).max(60),
    summary: z.string().min(1).max(120),
    role: z.string().min(1).max(60),
  }),
})

const profile = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/profile' }),
  schema: z.object({ title: z.string().min(1) }),
})

const experience = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './src/content/experience' }),
  schema: z.object({ role: z.string().min(1).max(60) }),
})

export const collections = { projects, profile, experience }
