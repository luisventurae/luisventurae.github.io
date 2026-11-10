import { z } from 'zod'

import { LocaleSchema } from './locale'

export { ApiErrorSchema } from './errors'

export const CONTACT_MAX_BODY_BYTES = 4 * 1024

export const ContactRequestSchema = z.strictObject({
  email: z.email().max(254),
  company: z.string().trim().min(1).max(120),
  locale: LocaleSchema,
  captcha_token: z.string().min(1).max(2048),
})
export type ContactRequest = z.infer<typeof ContactRequestSchema>

export const ContactResponseSchema = z.object({
  download_url: z.url({ protocol: /^https?$/ }),
  expires_at: z.iso.datetime(),
})
export type ContactResponse = z.infer<typeof ContactResponseSchema>
