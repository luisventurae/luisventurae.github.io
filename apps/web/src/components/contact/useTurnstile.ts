import { useEffect, useRef, useState } from 'react'

interface TurnstileApi {
  render(container: HTMLElement, options: Record<string, unknown>): string
  reset(widget_id: string): void
  remove(widget_id: string): void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
let script_promise: Promise<void> | null = null

function loadScript(): Promise<void> {
  script_promise ??= new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SCRIPT_URL
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('turnstile_load_failed'))
    document.head.append(script)
  })
  return script_promise
}

export interface TurnstileState {
  /** Callback ref for the element that hosts the widget. */
  setContainer: (element: HTMLDivElement | null) => void
  token: string | null
  reset: () => void
}

/** Renders Cloudflare Turnstile lazily (only when the form mounts) and exposes its token. */
export function useTurnstile(site_key: string, theme: 'light' | 'dark' | 'auto'): TurnstileState {
  const [container, setContainer] = useState<HTMLDivElement | null>(null)
  const widget_ref = useRef<string | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    let is_cancelled = false
    void loadScript()
      .then(() => {
        if (is_cancelled || !container || !window.turnstile) return
        widget_ref.current = window.turnstile.render(container, {
          sitekey: site_key,
          theme,
          callback: (value: string) => setToken(value),
          'expired-callback': () => setToken(null),
          'error-callback': () => setToken(null),
        })
      })
      .catch(() => setToken(null))
    return () => {
      is_cancelled = true
      if (widget_ref.current) window.turnstile?.remove(widget_ref.current)
    }
  }, [container, site_key, theme])

  const reset = (): void => {
    setToken(null)
    if (widget_ref.current) window.turnstile?.reset(widget_ref.current)
  }

  return { setContainer, token, reset }
}
