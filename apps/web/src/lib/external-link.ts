export interface ExternalLink {
  href: string
  /** Hostname without `www.`, shown to the visitor before leaving the site. */
  host: string
}

/**
 * Validates a link to a third-party site: only plain https, never credentials in the URL.
 * Anything else returns `null` so the link is not rendered at all.
 */
export function safeExternalUrl(raw: string): ExternalLink | null {
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    return null
  }
  if (url.protocol !== 'https:' || url.username || url.password) return null
  return { href: url.href, host: url.hostname.replace(/^www\./, '') }
}
