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
  whoami: 'Soy Luis.',
  projects: [
    {
      slug: 'ticker',
      title: 'Ticker',
      summary: 'Plataforma omnicanal',
      company: 'Securitec',
      period: 'jun 2023',
      techs: ['Redis'],
    },
  ],
  skills: [{ label: 'Node.js', category: 'backend', level: 9 }],
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
  render(<Terminal api_url="http://api" input_label="Comando" context={context} />)
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
    expect(log()).toHaveTextContent('Securitec · jun 2023')
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

  it('falls back to text search when RAG is unavailable', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) =>
        url.endsWith('/rag/ask') ? new Response('', { status: 404 }) : Response.json(search_index),
      ),
    )
    const input = setup()
    await userEvent.type(input, 'ask ¿usas redis?{Enter}')
    expect(await screen.findByText(/solo corre en local/)).toBeInTheDocument()
    expect(await screen.findByText('▸ Ticker')).toBeInTheDocument()
  })

  it('streams answers with their sources', async () => {
    const body = [
      { type: 'token', text: 'Uso ' },
      { type: 'token', text: 'Redis.' },
      { type: 'sources', sources: [{ source: 'projects/ticker', title: 'Ticker', locale: 'es' }] },
      { type: 'done' },
    ]
      .map((event) => JSON.stringify(event))
      .join('\n')
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(body)),
    )
    const input = setup()
    await userEvent.type(input, 'ask ¿usas redis?{Enter}')
    expect(await screen.findByText('Uso Redis.')).toBeInTheDocument()
    expect(await screen.findByText('Fuentes: Ticker')).toBeInTheDocument()
  })

  it('focuses the prompt with the backtick shortcut', async () => {
    const input = setup()
    input.blur()
    await userEvent.keyboard('`')
    expect(input).toHaveFocus()
  })
})
