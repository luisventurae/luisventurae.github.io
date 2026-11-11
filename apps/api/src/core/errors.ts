import type { ApiErrorCode } from '@portfolio/shared'

/** Expected failure of a use case. HTTP adapters map `code` to a status. */
export class DomainError extends Error {
  readonly code: ApiErrorCode

  constructor(code: ApiErrorCode) {
    super(code)
    this.name = 'DomainError'
    this.code = code
  }
}
