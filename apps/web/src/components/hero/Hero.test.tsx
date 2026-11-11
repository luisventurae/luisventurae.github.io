import { act, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { mockMatchMedia } from '../../../vitest.setup'
import { Hero, type HeroProps } from './Hero'

const props: HeroProps = {
  name: 'Luis Ventura E',
  greeting: 'Hola, soy',
  role: 'Backend Engineer · Node.js',
  facts: '7 años de experiencia · Node.js · TypeScript · AWS',
  social: {
    label: 'Redes sociales',
    new_tab: 'se abre en una pestaña nueva',
    links: [
      { key: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/luisventurae' },
      { key: 'github', label: 'GitHub', url: 'https://github.com/luisventurae' },
    ],
  },
  roles: ['Microservicios en AWS', 'Arquitectura hexagonal'],
  tagline: 'Construyo software web que se siente bien.',
  drag_hint: 'Arrastra las letras',
  cta_projects: 'Ver proyectos',
  cta_terminal: 'Abrir la terminal',
}

describe('Hero', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    vi.useRealTimers()
    mockMatchMedia()
  })

  it('announces the name once as a heading', () => {
    render(<Hero {...props} />)
    expect(screen.getByRole('heading', { level: 1, name: 'Luis Ventura E' })).toBeInTheDocument()
  })

  it('decorates with draggable stickers of the main stack, hidden from assistive tech', () => {
    const { container } = render(<Hero {...props} />)
    const stickers = [...container.querySelectorAll('.hero-sticker')]
    expect(stickers.map((sticker) => sticker.textContent)).toEqual(
      expect.arrayContaining([
        'Node.js',
        'TypeScript',
        'AWS',
        'NestJS',
        'MongoDB',
        'Claude Code',
        'Bedrock',
        'PostgreSQL',
      ]),
    )
    for (const sticker of stickers) expect(sticker).toHaveAttribute('aria-hidden', 'true')
  })

  it('links to the social profiles instead of an availability badge', () => {
    render(<Hero {...props} />)
    const nav = screen.getByRole('navigation', { name: 'Redes sociales' })
    const linkedin = within(nav).getByRole('link', { name: /LinkedIn/ })
    expect(linkedin).toHaveAttribute('href', 'https://www.linkedin.com/in/luisventurae')
    expect(linkedin).toHaveAttribute('target', '_blank')
    expect(linkedin).toHaveAttribute('rel', 'me noopener noreferrer')
    expect(linkedin).toHaveAccessibleName(/se abre en una pestaña nueva/)
    expect(within(nav).getAllByRole('link')).toHaveLength(2)
    expect(screen.queryByText(/Disponible/)).not.toBeInTheDocument()
  })

  it('shows the tagline and calls to action', () => {
    render(<Hero {...props} />)
    expect(screen.getByText(props.tagline)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver proyectos' })).toHaveAttribute('href', '#projects')
    expect(screen.getByRole('link', { name: 'Abrir la terminal' })).toHaveAttribute(
      'href',
      '#terminal',
    )
  })

  it('rotates the role over time', () => {
    render(<Hero {...props} />)
    expect(screen.getByText('Microservicios en AWS')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(2700))
    expect(screen.getByText('Arquitectura hexagonal')).toBeInTheDocument()
  })

  it('keeps the key facts outside the rotation', () => {
    render(<Hero {...props} />)
    const fixed = [props.role, props.facts]
    for (const text of fixed) expect(screen.getByText(text)).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(2700))
    for (const text of fixed) expect(screen.getByText(text)).toBeInTheDocument()
  })

  it('keeps a single role when reduced motion is requested', () => {
    mockMatchMedia(['(prefers-reduced-motion: reduce)'])
    render(<Hero {...props} />)
    act(() => vi.advanceTimersByTime(6000))
    expect(screen.getByText('Microservicios en AWS')).toBeInTheDocument()
    expect(screen.queryByText('Arquitectura hexagonal')).not.toBeInTheDocument()
  })

  it('asks the terminal to take focus', () => {
    const listener = vi.fn()
    window.addEventListener('terminal:focus', listener)
    render(<Hero {...props} />)
    screen.getByRole('link', { name: 'Abrir la terminal' }).click()
    expect(listener).toHaveBeenCalled()
    window.removeEventListener('terminal:focus', listener)
  })
})
