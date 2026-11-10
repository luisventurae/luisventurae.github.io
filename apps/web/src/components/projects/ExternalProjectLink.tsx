import type { ReactElement } from 'react'

import { safeExternalUrl } from '../../lib/external-link'

interface ExternalProjectLinkProps {
  url: string
  labels: { visit: string; new_tab: string }
}

/**
 * Link to the live site of a project. Only https destinations render; the new tab gets no
 * `window.opener` and no referrer, and the visitor sees the host before leaving.
 */
export function ExternalProjectLink({
  url,
  labels,
}: ExternalProjectLinkProps): ReactElement | null {
  const link = safeExternalUrl(url)
  if (!link) return null
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer external"
      referrerPolicy="no-referrer"
      className="pressable mt-8 inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 font-semibold text-on-accent"
    >
      {labels.visit}
      <span className="font-mono text-small opacity-80">{link.host}</span>
      <span aria-hidden="true">↗</span>
      <span className="sr-only">({labels.new_tab})</span>
    </a>
  )
}
