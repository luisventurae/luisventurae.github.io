import { afterEach, describe, expect, it, vi } from 'vitest'

import { enableMagnifier, LENS_MAX_SCALE, LENS_RADIUS, lensScale, splitForLens } from './magnifier'

function mountText(html: string): HTMLElement {
  const root = document.createElement('div')
  root.innerHTML = html
  document.body.append(root)
  return root
}

function stubMedia(matches: Record<string, boolean>): void {
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: matches[query] ?? false }))
}

afterEach(() => {
  document.body.innerHTML = ''
  vi.unstubAllGlobals()
})

describe('lensScale', () => {
  it('peaks at the centre of the lens', () => {
    expect(lensScale(0)).toBe(LENS_MAX_SCALE)
  })

  it('leaves letters at and beyond the edge untouched', () => {
    expect(lensScale(LENS_RADIUS)).toBe(1)
    expect(lensScale(LENS_RADIUS * 2)).toBe(1)
  })

  it('falls off smoothly with distance', () => {
    const near = lensScale(LENS_RADIUS * 0.25)
    const far = lensScale(LENS_RADIUS * 0.75)
    expect(near).toBeGreaterThan(far)
    expect(far).toBeGreaterThan(1)
    expect(near).toBeLessThan(LENS_MAX_SCALE)
  })

  it('scales with the lens strength so it can fade in and out', () => {
    expect(lensScale(0, 0)).toBe(1)
    expect(lensScale(0, 0.5)).toBeCloseTo(1 + (LENS_MAX_SCALE - 1) / 2)
  })
})

describe('splitForLens', () => {
  it('wraps every visible character and keeps words, spaces and markup', () => {
    const root = mountText('<p>Soy <mark>7 años</mark></p><h3>Idiomas</h3>')
    const chars = splitForLens(root)
    expect(chars.map((char) => char.textContent).join('')).toBe('Soy7añosIdiomas')
    expect(root.querySelector('mark')?.querySelectorAll('.lens-char')).toHaveLength(5)
    expect(root.querySelector('p')?.textContent).toBe('Soy 7 años')
    expect(root.querySelectorAll('.lens-word')).toHaveLength(4)
  })

  it('hides the split copy from assistive tech and keeps an intact one for it', () => {
    const root = mountText('<p>Soy <mark>Luis</mark></p><h3>Idiomas</h3>')
    splitForLens(root)
    expect(root).toHaveAttribute('aria-hidden', 'true')
    const twin = root.previousElementSibling
    expect(twin).toHaveClass('sr-only')
    expect(twin?.innerHTML).toBe('<p>Soy <mark>Luis</mark></p><h3>Idiomas</h3>')
  })
})

describe('enableMagnifier', () => {
  it('splits the text on a desktop pointer', () => {
    stubMedia({ '(hover: hover) and (pointer: fine)': true })
    const root = mountText('<p>Hola</p>')
    enableMagnifier(root, { schedule: (task) => task() })
    expect(root.querySelectorAll('.lens-char')).toHaveLength(4)
  })

  it('does nothing on touch screens', () => {
    stubMedia({ '(hover: hover) and (pointer: fine)': false })
    const root = mountText('<p>Hola</p>')
    enableMagnifier(root, { schedule: (task) => task() })
    expect(root.querySelector('.lens-char')).toBeNull()
  })

  it('does nothing with reduced motion', () => {
    stubMedia({
      '(hover: hover) and (pointer: fine)': true,
      '(prefers-reduced-motion: reduce)': true,
    })
    const root = mountText('<p>Hola</p>')
    enableMagnifier(root, { schedule: (task) => task() })
    expect(root.querySelector('.lens-char')).toBeNull()
  })

  it('never hides interactive content from assistive tech', () => {
    stubMedia({ '(hover: hover) and (pointer: fine)': true })
    const root = mountText('<p>Ver <a href="#x">enlace</a></p>')
    enableMagnifier(root, { schedule: (task) => task() })
    expect(root.querySelector('.lens-char')).toBeNull()
    expect(root).not.toHaveAttribute('aria-hidden')
  })
})
