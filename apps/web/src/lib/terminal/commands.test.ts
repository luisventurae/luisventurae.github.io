import { describe, expect, it } from 'vitest'

import { es } from '../../i18n/es'
import { COMMAND_NAMES, runCommand, type TerminalContext } from './commands'

const context: TerminalContext = {
  locale: 'es',
  messages: es.terminal.messages,
  category_labels: es.stack.categories,
  whoami: 'Soy Luis, Full Stack Web Engineer.',
  projects: [
    {
      slug: 'ticker',
      title: 'Ticker',
      summary: 'Plataforma omnicanal',
      company: 'Securitec',
      period: 'jun 2023',
      techs: ['Vue.js', 'Redis'],
    },
  ],
  skills: [
    { label: 'Node.js', category: 'backend', level: 9 },
    { label: 'Vue.js', category: 'frontend', level: 6 },
  ],
}

const texts = (input: string): string[] => runCommand(input, context).lines.map((line) => line.text)

describe('runCommand', () => {
  it('lists every command in help', () => {
    const output = texts('help').join('\n')
    for (const name of COMMAND_NAMES) expect(output).toContain(name)
  })

  it('answers whoami', () => {
    expect(texts('whoami')).toEqual(['Soy Luis, Full Stack Web Engineer.'])
  })

  it('lists projects and shows one with cat', () => {
    expect(texts('ls projects').join('\n')).toContain('ticker')
    expect(texts('cat ticker').join('\n')).toContain('Securitec · jun 2023')
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

  it('returns effects for side-effect commands', () => {
    expect(runCommand('clear', context).effect).toEqual({ type: 'clear' })
    expect(runCommand('lang fr', context).effect).toEqual({ type: 'lang', locale: 'fr' })
    expect(runCommand('theme dark', context).effect).toEqual({ type: 'theme', theme: 'dark' })
    expect(runCommand('theme', context).effect).toEqual({ type: 'theme', theme: undefined })
    expect(runCommand('contact', context).effect).toEqual({ type: 'scroll', target: 'contact' })
    expect(runCommand('search  redis ', context).effect).toEqual({ type: 'search', query: 'redis' })
    expect(runCommand('ask ¿Qué usas?', context).effect).toEqual({
      type: 'ask',
      question: '¿Qué usas?',
    })
  })

  it('validates arguments', () => {
    expect(texts('lang de')[0]).toContain('lang <es|en|fr>')
    expect(texts('ask')[0]).toContain('ask')
    expect(runCommand('ask', context).effect).toBeUndefined()
  })

  it('handles unknown and empty commands', () => {
    expect(texts('sudo rm -rf')[0]).toBe('`sudo`? No conozco ese comando. Prueba `help`.')
    expect(runCommand('   ', context).lines).toEqual([])
  })
})
