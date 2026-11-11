/** Lens radius in CSS px: about two lines of body text above and below the pointer. */
export const LENS_RADIUS = 64
/** Scale at the centre of the lens: a slight magnification, never a jump. */
export const LENS_MAX_SCALE = 1.25
/** Share of the remaining distance the lens covers per 60 Hz frame (soft follow, no lag). */
const FOLLOW = 0.35
/** Share of the remaining strength gained per frame on enter, and lost on leave (faster). */
const FADE_IN = 0.2
const FADE_OUT = 0.32
/** Below this the lens counts as at rest. */
const SETTLED = 0.002
/** Smallest scale change worth a style write. */
const PAINT_STEP = 0.0005

const DESKTOP_QUERY = '(hover: hover) and (pointer: fine)'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const INTERACTIVE_SELECTOR = 'a, button, input, select, textarea, [tabindex]'

/**
 * Scale of a letter `distance` px from the lens centre: smoothstep falloff to 1 at the edge,
 * weighted by the lens `strength` (0 → hidden, 1 → full) so it fades in and out.
 */
export function lensScale(distance: number, strength = 1): number {
  if (distance >= LENS_RADIUS || strength <= 0) return 1
  const t = 1 - distance / LENS_RADIUS
  return 1 + (LENS_MAX_SCALE - 1) * t * t * (3 - 2 * t) * strength
}

/**
 * Wraps every visible character of `root` in an inline-block span so it can scale, keeping
 * words unbreakable and the markup intact. The split copy is hidden from assistive tech and
 * an intact twin is placed before it, so screen readers never spell the text letter by letter.
 */
export function splitForLens(root: HTMLElement): HTMLElement[] {
  const twin = document.createElement('div')
  twin.className = 'sr-only'
  twin.innerHTML = root.innerHTML
  root.before(twin)
  root.setAttribute('aria-hidden', 'true')

  const text_nodes: Text[] = []
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) text_nodes.push(walker.currentNode as Text)

  const chars: HTMLElement[] = []
  for (const node of text_nodes) {
    if (!node.data.trim()) continue
    const fragment = document.createDocumentFragment()
    for (const part of node.data.split(/(\s+)/)) {
      if (!part) continue
      if (!part.trim()) {
        fragment.append(part)
        continue
      }
      const word = document.createElement('span')
      word.className = 'lens-word'
      for (const glyph of Array.from(part)) {
        const char = document.createElement('span')
        char.className = 'lens-char'
        char.textContent = glyph
        word.append(char)
        chars.push(char)
      }
      fragment.append(word)
    }
    node.replaceWith(fragment)
  }
  return chars
}

interface MagnifierOptions {
  /** Runs the split off the critical path; defaults to the browser's idle time. */
  schedule?: (task: () => void) => void
}

function whenIdle(task: () => void): void {
  if ('requestIdleCallback' in window) window.requestIdleCallback(task, { timeout: 2000 })
  else setTimeout(task, 200)
}

/**
 * Magnifying lens over a block of text (desktop only): every letter inside an invisible
 * circle around the pointer grows slightly, more the closer it is to the centre. Touch
 * screens, reduced motion and blocks with interactive content are left untouched.
 */
export function enableMagnifier(root: HTMLElement, options: MagnifierOptions = {}): () => void {
  const supported =
    window.matchMedia(DESKTOP_QUERY).matches &&
    !window.matchMedia(REDUCED_MOTION_QUERY).matches &&
    root.querySelector(INTERACTIVE_SELECTOR) === null
  if (!supported) return () => undefined

  let chars: HTMLElement[] = []
  let centers_x = new Float32Array(0)
  let centers_y = new Float32Array(0)
  let scales = new Float32Array(0)
  const pointer = { client_x: 0, client_y: 0, inside: false }
  const lens = { x: 0, y: 0, target_x: 0, target_y: 0, strength: 0 }
  let frame = 0
  let last_time = 0

  const measure = (): void => {
    const origin = root.getBoundingClientRect()
    chars.forEach((char, index) => {
      const rect = char.getBoundingClientRect()
      centers_x[index] = rect.left + rect.width / 2 - origin.left
      centers_y[index] = rect.top + rect.height / 2 - origin.top
    })
  }

  const aim = (): void => {
    const origin = root.getBoundingClientRect()
    lens.target_x = pointer.client_x - origin.left
    lens.target_y = pointer.client_y - origin.top
  }

  const paint = (): void => {
    for (let index = 0; index < chars.length; index++) {
      const dx = (centers_x[index] ?? 0) - lens.x
      const dy = (centers_y[index] ?? 0) - lens.y
      const near = Math.abs(dx) < LENS_RADIUS && Math.abs(dy) < LENS_RADIUS
      const scale = near ? lensScale(Math.hypot(dx, dy), lens.strength) : 1
      const previous = scales[index] ?? 1
      // Tiny steps are skipped, but returning to rest always clears the style.
      if (scale === previous || (scale !== 1 && Math.abs(scale - previous) < PAINT_STEP)) continue
      scales[index] = scale
      const char = chars[index]
      if (char) char.style.scale = scale === 1 ? '' : scale.toFixed(3)
    }
  }

  const tick = (time: number): void => {
    // Frame-rate independent easing: the same feel at 60 Hz and 120 Hz.
    const frames = last_time ? Math.min((time - last_time) / (1000 / 60), 4) : 1
    last_time = time
    const follow = 1 - Math.pow(1 - FOLLOW, frames)
    const fade = 1 - Math.pow(1 - (pointer.inside ? FADE_IN : FADE_OUT), frames)
    lens.x += (lens.target_x - lens.x) * follow
    lens.y += (lens.target_y - lens.y) * follow
    lens.strength += ((pointer.inside ? 1 : 0) - lens.strength) * fade
    paint()

    const still =
      Math.abs(lens.target_x - lens.x) < 0.5 &&
      Math.abs(lens.target_y - lens.y) < 0.5 &&
      Math.abs((pointer.inside ? 1 : 0) - lens.strength) < SETTLED
    if (still) {
      if (!pointer.inside) {
        lens.strength = 0
        paint()
      }
      frame = 0
      last_time = 0
      return
    }
    frame = requestAnimationFrame(tick)
  }

  const run = (): void => {
    if (!frame) frame = requestAnimationFrame(tick)
  }

  const handleEnter = (event: PointerEvent): void => {
    if (event.pointerType !== 'mouse') return
    // Letters may have moved since the last visit (fonts, resize); scale keeps centres put.
    measure()
    pointer.client_x = event.clientX
    pointer.client_y = event.clientY
    pointer.inside = true
    aim()
    // Appear where the pointer is instead of sliding in from the last exit point.
    if (lens.strength < SETTLED) {
      lens.x = lens.target_x
      lens.y = lens.target_y
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    run()
  }

  const handleMove = (event: PointerEvent): void => {
    if (event.pointerType !== 'mouse' || !pointer.inside) return
    pointer.client_x = event.clientX
    pointer.client_y = event.clientY
    aim()
    run()
  }

  // Scrolling with the wheel moves the text under a still pointer.
  const handleScroll = (): void => {
    aim()
    run()
  }

  const handleLeave = (): void => {
    pointer.inside = false
    window.removeEventListener('scroll', handleScroll)
    run()
  }

  const schedule = options.schedule ?? whenIdle
  let detached = false
  schedule(() => {
    if (detached) return
    chars = splitForLens(root)
    centers_x = new Float32Array(chars.length)
    centers_y = new Float32Array(chars.length)
    scales = new Float32Array(chars.length).fill(1)
    root.setAttribute('data-lens', '')
    root.addEventListener('pointerenter', handleEnter)
    root.addEventListener('pointermove', handleMove)
    root.addEventListener('pointerleave', handleLeave)
  })

  return () => {
    detached = true
    cancelAnimationFrame(frame)
    root.removeEventListener('pointerenter', handleEnter)
    root.removeEventListener('pointermove', handleMove)
    root.removeEventListener('pointerleave', handleLeave)
    window.removeEventListener('scroll', handleScroll)
  }
}
