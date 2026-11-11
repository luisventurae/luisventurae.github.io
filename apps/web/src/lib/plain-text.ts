const MARK_TAG = /<\/?mark>/g

/**
 * Profile copy highlights key facts with <mark> for the page; plain-text consumers (terminal
 * `whoami`, search index) get the same words without the tags.
 */
export function stripInlineMarks(text: string): string {
  return text.replace(MARK_TAG, '')
}
