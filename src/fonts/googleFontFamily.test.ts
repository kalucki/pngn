import { describe, expect, it } from 'vitest'
import { resolveGoogleFontFamily } from './googleFontFamily'

describe('resolveGoogleFontFamily', () => {
  it('maps compact and split names to hosted Google Fonts families', () => {
    expect(resolveGoogleFontFamily('ABeeZee')?.family).toBe('ABeeZee')
    expect(resolveGoogleFontFamily('A Bee Zee')?.family).toBe('ABeeZee')
    expect(resolveGoogleFontFamily('Shippori Mincho B1')?.family).toBe(
      'Shippori Mincho B1',
    )
    expect(resolveGoogleFontFamily('Shippori Mincho B 1')?.family).toBe(
      'Shippori Mincho B1',
    )
    expect(resolveGoogleFontFamily('IM Fe D Psc 28 P')?.family).toBe(
      'IM Fell DW Pica SC',
    )
    expect(resolveGoogleFontFamily('IM Fe F Csc 28 P')?.family).toBe(
      'IM Fell French Canon SC',
    )
  })

  it('ignores families that Google Fonts does not host', () => {
    expect(resolveGoogleFontFamily('New Candidate Font')).toBeNull()
    expect(resolveGoogleFontFamily('Adobe Blank')).toBeNull()
  })
})
