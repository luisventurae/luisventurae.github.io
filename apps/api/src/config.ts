import { z } from 'zod'

const LOCAL_SECRET_MARKER = 'local-dev-only'

const EnvSchema = z.object({
  ENVIRONMENT: z.enum(['development', 'production']).default('development'),
  ALLOWED_ORIGIN: z.url(),
  TURNSTILE_SECRET_KEY: z.string().min(1),
  DOWNLOAD_TOKEN_SECRET: z.string().min(32),
  NOTIFY_EMAIL: z.email(),
  EMAIL_FROM: z.email().default('portfolio@localhost.test'),
  EMAIL_TRANSPORT: z.enum(['cloudflare', 'mailpit']).default('cloudflare'),
  MAILPIT_URL: z.url().optional(),
})

export type Config = z.infer<typeof EnvSchema>

export class ConfigError extends Error {
  constructor(issues: string[]) {
    // Only field names are reported, never values (docs/security.md › Código).
    super(`Invalid configuration: ${issues.join(', ')}`)
    this.name = 'ConfigError'
  }
}

export function parseConfig(env: Record<string, unknown>): Config {
  const parsed = EnvSchema.safeParse(env)
  if (!parsed.success) {
    throw new ConfigError(parsed.error.issues.map((issue) => issue.path.join('.')))
  }
  const config = parsed.data
  if (config.ENVIRONMENT === 'production') assertProductionSafe(config)
  if (config.EMAIL_TRANSPORT === 'mailpit' && !config.MAILPIT_URL) {
    throw new ConfigError(['MAILPIT_URL'])
  }
  return config
}

function assertProductionSafe(config: z.infer<typeof EnvSchema>): void {
  const issues: string[] = []
  if (config.DOWNLOAD_TOKEN_SECRET.includes(LOCAL_SECRET_MARKER))
    issues.push('DOWNLOAD_TOKEN_SECRET')
  if (config.EMAIL_TRANSPORT !== 'cloudflare') issues.push('EMAIL_TRANSPORT')
  if (issues.length > 0) throw new ConfigError(issues)
}
