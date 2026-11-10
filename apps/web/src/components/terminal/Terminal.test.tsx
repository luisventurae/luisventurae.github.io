import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { mockMatchMedia } from '../../../vitest.setup'
import { es } from '../../i18n/es'
import type { TerminalContext } from '../../lib/terminal/commands'
import { Terminal } from './Terminal'

const context: TerminalContext = {
  locale: 'es',
  messages: es.terminal.messages,
  category_labels: es.stack.categories,
  tier_labels: es.stack.tiers,
  whoami: 'Soy Luis.',
  projects: [
    {
      slug: 'ticker',
      title: 'Ticker',
      summary: 'Plataforma omnicanal',
      origin: 'En Securitec',
      period: 'jun 2023',
      techs: ['Redis'],
    },
  ],
  skills: [{ label: 'Node.js', category: 'backend', tier: 'daily' }],
}

const search_index = [
  {
    id: 'es:projects/ticker:0',
    text: 'Ticker\nWebSockets con Redis',
    locale: 'es',
    source: 'projects/ticker',
    title: 'Ticker',
  },
]

function setup() {
  render(<Terminal input_label="Comando" context={context} />)
  return screen.getByLabelText('Comando')
}

const log = (): HTMLElement => screen.getByRole('log')

describe('Terminal', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    mockMatchMedia()
    sessionStorage.clear()
  })

  it('greets and runs commands', async () => {
    const input = setup()
    expect(log()).toHaveTextContent('Bienvenido')
    await userEvent.type(input, 'whoami{Enter}')
    expect(log()).toHaveTextContent('Soy Luis.')
    await userEvent.type(input, 'cat ticker{Enter}')
    expect(log()).toHaveTextContent('En Securitec · jun 2023')
  })

  it('recalls history with the arrow keys and clears the log', async () => {
    const input = setup()
    await userEvent.type(input, 'whoami{Enter}')
    await userEvent.type(input, '{ArrowUp}')
    expect(input).toHaveValue('whoami')
    await userEvent.clear(input)
    await userEvent.type(input, 'clear{Enter}')
    expect(log()).toBeEmptyDOMElement()
  })

  it('completes commands and slugs with Tab', async () => {
    const input = setup()
    await userEvent.type(input, 'who{Tab}')
    expect(input).toHaveValue('whoami ')
    await userEvent.clear(input)
    await userEvent.type(input, 'cat ti{Tab}')
    expect(input).toHaveValue('cat ticker')
  })

  it('searches the prebuilt index', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Response.json(search_index)),
    )
    const input = setup()
    await userEvent.type(input, 'search redis{Enter}')
    expect(await screen.findByText('▸ Ticker')).toBeInTheDocument()
  })

  it('answers that ask is an unknown command', async () => {
    const input = setup()
    await userEvent.type(input, 'ask ¿usas redis?{Enter}')
    expect(await screen.findByText(/No conozco ese comando/)).toBeInTheDocument()
  })

  it('focuses the prompt with the backtick shortcut', async () => {
    const input = setup()
    input.blur()
    await userEvent.keyboard('`')
    expect(input).toHaveFocus()
  })
})
