import { z } from 'zod'

import { LocaleSchema } from './locale'
import { MAX_INTERESTS, VacancyRequirementIdSchema } from './vacancy'

export { ApiErrorSchema } from './errors'

export const CONTACT_MAX_BODY_BYTES = 4 * 1024

export const ContactRequestSchema = z.strictObject({
  email: z.email().max(254),
  company: z.string().trim().min(1).max(120),
  locale: LocaleSchema,
  captcha_token: z.string().min(1).max(2048),
  interests: z
    .array(VacancyRequirementIdSchema)
    .max(MAX_INTERESTS)
    .refine((ids) => new Set(ids).size === ids.length, 'Duplicated interests')
    .optional(),
})
export type ContactRequest = z.infer<typeof ContactRequestSchema>

/** The CV link travels only by email, so the response just confirms the send. */
export const ContactResponseSchema = z.strictObject({
  status: z.literal('sent'),
})
export type ContactResponse = z.infer<typeof ContactResponseSchema>
