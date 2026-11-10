import {
  ApiErrorSchema,
  ContactResponseSchema,
  type ApiErrorCode,
  type ContactRequest,
  type ContactResponse,
} from '@portfolio/shared'

export type ClientErrorCode = ApiErrorCode | 'network'

export type ApiResult<T> = { ok: true; data: T } | { ok: false; code: ClientErrorCode }

/** Typed client for POST /contact. Never throws: every failure becomes an error code. */
export async function requestCv(
  api_url: string,
  body: ContactRequest,
  fetcher: typeof fetch = fetch,
): Promise<ApiResult<ContactResponse>> {
  let response: Response
  try {
    response = await fetcher(`${api_url.replace(/\/$/, '')}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    return { ok: false, code: 'network' }
  }

  const json: unknown = await response.json().catch(() => null)
  if (response.ok) {
    const parsed = ContactResponseSchema.safeParse(json)
    return parsed.success ? { ok: true, data: parsed.data } : { ok: false, code: 'internal_error' }
  }
  const error = ApiErrorSchema.safeParse(json)
  return { ok: false, code: error.success ? error.data.error.code : 'internal_error' }
}
