import { describe, expect, it } from 'vitest'
import {
  defaultOcrFontSize,
  fontSizeFromMetrics,
  visualTextSize,
} from './fitFontSize'

describe('defaultOcrFontSize', () => {
  it('uses 72% of the OCR box height, with a floor of 8px', () => {
    expect(defaultOcrFontSize(24)).toBeCloseTo(17.28)
    expect(defaultOcrFontSize(4)).toBe(8)
  })
})

describe('visualTextSize', () => {
  it('prefers ink boxes over the em-square advance', () => {
    expect(
      visualTextSize(
        {
          width: 80,
          actualBoundingBoxLeft: 2,
          actualBoundingBoxRight: 70,
          actualBoundingBoxAscent: 1,
          actualBoundingBoxDescent: 51,
        },
        100,
      ),
    ).toEqual({ width: 80, height: 52 })
  })

  it('falls back to the OCR height ratio when ink metrics are missing', () => {
    expect(visualTextSize({ width: 40 }, 100)).toEqual({
      width: 40,
      height: 72,
    })
  })
})

describe('fontSizeFromMetrics', () => {
  it('scales the sample size so ink height fills a wide OCR box', () => {
    expect(fontSizeFromMetrics(100, 50, 70, { width: 120, height: 70 })).toBe(100)
  })

  it('shrinks when the ink would overflow the box width', () => {
    expect(fontSizeFromMetrics(100, 200, 72, { width: 72, height: 36 })).toBe(36)
  })

  it('clamps tiny and huge results', () => {
    expect(
      fontSizeFromMetrics(100, 10_000, 10_000, { width: 1, height: 1 }),
    ).toBe(4)
    expect(
      fontSizeFromMetrics(100, 1, 1, { width: 4000, height: 4000 }),
    ).toBe(600)
  })
})
