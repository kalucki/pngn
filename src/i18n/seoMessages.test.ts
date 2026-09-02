import { describe, expect, it } from 'vitest'
import {
  seoAr,
  seoEn,
  seoEs,
  seoPcm,
  seoPl,
  seoZh,
} from './seoMessages'

describe('seo messages', () => {
  it('keeps the same keys in every locale', () => {
    const keys = Object.keys(seoEn).sort()
    for (const catalog of [seoEs, seoPl, seoZh, seoPcm, seoAr]) {
      expect(Object.keys(catalog).sort()).toEqual(keys)
    }
  })
})
