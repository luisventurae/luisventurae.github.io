import { describe, expect, it } from 'vitest'

import { createHmacTokenSigner } from './hmac-token-signer'

// Obviously fake key material: long enough for HMAC, low entropy so scanners don't flag it.
const SECRET = 'x'.repeat(48)
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

  it('rejects non-canonical signatures that decode to the same bytes', async () => {
    // 32 HMAC bytes take 43 base64url chars; the last one carries 2 unused bits, so
    // several characters decode to the same signature. Only the canonical one is valid.
    const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
    const signer = createHmacTokenSigner(SECRET)
    const token = await signer.sign(payload)
    const last = ALPHABET.indexOf(token.at(-1) ?? '')
    for (const flip of [1, 2, 3]) {
      const variant = `${token.slice(0, -1)}${ALPHABET[last ^ flip] ?? ''}`
      expect(await signer.verify(variant), variant).toBeNull()
    }
  })

  it('rejects tokens signed with another secret', async () => {
    const token = await createHmacTokenSigner(`${SECRET}-other`).sign(payload)
    expect(await createHmacTokenSigner(SECRET).verify(token)).toBeNull()
  })

  it.each(['', 'abc', 'a.b.c', '!!.??', 'e30.'])('rejects malformed token %o', async (token) => {
    expect(await createHmacTokenSigner(SECRET).verify(token)).toBeNull()
  })
})
