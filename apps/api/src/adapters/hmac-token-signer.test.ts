import { describe, expect, it } from 'vitest'

import { createHmacTokenSigner } from './hmac-token-signer'

const SECRET = 'a-very-long-test-secret-of-at-least-32-chars'
const payload = { locale: 'en' as const, exp: 1_800_000_000_000 }

describe('createHmacTokenSigner', () => {
  it('round-trips a payload', async () => {
    const signer = createHmacTokenSigner(SECRET)
    const token = await signer.sign(payload)
    expect(token).toMatch(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/)
    expect(await signer.verify(token)).toEqual(payload)
  })

  it('rejects a token with any character changed', async () => {
    const signer = createHmacTokenSigner(SECRET)
    const token = await signer.sign(payload)
    const tampered = `${token.slice(0, 5)}${token[5] === 'A' ? 'B' : 'A'}${token.slice(6)}`
    expect(await signer.verify(tampered)).toBeNull()
  })

  it('rejects tokens signed with another secret', async () => {
    const token = await createHmacTokenSigner(`${SECRET}-other`).sign(payload)
    expect(await createHmacTokenSigner(SECRET).verify(token)).toBeNull()
  })

  it.each(['', 'abc', 'a.b.c', '!!.??', 'e30.'])('rejects malformed token %o', async (token) => {
    expect(await createHmacTokenSigner(SECRET).verify(token)).toBeNull()
  })
})
