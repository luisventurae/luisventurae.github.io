import { describe, expect, it } from 'vitest'

import { es } from '../../i18n/es'
import { COMMAND_NAMES, runCommand, type TerminalContext } from './commands'

const context: TerminalContext = {
  locale: 'es',
  messages: es.terminal.messages,
  category_labels: es.stack.categories,
  tier_labels: es.stack.tiers,
  whoami: 'Soy Luis, Backend Engineer · Node.js.',
  projects: [
    {
      slug: 'ticker',
      title: 'Ticker',
      summary: 'Plataforma omnicanal',
      origin: 'En Securitec',
      period: 'jun 2023',
      techs: ['Vue.js', 'Redis'],
    },
  ],
  skills: [
    { label: 'Node.js', category: 'backend', tier: 'daily' },
    { label: 'Kafka', category: 'backend', tier: 'exploring' },
    { label: 'Vue.js', category: 'frontend', tier: 'production' },
  ],
}

const texts = (input: string): string[] => runCommand(input, context).lines.map((line) => line.text)

describe('runCommand', () => {
  it('lists every command in help', () => {
    const output = texts('help').join('\n')
    for (const name of COMMAND_NAMES) expect(output).toContain(name)
  })

  it('answers whoami', () => {
    expect(texts('whoami')).toEqual(['Soy Luis, Backend Engineer · Node.js.'])
  })

  it('lists projects and shows one with cat', () => {
    expect(texts('ls projects').join('\n')).toContain('ticker')
    expect(texts('cat ticker').join('\n')).toContain('En Securitec · jun 2023')
    expect(texts('cat nope')[0]).toContain('nope')
  })

  it('requires the projects argument for ls', () => {
    expect(texts('ls')[0]).toContain('ls projects')
  })

  it('filters skills by category', () => {
    expect(texts('skills frontend').join('\n')).toContain('Vue.js')
    expect(texts('skills frontend').join('\n')).not.toContain('Node.js')
    expect(texts('skills cosmos')[0]).toContain('backend, frontend, other')
  })

  it('groups skills by usage tier', () => {
    expect(texts('skills backend')).toEqual([
      'Backend',
      '  Uso diario: Node.js',
      '  Explorando: Kafka',
    ])
  })

  it('returns effects for side-effect commands', () => {
    expect(runCommand('clear', context).effect).toEqual({ type: 'clear' })
    expect(runCommand('lang fr', context).effect).toEqual({ type: 'lang', locale: 'fr' })
    expect(runCommand('theme dark', context).effect).toEqual({ type: 'theme', theme: 'dark' })
    expect(runCommand('theme', context).effect).toEqual({ type: 'theme', theme: undefined })
    expect(runCommand('contact', context).effect).toEqual({ type: 'scroll', target: 'contact' })
    expect(runCommand('search  redis ', context).effect).toEqual({ type: 'search', query: 'redis' })
  })

  it('validates arguments', () => {
    expect(texts('lang de')[0]).toContain('lang <es|en|fr>')
  })

  it('no longer knows the former ask command', () => {
    expect(texts('ask ¿Qué usas?')[0]).toContain('No conozco ese comando')
    expect(runCommand('ask ¿Qué usas?', context).effect).toBeUndefined()
    expect(COMMAND_NAMES).not.toContain('ask')
    expect(texts('help').join('\n')).not.toMatch(/\bask\b/)
  })

  it('handles unknown and empty commands', () => {
    expect(texts('sudo rm -rf')[0]).toBe('`sudo`? No conozco ese comando. Prueba `help`.')
    expect(runCommand('   ', context).lines).toEqual([])
  })
})
