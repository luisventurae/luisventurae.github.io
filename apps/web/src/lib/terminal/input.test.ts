import { describe, expect, it } from 'vitest'

import { completeInput, navigateHistory, parseCommand } from './input'

describe('parseCommand', () => {
  it('splits name and arguments, lowercasing the name', () => {
    expect(parseCommand('  LS   projects ')).toEqual({
      name: 'ls',
      args: ['projects'],
      rest: 'projects',
    })
  })

  it('keeps the raw rest of the line for free-text commands', () => {
    expect(parseCommand('search ¿Qué   bases usas?')).toEqual({
      name: 'search',
      args: ['¿Qué', 'bases', 'usas?'],
      rest: '¿Qué   bases usas?',
    })
  })

  it('returns an empty name for blank input', () => {
    expect(parseCommand('   ')).toEqual({ name: '', args: [], rest: '' })
  })
})

describe('completeInput', () => {
  const options = {
    commands: ['help', 'ls', 'lang', 'cat'],
    slugs: ['ticker', 'pwc-store', 'pwc-mailer'],
  }

  it('completes a unique command prefix', () => {
    expect(completeInput('he', options)).toEqual({ value: 'help ', candidates: ['help'] })
  })

  it('extends to the common prefix and lists candidates', () => {
    expect(completeInput('l', options)).toEqual({ value: 'l', candidates: ['ls', 'lang'] })
  })

  it('completes project slugs after cat', () => {
    expect(completeInput('cat ti', options)).toEqual({
      value: 'cat ticker',
      candidates: ['ticker'],
    })
    expect(completeInput('cat pwc', options)).toEqual({
      value: 'cat pwc-',
      candidates: ['pwc-store', 'pwc-mailer'],
    })
  })

  it('completes fixed arguments', () => {
    expect(completeInput('ls p', options).value).toBe('ls projects')
    expect(completeInput('theme d', options).value).toBe('theme dark')
    expect(completeInput('lang f', options).value).toBe('lang fr')
  })

  it('leaves unknown input untouched', () => {
    expect(completeInput('zz', options)).toEqual({ value: 'zz', candidates: [] })
  })
})

describe('navigateHistory', () => {
  const history = ['help', 'ls projects', 'whoami']

  it('walks back from the newest entry and stops at the oldest', () => {
    expect(navigateHistory(history, null, 'up')).toEqual({ cursor: 2, value: 'whoami' })
    expect(navigateHistory(history, 2, 'up')).toEqual({ cursor: 1, value: 'ls projects' })
    expect(navigateHistory(history, 0, 'up')).toEqual({ cursor: 0, value: 'help' })
  })

  it('walks forward and returns to an empty prompt', () => {
    expect(navigateHistory(history, 1, 'down')).toEqual({ cursor: 2, value: 'whoami' })
    expect(navigateHistory(history, 2, 'down')).toEqual({ cursor: null, value: '' })
  })

  it('does nothing with an empty history', () => {
    expect(navigateHistory([], null, 'up')).toEqual({ cursor: null, value: '' })
  })
})
