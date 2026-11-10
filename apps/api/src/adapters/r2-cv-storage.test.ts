import { describe, expect, it } from 'vitest'

import { createR2CvStorage, cvObjectKey } from './r2-cv-storage'

describe('createR2CvStorage', () => {
  it('reads cv/<locale>.pdf', async () => {
    const keys: string[] = []
    const storage = createR2CvStorage({
      get: async (key) => {
        keys.push(key)
        return key === 'cv/en.pdf' ? { body: new Blob(['pdf']).stream(), size: 3 } : null
      },
    })
    expect(await storage.get('en')).toMatchObject({ size: 3 })
    expect(await storage.get('fr')).toBeNull()
    expect(keys).toEqual(['cv/en.pdf', 'cv/fr.pdf'])
    expect(cvObjectKey('es')).toBe('cv/es.pdf')
  })
})
