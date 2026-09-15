import { describe, expect, it } from 'vitest'
import {
  autoApplyDecision,
  combinedRenderScore,
  DEFAULT_OCR_FONT,
  edgeMask,
  inkBounds,
  maskIoU,
  otsuThreshold,
  shouldAutoApplyFont,
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
