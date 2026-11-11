import type { Locale } from '@portfolio/shared'

import type { EmailMessageInput } from './ports'

const LINKEDIN_URL = 'https://www.linkedin.com/in/luisventurae'
const SITE_URL = 'https://luisventurae.github.io'

interface CvEmailCopy {
  subject: string
  build: (download_url: string, expires_on: string) => string[]
}

const COPY: Record<Locale, CvEmailCopy> = {
  es: {
    subject: 'Tu copia del CV de Luis Ventura E',
    build: (url, date) => [
      'Hola:',
      'Gracias por tu interés. Aquí tienes el CV de Luis Ventura E (Backend Engineer · Node.js):',
      url,
      `El enlace es personal y vence el ${date}.`,
      `Si quieres conversar, escríbeme por LinkedIn: ${LINKEDIN_URL}`,
      '— Luis',
      `Recibiste este correo porque alguien pidió el CV con esta dirección en ${SITE_URL}. Si no fuiste tú, ignóralo.`,
    ],
  },
  en: {
    subject: 'Your copy of Luis Ventura E’s CV',
    build: (url, date) => [
      'Hi,',
      'Thanks for your interest. Here is the CV of Luis Ventura E (Backend Engineer · Node.js):',
      url,
      `The link is personal and expires on ${date}.`,
      `If you would like to talk, reach me on LinkedIn: ${LINKEDIN_URL}`,
      '— Luis',
      `You got this email because someone requested the CV with this address on ${SITE_URL}. If it wasn’t you, ignore it.`,
    ],
  },
  fr: {
    subject: 'Votre copie du CV de Luis Ventura E',
    build: (url, date) => [
      'Bonjour,',
      'Merci de votre intérêt. Voici le CV de Luis Ventura E (Backend Engineer · Node.js) :',
      url,
      `Le lien est personnel et expire le ${date}.`,
      `Pour échanger, écrivez-moi sur LinkedIn : ${LINKEDIN_URL}`,
      '— Luis',
      `Vous recevez cet e-mail car quelqu’un a demandé le CV avec cette adresse sur ${SITE_URL}. Si ce n’est pas vous, ignorez-le.`,
    ],
  },
}

/**
 * Localized plain-text email with the signed CV link. Built only from trusted values
 * (locale, our own URL and date) so it can never relay requester-supplied text.
 */
export function buildCvEmail(
  locale: Locale,
  download_url: string,
  expires_at: Date,
): EmailMessageInput {
  const copy = COPY[locale]
  const expires_on = new Intl.DateTimeFormat(locale, {
    dateStyle: 'long',
    timeZone: 'America/Lima',
  }).format(expires_at)
  return { subject: copy.subject, text: copy.build(download_url, expires_on).join('\n\n') }
}
