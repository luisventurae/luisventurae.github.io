// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { parsePublicEnv } from './public-env'

describe('parsePublicEnv', () => {
  it('falls back to the local API and the Turnstile test key when unset', () => {
    expect(parsePublicEnv({})).toEqual({
      PUBLIC_API_URL: 'http://localhost:8787',
      PUBLIC_TURNSTILE_SITE_KEY: '1x00000000000000000000AA',
    })
  })

  it('keeps explicit values and ignores unrelated keys', () => {
    const env = parsePublicEnv({
      PUBLIC_API_URL: 'https://portfolio-api.example.workers.dev',
      PUBLIC_TURNSTILE_SITE_KEY: 'site-key',
      BASE_URL: '/',
    })
    expect(env).toEqual({
      PUBLIC_API_URL: 'https://portfolio-api.example.workers.dev',
      PUBLIC_TURNSTILE_SITE_KEY: 'site-key',
    })
  })

  it('rejects a variable that is set but empty, naming it', () => {
    expect(() => parsePublicEnv({ PUBLIC_API_URL: '' })).toThrow(
      'Invalid public env: PUBLIC_API_URL',
    )
    expect(() => parsePublicEnv({ PUBLIC_TURNSTILE_SITE_KEY: '' })).toThrow(
      'Invalid public env: PUBLIC_TURNSTILE_SITE_KEY',
    )
  })

  it('rejects an API URL that is not http(s)', () => {
    expect(() => parsePublicEnv({ PUBLIC_API_URL: 'not a url' })).toThrow('PUBLIC_API_URL')
    expect(() => parsePublicEnv({ PUBLIC_API_URL: 'ftp://api.example.test' })).toThrow(
      'PUBLIC_API_URL',
    )
  })
})
