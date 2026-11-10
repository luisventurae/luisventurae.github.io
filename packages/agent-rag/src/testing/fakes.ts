import type { Embedder } from '../core/ports.ts'

const CONCEPTS: Record<string, string[]> = {
  captcha: ['captcha', 'challenge', 'turnstile', 'validation', 'verify'],
  mail: ['mail', 'email', 'notification', 'send'],
  token: ['token', 'signer', 'hmac'],
}

/** Deterministic embedder that maps synonyms onto the same dimension. */
export function conceptEmbedder(): Embedder {
  const names = Object.keys(CONCEPTS)
  return {
    model: 'fake-concepts',
    embed: async (texts) =>
      texts.map((text) => {
        const words = text.toLowerCase().split(/[^a-z]+/)
        const vector = Float32Array.from(
          names.map((name) => words.filter((word) => CONCEPTS[name]?.includes(word)).length),
        )
        const norm = Math.hypot(...vector) || 1
        return vector.map((value) => value / norm)
      }),
  }
}
