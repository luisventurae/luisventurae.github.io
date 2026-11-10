import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'

import { selection_store } from '../../lib/selection-store'
import { initials } from './ProjectMediaView'
import { ProjectGrid } from './ProjectGrid'
import type { ProjectCard, ProjectsLabels } from './types'

const labels: ProjectsLabels = {
  open: 'Ver detalle',
  period: 'Período',
  role: 'Mi rol',
  technologies: 'Tecnologías',
  visit: 'Visitar sitio',
  previous: 'Proyecto anterior',
  next: 'Proyecto siguiente',
  close: 'Cerrar',
  swipe_hint: 'Desliza',
  at_company: 'En {company}',
  personal: 'Proyecto personal',
}

function project(slug: string, title: string, tech_ids: string[]): ProjectCard {
  return {
    slug,
    title,
    summary: `${title} summary`,
    employer: { experience_id: 'acme', company: 'ACME' },
    period: 'jun 2023',
    techs: tech_ids.map((id) => ({ id, label: id, category: 'backend' })),
    media: [],
    role: 'Backend Developer',
    featured: false,
    body_html: `<p>${title} body</p>`,
  }
}

const projects = [
  { ...project('a', 'Alpha', ['vue']), featured: true },
  { ...project('b', 'Beta', ['nodejs']), employer: null },
]

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
    expect(dialog).toHaveTextContent('Mi rol: Backend Developer')
    expect(screen.getByRole('button', { name: 'Proyecto anterior' })).toBeDisabled()
    await userEvent.click(screen.getByRole('button', { name: 'Proyecto siguiente' }))
    expect(await screen.findByText('Beta body')).toBeInTheDocument()
  })
})

describe('work origin', () => {
  afterEach(() => window.history.replaceState(null, '', '/'))

  it('says where each case study was built', () => {
    render(<ProjectGrid projects={projects} labels={labels} />)
    expect(screen.getByRole('button', { name: 'Ver detalle: Alpha' })).toHaveTextContent(
      'En ACME · jun 2023',
    )
    expect(screen.getByRole('button', { name: 'Ver detalle: Beta' })).toHaveTextContent(
      'Proyecto personal · jun 2023',
    )
  })

  it('links the drawer back to the job and closes on the way', async () => {
    render(<ProjectGrid projects={projects} labels={labels} />)
    await userEvent.click(screen.getByRole('button', { name: 'Ver detalle: Alpha' }))
    const dialog = await screen.findByRole('dialog')
    const back = within(dialog).getByRole('link', { name: 'En ACME' })
    expect(back).toHaveAttribute('href', '#experience-acme')
    await userEvent.click(back)
    // jsdom never finishes the exit animation; the jump to the job is covered in E2E.
    await waitFor(() => expect(dialog).toHaveAttribute('data-state', 'closed'))
  })

  it('shows a personal project without a link back', async () => {
    render(<ProjectGrid projects={projects} labels={labels} />)
    await userEvent.click(screen.getByRole('button', { name: 'Ver detalle: Beta' }))
    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveTextContent('Proyecto personal')
    expect(within(dialog).queryByRole('link', { name: 'Proyecto personal' })).toBeNull()
  })
})

describe('deep links', () => {
  afterEach(() => window.history.replaceState(null, '', '/'))

  it('opens the case study named in the URL hash', async () => {
    window.history.replaceState(null, '', '/#project-b')
    render(<ProjectGrid projects={projects} labels={labels} />)
    expect(await screen.findByRole('dialog')).toHaveTextContent('Beta body')
  })

  it('opens a case study from a link elsewhere on the page', async () => {
    render(
      <>
        <a href="#project-b">Beta</a>
        <ProjectGrid projects={projects} labels={labels} />
      </>,
    )
    await userEvent.click(screen.getByRole('link', { name: 'Beta' }))
    expect(await screen.findByRole('dialog')).toHaveTextContent('Beta body')
  })

  it('leaves links to unknown projects alone', async () => {
    render(
      <>
        <a href="#project-zeta">Zeta</a>
        <ProjectGrid projects={projects} labels={labels} />
      </>,
    )
    await userEvent.click(screen.getByRole('link', { name: 'Zeta' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

describe('scroll reveal', () => {
  it('never hides cards when the browser cannot observe them', () => {
    render(<ProjectGrid projects={projects} labels={labels} />)
    const states = [...document.querySelectorAll('.project-reveal')].map((card) =>
      card.getAttribute('data-reveal-state'),
    )
    expect(states).toEqual(['static', 'static'])
  })
})

describe('featured projects', () => {
  it('gives featured cards a wider slot', () => {
    render(<ProjectGrid projects={projects} labels={labels} />)
    const alpha = document.getElementById('project-a')
    const beta = document.getElementById('project-b')
    expect(alpha).toHaveAttribute('data-featured', 'true')
    expect(alpha?.className).toContain('md:col-span-2')
    expect(beta).not.toHaveAttribute('data-featured')
    expect(beta?.className).not.toContain('md:col-span-2')
  })
})

describe('initials', () => {
  it('takes up to two initials', () => {
    expect(initials('Pool Work Confort')).toBe('PW')
    expect(initials('Ticker')).toBe('T')
  })
})
