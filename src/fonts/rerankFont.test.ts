import { describe, expect, it } from 'vitest'
import {
  autoApplyDecision,
  DEFAULT_OCR_FONT,
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

describe('autoApplyDecision', () => {
  it('applies the rerank winner when its IoU beats Arial', () => {
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
