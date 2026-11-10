import { describe, expect, it } from 'vitest'

import { ConfigError, parseConfig } from './config'

const local_env = {
  ALLOWED_ORIGIN: 'http://localhost:4321',
  TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA',
  DOWNLOAD_TOKEN_SECRET: 'local-dev-only-0000000000000000000000000000',
  NOTIFY_EMAIL: 'owner@example.test',
  EMAIL_TRANSPORT: 'mailpit',
  MAILPIT_URL: 'http://mailpit:8025',
  RAG_ENABLED: 'true',
}

const production_env = {
  ENVIRONMENT: 'production',
  ALLOWED_ORIGIN: 'https://luisventurae.github.io',
  TURNSTILE_SECRET_KEY: 'secret',
  DOWNLOAD_TOKEN_SECRET: 'x'.repeat(48),
  NOTIFY_EMAIL: 'owner@example.test',
  EMAIL_FROM: 'portfolio@example.dev',
}

describe('parseConfig', () => {
  it('accepts the local environment', () => {
    const config = parseConfig(local_env)
    expect(config.rag_enabled).toBe(true)
    expect(config.EMAIL_TRANSPORT).toBe('mailpit')
  })

  it('accepts a safe production environment with RAG disabled by default', () => {
    expect(parseConfig(production_env).rag_enabled).toBe(false)
  })

  it('refuses local secrets, RAG or Mailpit in production', () => {
    expect(() =>
      parseConfig({ ...production_env, DOWNLOAD_TOKEN_SECRET: `local-dev-only-${'0'.repeat(32)}` }),
    ).toThrow(ConfigError)
    expect(() => parseConfig({ ...production_env, RAG_ENABLED: 'true' })).toThrow(/RAG_ENABLED/)
    expect(() =>
      parseConfig({ ...production_env, EMAIL_TRANSPORT: 'mailpit', MAILPIT_URL: 'http://m' }),
    ).toThrow(/EMAIL_TRANSPORT/)
  })

  it('reports missing fields by name without leaking values', () => {
    const attempt = (): unknown =>
      parseConfig({ ...production_env, DOWNLOAD_TOKEN_SECRET: 'short' })
    expect(attempt).toThrow(/DOWNLOAD_TOKEN_SECRET/)
    expect(attempt).not.toThrow(/short/)
  })

  it('requires the Mailpit URL for the mailpit transport', () => {
    expect(() => parseConfig({ ...local_env, MAILPIT_URL: undefined })).toThrow(/MAILPIT_URL/)
  })
})
