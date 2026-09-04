import { describe, expect, it } from 'vitest'
import {
  defaultOcrFontSize,
  fontSizeFromMetrics,
  visualTextSize,
} from './fitFontSize'

describe('defaultOcrFontSize', () => {
  it('converts OCR ink height to an em size using the cap-height ratio', () => {
    expect(defaultOcrFontSize(72)).toBe(100)
    expect(defaultOcrFontSize(24)).toBeCloseTo(24 / 0.72)
    expect(defaultOcrFontSize(4)).toBe(8)
  })
})

describe('visualTextSize', () => {
  it('uses the ink box, not the advance width', () => {
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
    ).toEqual({ width: 72, height: 52 })
  })

  it('falls back to the cap-height ratio when ink metrics are missing', () => {
    expect(visualTextSize({ width: 40 }, 100)).toEqual({
      width: 40,
      height: 72,
    })
  })
})

describe('fontSizeFromMetrics', () => {
  it('scales the sample so ink height fills the OCR box', () => {
    expect(fontSizeFromMetrics(100, 72, 72)).toBe(100)
    expect(fontSizeFromMetrics(100, 74, 73)).toBeCloseTo(98.65, 1)
  })

  it('does not shrink to fit a narrower advance width', () => {
    expect(fontSizeFromMetrics(100, 74, 74)).toBe(100)
  })

  it('clamps tiny and huge results', () => {
    expect(fontSizeFromMetrics(100, 10_000, 1)).toBe(4)
    expect(fontSizeFromMetrics(100, 1, 4000)).toBe(600)
  })
})
