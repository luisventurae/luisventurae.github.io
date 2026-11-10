import { DEFAULT_LOCALE, isLocale, LOCALES, type Locale } from '@portfolio/shared'

export interface AlternateLink {
  hreflang: Locale | 'x-default'
  href: string
}

export function localePath(locale: Locale, section?: string): string {
  const base = locale === DEFAULT_LOCALE ? '/' : `/${locale}/`
  return section ? `${base}#${section}` : base
}

export function getLocaleFromPath(path: string): Locale {
  const segment = path.split('/')[1] ?? ''
  return isLocale(segment) ? segment : DEFAULT_LOCALE
}

export function alternateLinks(site_url: string): AlternateLink[] {
  const origin = site_url.replace(/\/$/, '')
  const links: AlternateLink[] = LOCALES.map((locale) => ({
    hreflang: locale,
    href: `${origin}${localePath(locale)}`,
  }))
  return [...links, { hreflang: 'x-default', href: `${origin}${localePath(DEFAULT_LOCALE)}` }]
}
