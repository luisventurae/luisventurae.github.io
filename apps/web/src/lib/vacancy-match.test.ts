// @vitest-environment node
import { VACANCY_REQUIREMENT_IDS } from '@portfolio/shared'
import { describe, expect, it } from 'vitest'

import { VACANCY_REQUIREMENTS } from '../data/vacancy-match'
import { en } from '../i18n/en'
import { es } from '../i18n/es'
import { fr } from '../i18n/fr'
import { matchScore } from './vacancy-match'

describe('matchScore', () => {
  it('averages the strength of the selected requirements', () => {
    expect(matchScore(['nodejs', 'java'])).toBe(75)
    expect(matchScore(['nodejs', 'aws'])).toBe(100)
    expect(matchScore(['on-site'])).toBe(0)
  })

  it('rounds to a whole percentage', () => {
    expect(matchScore(['nodejs', 'java', 'kubernetes'])).toBe(50)
    expect(matchScore(['nodejs', 'aws', 'java'])).toBe(83)
  })

  it('returns null when nothing is selected', () => {
    expect(matchScore([])).toBeNull()
  })
})

describe('vacancy requirements data', () => {
  it('covers every shared requirement id exactly once', () => {
    expect(VACANCY_REQUIREMENTS.map((item) => item.id).sort()).toEqual(
      [...VACANCY_REQUIREMENT_IDS].sort(),
    )
  })

  it('offers the AI and leadership requirements as fully met', () => {
    const strengths = new Map(VACANCY_REQUIREMENTS.map((item) => [item.id, item.strength]))
    expect(strengths.get('ai-llm')).toBe(1)
    expect(strengths.get('leadership')).toBe(1)
  })

  it('has a label and evidence for every requirement in every locale', () => {
    for (const ui of [es, en, fr]) {
      for (const id of VACANCY_REQUIREMENT_IDS) {
        expect(ui.cv_match.requirements[id].label, id).not.toBe('')
        expect(ui.cv_match.requirements[id].proof, id).not.toBe('')
      }
    }
  })
})
