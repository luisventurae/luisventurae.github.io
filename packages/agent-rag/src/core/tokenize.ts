const STOP_WORDS = new Set(
  (
    'a al algo ante antes como con contra cual cuando de del desde donde dónde durante el ella ellos en entre ' +
    'era es esa ese eso esta este esto estos fue ha hay la las le les lo los me mi mucho muy ni no nos o otra ' +
    'otro para pero por porque qué que quien se si sin sobre son su sus también tanto te un una uno unos y ya yo ' +
    'an and are as at be by do does for from how in is it its of on or that the this to was what when where which who with'
  ).split(' '),
)

/**
 * Splits text into lowercase terms. Identifiers keep their whole form and also contribute
 * their parts, so `parseConfig` matches `parse`, `config` and `parseconfig`.
 */
export function tokenize(text: string): string[] {
  const terms: string[] = []
  for (const word of text.split(/[^\p{L}\p{N}_]+/u)) {
    if (word === '' || STOP_WORDS.has(word.toLowerCase())) continue
    terms.push(word.toLowerCase())
    const parts = word.split(/_+|(?<=[\p{Ll}\p{N}])(?=\p{Lu})|(?<=\p{Lu})(?=\p{Lu}\p{Ll})/u)
    if (parts.length > 1) {
      for (const part of parts) {
        if (part !== '' && !STOP_WORDS.has(part.toLowerCase())) terms.push(part.toLowerCase())
      }
    }
  }
  return terms
}
