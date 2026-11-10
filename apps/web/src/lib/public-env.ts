import { z } from 'astro/zod'

const LOCAL_API_URL = 'http://localhost:8787'
// Public test site key from Cloudflare docs: always passes. Not a credential.
const TEST_TURNSTILE_SITE_KEY = '1x00000000000000000000AA'

const PublicEnvSchema = z.object({
  PUBLIC_API_URL: z.url({ protocol: /^https?$/ }).default(LOCAL_API_URL),
  PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1).default(TEST_TURNSTILE_SITE_KEY),
})

export type PublicEnv = z.infer<typeof PublicEnvSchema>

/**
 * Validates the build-time public variables. Unset values fall back to local development
 * defaults; a value that is set but invalid (an empty CI variable included) fails the build.
 */
export function parsePublicEnv(source: unknown): PublicEnv {
  const result = PublicEnvSchema.safeParse(source)
  if (result.success) return result.data
  const names = result.error.issues.map((issue) => issue.path.join('.'))
  throw new Error(`Invalid public env: ${[...new Set(names)].join(', ')}`)
}
