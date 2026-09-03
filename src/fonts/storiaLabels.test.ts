import { describe, expect, it } from 'vitest'
import {
  classNameFamily,
  classNameWeight,
  collapseCandidates,
  labelToCandidate,
} from './storiaLabels'

describe('Storia labels', () => {
  it('parses family names from Storia class names', () => {
    expect(classNameFamily('AbrilFatface-Regular')).toBe('Abril Fatface')
    expect(classNameFamily('SourceSerif4-Bold')).toBe('Source Serif 4')
    expect(classNameFamily('AROneSans[ARRR,wght]')).toBe('AR One Sans')
    expect(classNameFamily('ABeeZee-Regular')).toBe('ABeeZee')
    expect(classNameFamily('ShipporiMinchoB1-ExtraBold')).toBe(
      'Shippori Mincho B1',
    )
    expect(classNameFamily('IMFeDPsc28P')).toBe('IM Fell DW Pica SC')
    expect(classNameFamily('IMFeFCsc28P')).toBe('IM Fell French Canon SC')
  })

  it('parses weights and italic style from class names', () => {
    expect(classNameWeight('Inter-ExtraBoldItalic')).toBe(800)
    expect(classNameWeight('Inter-SemiBold')).toBe(600)
    expect(classNameWeight('Inter-Regular')).toBe(400)
    expect(
      labelToCandidate(
        {
          index: 0,
          className: 'Inter-BoldItalic',
          family: 'Inter',
          weight: 700,
          italic: true,
        },
        0.9,
      ),
    ).toMatchObject({
      family: 'Inter',
      weight: 700,
      italic: true,
      score: 0.9,
    })
    expect(
      labelToCandidate(
        {
          index: 0,
          className: 'ShipporiMinchoB1-ExtraBold',
          family: 'Shippori Mincho B 1',
          weight: 800,
          italic: false,
        },
        0.8,
      ),
    ).toMatchObject({
      family: 'Shippori Mincho B1',
      weight: 800,
    })
  })

  it('keeps the strongest duplicate family/weight/style candidate', () => {
    expect(
      collapseCandidates([
        { family: 'Inter', weight: 700, italic: false, score: 0.4 },
        { family: 'Inter', weight: 700, italic: false, score: 0.7 },
        { family: 'Roboto', weight: 400, italic: false, score: 0.6 },
      ]),
    ).toEqual([
      { family: 'Inter', weight: 700, italic: false, score: 0.7 },
      { family: 'Roboto', weight: 400, italic: false, score: 0.6 },
    ])
  })
})

