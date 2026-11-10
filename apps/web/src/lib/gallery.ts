/** How a screenshot is framed in the gallery: a browser-width shot or a phone screen. */
export type MediaFrame = 'desktop' | 'mobile'

/** Portrait screenshots are phone captures; everything else is shown full width. */
export function mediaFrame(width: number, height: number): MediaFrame {
  return height > width ? 'mobile' : 'desktop'
}

/** Slide currently in view of a full-width scroll-snap track. */
export function slideIndexFromScroll(
  scroll_left: number,
  slide_width: number,
  count: number,
): number {
  if (slide_width <= 0 || count <= 0) return 0
  const index = Math.round(scroll_left / slide_width)
  return Math.min(count - 1, Math.max(0, index))
}

/** Replaces `{token}` placeholders in localized copy; unknown tokens are left as they are. */
export function fillTemplate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  )
}
