import { z } from 'zod'

export const LOCALES = ['es', 'en', 'fr'] as const
export const DEFAULT_LOCALE = 'es'

export const LocaleSchema = z.enum(LOCALES)
export type Locale = z.infer<typeof LocaleSchema>

export function isLocale(value: unknown): value is Locale {
  return LocaleSchema.safeParse(value).success
}
