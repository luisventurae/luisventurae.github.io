import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ProjectGallery } from './ProjectGallery'
import type { ProjectMedia } from './types'

const labels = {
  gallery: 'Capturas de {title}',
  carousel: 'carrusel',
  slide: 'captura',
  mobile_view: 'Móvil',
  desktop_view: 'Escritorio',
  previous_image: 'Captura anterior',
  next_image: 'Captura siguiente',
  go_to_image: 'Ver captura {n} de {count}',
}

function shot(n: number, frame: ProjectMedia['frame'] = 'desktop'): ProjectMedia {
  return {
    src: `/shot-${n}.webp`,
    srcset: '',
    width: frame === 'mobile' ? 390 : 1440,
    height: frame === 'mobile' ? 844 : 900,
    alt: `Ticker: captura ${n}`,
    frame,
  }
}

const media = [shot(1), shot(2, 'mobile'), shot(3)]

describe('ProjectGallery', () => {
  it('exposes a labelled carousel with one slide per screenshot', () => {
    render(<ProjectGallery media={media} title="Ticker" labels={labels} />)
    const carousel = screen.getByRole('region', { name: 'Capturas de Ticker' })
    expect(carousel).toHaveAttribute('aria-roledescription', 'carrusel')
    expect(within(carousel).getAllByRole('group')).toHaveLength(3)
    expect(screen.getByRole('img', { name: 'Ticker: captura 2' })).toBeInTheDocument()
  })

  it('frames portrait screenshots as a phone', () => {
    render(<ProjectGallery media={media} title="Ticker" labels={labels} />)
    const slides = screen.getAllByRole('group')
    expect(slides[1]).toHaveAttribute('data-frame', 'mobile')
    expect(slides[0]).toHaveAttribute('data-frame', 'desktop')
  })

  it('moves between screenshots with the buttons and the dots', async () => {
    const user = userEvent.setup()
    render(<ProjectGallery media={media} title="Ticker" labels={labels} />)
    const dot = (n: number): HTMLElement =>
      screen.getByRole('button', { name: `Ver captura ${n} de 3` })
    expect(dot(1)).toHaveAttribute('aria-current', 'true')
    expect(screen.getByRole('button', { name: 'Captura anterior' })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: 'Captura siguiente' }))
    expect(dot(2)).toHaveAttribute('aria-current', 'true')

    await user.click(dot(3))
    expect(dot(3)).toHaveAttribute('aria-current', 'true')
    expect(screen.getByRole('button', { name: 'Captura siguiente' })).toBeDisabled()
  })

  it('moves with arrow keys from the dots without changing project', () => {
    const handleDocumentKey = vi.fn()
    document.addEventListener('keydown', handleDocumentKey)
    render(<ProjectGallery media={media} title="Ticker" labels={labels} />)
    const first = screen.getByRole('button', { name: 'Ver captura 1 de 3' })
    expect(first).toHaveAttribute('tabindex', '0')
    first.focus()
    fireEvent.keyDown(first, { key: 'ArrowRight' })
    const second = screen.getByRole('button', { name: 'Ver captura 2 de 3' })
    expect(second).toHaveAttribute('aria-current', 'true')
    expect(second).toHaveFocus()
    expect(handleDocumentKey).not.toHaveBeenCalled()
    document.removeEventListener('keydown', handleDocumentKey)
  })

  it('shows a single screenshot without controls', () => {
    render(<ProjectGallery media={[shot(1)]} title="Ticker" labels={labels} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Ticker: captura 1' })).toBeInTheDocument()
  })

  it('falls back to the initials placeholder without screenshots', () => {
    render(<ProjectGallery media={[]} title="Ticker" labels={labels} />)
    expect(screen.getByRole('img', { name: 'Ticker' })).toHaveTextContent('T')
  })
})
