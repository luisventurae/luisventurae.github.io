import type { ApiError, ApiErrorCode } from '@portfolio/shared'
import type { Context } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

const STATUS_BY_CODE: Record<ApiErrorCode, ContentfulStatusCode> = {
  invalid_request: 400,
  captcha_failed: 403,
  invalid_token: 403,
  not_found: 404,
  payload_too_large: 413,
  rate_limited: 429,
  internal_error: 500,
}

export function errorResponse(c: Context, code: ApiErrorCode): Response {
  const body: ApiError = { error: { code } }
  return c.json(body, STATUS_BY_CODE[code])
}
