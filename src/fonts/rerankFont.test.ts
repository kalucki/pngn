import { describe, expect, it } from 'vitest'
import {
  autoApplyDecision,
  combinedRenderScore,
  DEFAULT_OCR_FONT,
  edgeMask,
  inkBounds,
  letterSpacingForWidth,
  letterSpacingToLayer,
  maskIoU,
  neighborWeights,
  otsuThreshold,
  sampleRemovalMask,
  shouldAutoApplyFont,
  spacingGapsFor,
  removalInkWidth,
  type RankedFontCandidate,
} from './rerankFont'

const ranked = (
  entries: Array<[string, number, number?]>,
): RankedFontCandidate[] =>
  entries.map(([family, renderScore, score = 0.1]) => ({
    family,
    weight: 700,
    italic: false,
    score,
    renderScore,
  }))

const paint = (
  width: number,
  height: number,
  fill: (x: number, y: number) => boolean,
) => {
  const mask = new Uint8Array(width * height)
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      mask[y * width + x] = fill(x, y) ? 1 : 0
    }
  }
  return mask
}

describe('autoApplyDecision', () => {
  it('applies the rerank winner when its score beats Arial', () => {
    const candidates = ranked([
      ['Roboto', 0.42],
      [DEFAULT_OCR_FONT, 0.31],
      ['Inter', 0.28],
    ])
    expect(autoApplyDecision(candidates)).toEqual({
      apply: true,
      reason: 'Roboto 0.420 > Arial 0.310',
    })
    expect(shouldAutoApplyFont(candidates)).toBe(true)
  })

  it('keeps Arial when it still leads the rerank', () => {
    const candidates = ranked([
      [DEFAULT_OCR_FONT, 0.44],
      ['Roboto', 0.41],
    ])
    expect(autoApplyDecision(candidates).apply).toBe(false)
    expect(shouldAutoApplyFont(candidates)).toBe(false)
  })

  it('keeps Arial when the winner only ties it', () => {
    expect(
      autoApplyDecision(
        ranked([
          ['Roboto', 0.4, 0.2],
          [DEFAULT_OCR_FONT, 0.4, 0.05],
        ]),
      ).apply,
    ).toBe(false)
  })

  it('applies a winner when Arial is missing from the rerank', () => {
    expect(autoApplyDecision(ranked([['Georgia', 0.22]]))).toMatchObject({
      apply: true,
      reason: 'Georgia 0.220 > Arial 0.000',
    })
  })

  it('does not apply when there are no candidates', () => {
    expect(autoApplyDecision([])).toEqual({
      apply: false,
      reason: 'no candidates',
    })
  })
})

describe('font rerank scoring', () => {
  it('splits dark ink from a light field with Otsu', () => {
    const luminance = new Float32Array([
      20, 22, 18, 240, 245, 238, 21, 250, 19, 242,
    ])
    const threshold = otsuThreshold(luminance)
    expect(threshold).toBeGreaterThan(22)
    expect(threshold).toBeLessThan(238)
  })

  it('finds the ink bounding box', () => {
    const mask = paint(8, 6, (x, y) => x >= 2 && x <= 5 && y >= 1 && y <= 3)
    expect(inkBounds(mask, 8, 6)).toEqual({ x: 2, y: 1, width: 4, height: 3 })
    expect(inkBounds(new Uint8Array(8 * 6), 8, 6)).toBeNull()
  })

  it('scores outline overlap separately from filled IoU', () => {
    const filled = paint(6, 6, (x, y) => x >= 1 && x <= 4 && y >= 1 && y <= 4)
    const hollow = paint(
      6,
      6,
      (x, y) =>
        x >= 1 && x <= 4 && y >= 1 && y <= 4 && (x === 1 || x === 4 || y === 1 || y === 4),
    )
    const width = 6
    const height = 6
    expect(maskIoU(filled, filled)).toBe(1)
    expect(maskIoU(filled, hollow)).toBeCloseTo(0.75)
    expect(
      maskIoU(edgeMask(filled, width, height), edgeMask(hollow, width, height)),
    ).toBe(1)
  })

  it('lets a confident model score beat a tiny IoU gap', () => {
    const closeIoU = combinedRenderScore(0.4, 0.35, 0.02)
    const confident = combinedRenderScore(0.39, 0.34, 0.55)
    expect(confident).toBeGreaterThan(closeIoU)
  })

  it('still prefers a clearly better geometric fit over a weak model hit', () => {
    expect(combinedRenderScore(0.52, 0.48, 0.08)).toBeGreaterThan(
      combinedRenderScore(0.31, 0.29, 0.6),
    )
  })
})

describe('glyph mask sampling', () => {
  it('maps the segmentation mask into the upscaled crop', () => {
    const removal = {
      bounds: { x: 10, y: 10, width: 4, height: 2 },
      mask: Uint8Array.from([255, 0, 255, 0, 0, 255, 0, 255]),
    }
    expect(
      Array.from(
        sampleRemovalMask(removal, {
          x: 10,
          y: 10,
          sourceWidth: 4,
          sourceHeight: 2,
          width: 4,
          height: 2,
        }),
      ),
    ).toEqual([1, 0, 1, 0, 0, 1, 0, 1])
    expect(
      Array.from(
        sampleRemovalMask(removal, {
          x: 10,
          y: 10,
          sourceWidth: 4,
          sourceHeight: 2,
          width: 8,
          height: 4,
        }),
      ).slice(0, 8),
    ).toEqual([1, 1, 0, 0, 1, 1, 0, 0])
  })

  it('measures the original glyph span from the removal mask', () => {
    const removal = {
      bounds: { x: 10, y: 10, width: 8, height: 3 },
      mask: Uint8Array.from([
        0, 255, 255, 0, 0, 255, 255, 0,
        0, 255, 0, 0, 0, 0, 255, 0,
        0, 255, 255, 0, 0, 255, 255, 0,
      ]),
    }
    expect(removalInkWidth(removal)).toBe(6)
  })

  it('accounts for crop padding around the OCR box', () => {
    const removal = {
      bounds: { x: 10, y: 10, width: 2, height: 1 },
      mask: Uint8Array.from([255, 255]),
    }
    const sampled = sampleRemovalMask(removal, {
      x: 8,
      y: 8,
      sourceWidth: 6,
      sourceHeight: 5,
      width: 6,
      height: 5,
    })
    expect(sampled[2 * 6 + 2]).toBe(1)
    expect(sampled[0]).toBe(0)
  })
})

describe('weight neighbors', () => {
  it('tries nearby catalog weights around the model pick', () => {
    expect(neighborWeights([400, 500, 600, 700, 800, 900], 700)).toEqual([
      700, 600, 800,
    ])
    expect(neighborWeights([300, 400, 500, 700, 900], 700)).toEqual([
      700, 500, 900,
    ])
    expect(neighborWeights([400], 400)).toEqual([400])
  })
})

describe('letter spacing restore', () => {
  it('spreads leftover width across letter gaps and clamps', () => {
    expect(spacingGapsFor('Hello')).toBe(4)
    expect(spacingGapsFor('Hi\nWorld')).toBe(4)
    expect(letterSpacingForWidth(100, 80, 4, 10)).toBe(5)
    expect(letterSpacingForWidth(100, 80, 4, 3)).toBe(3)
    expect(letterSpacingForWidth(80, 100, 4, 10)).toBe(-5)
  })

  it('converts crop-space tracking back to image pixels', () => {
    expect(letterSpacingToLayer(-24, 4)).toBe(-6)
    expect(letterSpacingToLayer(-10.9, 1)).toBe(-10.9)
    expect(letterSpacingToLayer(8, 12)).toBeCloseTo(8 / 12)
  })
})
