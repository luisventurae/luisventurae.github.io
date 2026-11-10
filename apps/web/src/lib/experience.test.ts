// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { careerYears, interpolateYears, yearsOfExperience } from './experience'

describe('yearsOfExperience', () => {
  it('counts complete years since the start month', () => {
    expect(yearsOfExperience('2019-01', new Date('2026-11-10T12:00:00Z'))).toBe(7)
  })

  it('adds a year when the start month comes around again', () => {
    expect(yearsOfExperience('2019-01', new Date('2027-01-01T00:00:00Z'))).toBe(8)
  })

  it('does not count an incomplete year', () => {
    expect(yearsOfExperience('2019-06', new Date('2026-05-31T23:59:59Z'))).toBe(6)
    expect(yearsOfExperience('2019-06', new Date('2026-06-01T00:00:00Z'))).toBe(7)
  })

  it('never returns a negative value', () => {
    expect(yearsOfExperience('2030-01', new Date('2026-11-10T00:00:00Z'))).toBe(0)
  })

  it('rejects malformed start values', () => {
    expect(() => yearsOfExperience('2019', new Date())).toThrow()
  })
})

describe('careerYears', () => {
  it('derives the value from the 2019-01 career start', () => {
    expect(careerYears(new Date('2026-11-10T12:00:00Z'))).toBe(7)
  })
})

describe('interpolateYears', () => {
  it('replaces every {years} token', () => {
    expect(interpolateYears('{years} años; más de {years}', 7)).toBe('7 años; más de 7')
  })

  it('leaves text without tokens untouched', () => {
    expect(interpolateYears('Hola', 7)).toBe('Hola')
  })
})
