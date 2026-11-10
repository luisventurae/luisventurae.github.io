import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'

import { selection_store } from '../../lib/selection-store'
import { initials } from './ProjectMediaView'
import { ProjectGrid } from './ProjectGrid'
import type { ProjectCard, ProjectsLabels } from './types'

const labels: ProjectsLabels = {
  open: 'Ver detalle',
  period: 'Período',
  technologies: 'Tecnologías',
  visit: 'Visitar sitio',
  previous: 'Proyecto anterior',
  next: 'Proyecto siguiente',
  close: 'Cerrar',
  swipe_hint: 'Desliza',
}

function project(slug: string, title: string, tech_ids: string[]): ProjectCard {
  return {
    slug,
    title,
    summary: `${title} summary`,
    company: 'ACME',
    period: 'jun 2023',
    techs: tech_ids.map((id) => ({ id, label: id, category: 'backend' })),
    media: [],
    body_html: `<p>${title} body</p>`,
  }
}

const projects = [project('a', 'Alpha', ['vue']), project('b', 'Beta', ['nodejs'])]

describe('ProjectGrid', () => {
  afterEach(() => act(() => selection_store.clear()))

  it('lists projects with a placeholder when media is missing', () => {
    render(<ProjectGrid projects={projects} labels={labels} />)
    expect(screen.getByRole('button', { name: 'Ver detalle: Alpha' })).toBeInTheDocument()
    expect(screen.getAllByRole('img', { name: 'Alpha' })[0]).toHaveTextContent('A')
  })

  it('highlights projects that use the active technology', () => {
    render(<ProjectGrid projects={projects} labels={labels} />)
    act(() => selection_store.toggle('vue'))
    const alpha = screen.getByRole('button', { name: 'Ver detalle: Alpha' }).parentElement
    const beta = screen.getByRole('button', { name: 'Ver detalle: Beta' }).parentElement
    expect(alpha).toHaveAttribute('data-state', 'match')
    expect(beta).toHaveAttribute('data-state', 'dimmed')
  })

  it('opens the detail drawer and navigates between projects', async () => {
    render(<ProjectGrid projects={projects} labels={labels} />)
    await userEvent.click(screen.getByRole('button', { name: 'Ver detalle: Alpha' }))
    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveTextContent('Alpha body')
    expect(screen.getByRole('button', { name: 'Proyecto anterior' })).toBeDisabled()
    await userEvent.click(screen.getByRole('button', { name: 'Proyecto siguiente' }))
    expect(await screen.findByText('Beta body')).toBeInTheDocument()
  })
})

describe('initials', () => {
  it('takes up to two initials', () => {
    expect(initials('Pool Work Confort')).toBe('PW')
    expect(initials('Ticker')).toBe('T')
  })
})
