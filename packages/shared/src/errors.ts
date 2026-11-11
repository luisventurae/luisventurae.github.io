import { z } from 'zod'

export const API_ERROR_CODES = [
  'invalid_request',
  'captcha_failed',
  'rate_limited',
  'payload_too_large',
  'invalid_token',
  'not_found',
  'email_failed',
  'internal_error',
] as const

export const ApiErrorCodeSchema = z.enum(API_ERROR_CODES)
export type ApiErrorCode = z.infer<typeof ApiErrorCodeSchema>

export const ApiErrorSchema = z.object({
  error: z.object({ code: ApiErrorCodeSchema }),
})
export type ApiError = z.infer<typeof ApiErrorSchema>
