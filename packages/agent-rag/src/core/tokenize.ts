/**
 * Splits text into lowercase terms. Identifiers keep their whole form and also contribute
 * their parts, so `parseConfig` matches `parse`, `config` and `parseconfig`.
 */
export function tokenize(text: string): string[] {
  const terms: string[] = []
  for (const word of text.split(/[^\p{L}\p{N}_]+/u)) {
    if (word === '') continue
    terms.push(word.toLowerCase())
    const parts = word.split(/_+|(?<=[\p{Ll}\p{N}])(?=\p{Lu})|(?<=\p{Lu})(?=\p{Lu}\p{Ll})/u)
    if (parts.length > 1) {
      for (const part of parts) if (part !== '') terms.push(part.toLowerCase())
    }
  }
  return terms
}
