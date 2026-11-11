import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ExternalProjectLink } from './ExternalProjectLink'

const labels = { visit: 'Visitar sitio', new_tab: 'se abre en una pestaña nueva' }

describe('ExternalProjectLink', () => {
  it('opens the original site in a new tab without leaking the opener or referrer', () => {
    render(<ExternalProjectLink url="https://www.prestamype.com" labels={labels} />)
    const link = screen.getByRole('link', { name: /Visitar sitio.*prestamype\.com/ })
    expect(link).toHaveAttribute('href', 'https://www.prestamype.com/')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer external')
    expect(link).toHaveAttribute('referrerpolicy', 'no-referrer')
    expect(link).toHaveAccessibleName(/se abre en una pestaña nueva/)
  })

  it('renders nothing for an unsafe URL', () => {
    const { container } = render(
      <ExternalProjectLink url="http://beexcc.com/ticker/" labels={labels} />,
    )
    expect(container).toBeEmptyDOMElement()
  })
})
