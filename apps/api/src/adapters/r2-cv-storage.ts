import type { Locale } from '@portfolio/shared'

import type { CvFile, CvStorage } from '../core/ports'

export interface R2Like {
  get(key: string): Promise<{ body: ReadableStream; size: number } | null>
}

export function cvObjectKey(locale: Locale): string {
  return `cv/${locale}.pdf`
}

/** CV PDFs stored in a private R2 bucket under `cv/<locale>.pdf`. */
export function createR2CvStorage(bucket: R2Like): CvStorage {
  return {
    async get(locale: Locale): Promise<CvFile | null> {
      const object = await bucket.get(cvObjectKey(locale))
      return object ? { body: object.body, size: object.size } : null
    },
  }
}
