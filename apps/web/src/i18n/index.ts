import type { Locale } from '@portfolio/shared'

import { en } from './en'
import { es, type UiStrings } from './es'
import { fr } from './fr'

const UI: Record<Locale, UiStrings> = { es, en, fr }

export function getUi(locale: Locale): UiStrings {
  return UI[locale]
}

export const LOCALE_LABELS: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
  fr: 'Français',
}
export const OG_LOCALES: Record<Locale, string> = { es: 'es_ES', en: 'en_US', fr: 'fr_FR' }
export const HTML_LANGS: Record<Locale, string> = { es: 'es', en: 'en', fr: 'fr' }

export type { UiStrings }
