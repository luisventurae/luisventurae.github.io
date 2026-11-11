const REVEAL_SELECTOR = '[data-reveal]:not([data-inview])'
/** Start a little before the element is fully visible so the motion is caught, not missed. */
const ROOT_MARGIN = '0px 0px -10% 0px'

function reveal(element: Element): void {
  element.setAttribute('data-inview', '')
}

/**
 * Scroll reveal for server-rendered sections (openspec site-shell › Scroll reveal).
 * Each `[data-reveal]` gets `data-inview` once, the first time it enters the viewport; CSS
 * animates from there. Hidden states only apply under `html.js` (set inline in the head), so
 * the content stays readable without JavaScript. Never point it at React-managed nodes.
 */
export function observeReveals(root: ParentNode = document): () => void {
  document.documentElement.setAttribute('data-reveal-ready', '')
  const elements = [...root.querySelectorAll(REVEAL_SELECTOR)]

  if (typeof IntersectionObserver === 'undefined') {
    elements.forEach(reveal)
    return () => undefined
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        reveal(entry.target)
        observer.unobserve(entry.target)
      }
    },
    { rootMargin: ROOT_MARGIN, threshold: 0.1 },
  )
  elements.forEach((element) => observer.observe(element))
  return () => observer.disconnect()
}
