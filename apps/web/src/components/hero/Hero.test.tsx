import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { mockMatchMedia } from '../../../vitest.setup'
import { Hero, type HeroProps } from './Hero'

const props: HeroProps = {
  name: 'Luis Ventura E',
  greeting: 'Hola, soy',
  role: 'Backend Engineer · Node.js',
  facts: '7 años de experiencia · Node.js · TypeScript · AWS',
  availability: 'Disponible · remoto o híbrido · Perú',
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
    const fixed = [props.role, props.facts, props.availability]
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
