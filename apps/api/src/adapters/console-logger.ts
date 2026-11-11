import type { Logger } from '../core/ports'

/** Structured JSON logs. Callers must never pass secrets or personal data. */
export function createConsoleLogger(): Logger {
  const write =
    (level: 'info' | 'warn' | 'error') =>
    (event: string, data?: Record<string, unknown>): void => {
      console[level](JSON.stringify({ level, event, ...data }))
    }
  return { info: write('info'), warn: write('warn'), error: write('error') }
}
