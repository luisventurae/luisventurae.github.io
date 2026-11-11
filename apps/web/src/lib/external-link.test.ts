// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { PROJECTS } from '../data/projects'
import { safeExternalUrl } from './external-link'

describe('safeExternalUrl', () => {
  it('accepts https URLs and exposes a readable host', () => {
    expect(safeExternalUrl('https://www.prestamype.com')).toEqual({
      href: 'https://www.prestamype.com/',
      host: 'prestamype.com',
    })
  })

  it('rejects anything that is not plain https', () => {
    expect(safeExternalUrl('http://example.com')).toBeNull()
    expect(safeExternalUrl('javascript:alert(1)')).toBeNull()
    expect(safeExternalUrl('https://user:pass@example.com')).toBeNull()
    expect(safeExternalUrl('not a url')).toBeNull()
  })
})

describe('project links', () => {
  it('only points to safe https destinations', () => {
    for (const project of PROJECTS) {
      if (project.url) expect(safeExternalUrl(project.url), project.slug).not.toBeNull()
    }
  })
})
