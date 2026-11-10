import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'

import { selection_store } from '../../lib/selection-store'
import { chipSize, StackMap, type StackMapProps } from './StackMap'

const props: StackMapProps = {
  skills: [
    { id: 'nodejs', label: 'Node.js', category: 'backend', tier: 'daily', project_count: 2 },
    { id: 'vue', label: 'Vue.js', category: 'frontend', tier: 'production', project_count: 1 },
    { id: 'kafka', label: 'Kafka', category: 'backend', tier: 'exploring', project_count: 0 },
  ],
  labels: {
    all: 'Todo',
    categories: { backend: 'Backend', frontend: 'Frontend', other: 'Otros' },
    tiers: { daily: 'Uso diario', production: 'En producción', exploring: 'Explorando' },
    tiers_legend: 'Nivel de uso',
    no_projects: 'Ningún proyecto la usa.',
    used_in: ['Usada en 1 proyecto', 'Usada en {count} proyectos'],
    clear: 'Quitar selección',
    see_projects: 'Ver proyectos',
  },
}

describe('StackMap', () => {
  afterEach(() => act(() => selection_store.clear()))

  it('filters by category', async () => {
    render(<StackMap {...props} />)
    await userEvent.click(screen.getByRole('button', { name: 'Frontend' }))
    expect(await screen.findByRole('button', { name: /Vue\.js/ })).toBeInTheDocument()
    await expect.poll(() => screen.queryByRole('button', { name: /Node\.js/ })).toBeNull()
  })

  it('selects a technology and summarizes its projects', async () => {
    render(<StackMap {...props} />)
    const chip = screen.getByRole('button', { name: /Node\.js/ })
    await userEvent.click(chip)
    expect(chip).toHaveAttribute('aria-pressed', 'true')
    expect(selection_store.getSnapshot().selected).toBe('nodejs')
    expect(screen.getByText(/Usada en 2 proyectos/)).toBeInTheDocument()
  })

  it('explains when no project uses the technology', async () => {
    render(<StackMap {...props} />)
    await userEvent.click(screen.getByRole('button', { name: /Kafka/ }))
    expect(screen.getByText(/Ningún proyecto la usa/)).toBeInTheDocument()
  })

  it('toggles with the keyboard and clears the selection', async () => {
    render(<StackMap {...props} />)
    const chip = screen.getByRole('button', { name: /Vue\.js/ })
    chip.focus()
    await userEvent.keyboard('{Enter}')
    expect(selection_store.getSnapshot().selected).toBe('vue')
    const summary = screen.getByText(/Usada en 1 proyecto/).closest('p')
    if (!summary) throw new Error('summary not found')
    await userEvent.click(within(summary).getByRole('button', { name: 'Quitar selección' }))
    expect(selection_store.getSnapshot().selected).toBeNull()
  })

  it('weights chips by proficiency', () => {
    expect(chipSize('daily')).toContain('text-xl')
    expect(chipSize('production')).toContain('text-base')
    expect(chipSize('exploring')).toContain('text-small')
  })

  it('shows a legend for the three usage tiers and no numeric rating', () => {
    render(<StackMap {...props} />)
    const legend = screen.getByRole('list', { name: 'Nivel de uso' })
    expect(
      within(legend)
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual(['AaUso diario', 'AaEn producción', 'AaExplorando'])
    expect(screen.queryByText(/\/10/)).not.toBeInTheDocument()
  })
})
