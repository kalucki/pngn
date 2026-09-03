import { describe, expect, it } from 'vitest'
import type { TextLayer } from '../document/types'
import {
  cropScaleFor,
  isDefaultOcrTypography,
  isViableFontMatchLayer,
  markPendingFontMatches,
  mergeMatchedFontLayer,
} from './matchTextLayerFont'

const layer = (overrides: Partial<TextLayer> = {}): TextLayer => ({
  id: 'layer',
  originalText: 'Hello',
  text: 'Hello',
  bounds: { x: 10, y: 10, width: 60, height: 24 },
  polygon: [],
  rotation: 0,
  typography: {
    fontFamily: 'Arial',
    fontSize: 18,
    fontWeight: 700,
    color: '#111111',
    strokeColor: '#000000',
    strokeWidth: 0,
    letterSpacing: 0,
    lineHeight: 1,
    alignment: 'left',
  },
  effects: { opacity: 1 },
  processing: {
    recognitionConfidence: 0.9,
    maskConfidence: 0.9,
    reconstructionConfidence: 0.9,
    reconstructionMethod: 'migan',
    backgroundType: 'flat',
  },
  ...overrides,
})

describe('font match layer filters', () => {
  it('accepts high-confidence readable layers', () => {
    expect(isViableFontMatchLayer(layer())).toBe(true)
  })

  it('skips weak, short, or collapsed OCR boxes', () => {
    expect(
      isViableFontMatchLayer(
        layer({
          processing: {
            ...layer().processing,
            recognitionConfidence: 0.2,
          },
        }),
      ),
    ).toBe(false)
    expect(isViableFontMatchLayer(layer({ originalText: 'I' }))).toBe(false)
    expect(
      isViableFontMatchLayer(layer({ bounds: { x: 0, y: 0, width: 20, height: 3 } })),
    ).toBe(false)
  })

  it('matches photo-sized OCR boxes that used to sit under the 14px gate', () => {
    expect(
      isViableFontMatchLayer(
        layer({
          originalText: 'Heritage Bay',
          bounds: { x: 10, y: 10, width: 48, height: 7 },
        }),
      ),
    ).toBe(true)
    expect(
      isViableFontMatchLayer(
        layer({
          originalText: 'URBAN-ESTATES',
          bounds: { x: 10, y: 10, width: 70, height: 6.5 },
        }),
      ),
    ).toBe(true)
  })

  it('upscales small crops so Storia and rerank see more than a few pixels', () => {
    expect(cropScaleFor(52, 11)).toBeCloseTo(64 / 11)
    expect(cropScaleFor(400, 80)).toBe(1)
    expect(cropScaleFor(2000, 8)).toBe(1)
  })

  it('marks viable layers pending and recognizes default OCR typography', () => {
    const [pending] = markPendingFontMatches([layer()])
    expect(pending?.fontMatch?.status).toBe('pending')
    expect(pending?.fontMatch?.requestId).toBeTruthy()
    expect(isDefaultOcrTypography(pending!)).toBe(true)
    expect(
      isDefaultOcrTypography(
        layer({ typography: { ...layer().typography, fontFamily: 'Georgia' } }),
      ),
    ).toBe(false)
  })

  it('applies a finished match onto the pending layer', () => {
    const [pending] = markPendingFontMatches([layer()])
    const matched = {
      ...pending!,
      typography: { ...pending!.typography, fontFamily: 'Roboto' },
      fontMatch: {
        ...pending!.fontMatch!,
        family: 'Roboto',
        status: 'ready' as const,
      },
    }
    expect(mergeMatchedFontLayer(pending!, matched).typography.fontFamily).toBe(
      'Roboto',
    )
  })

  it('keeps a newer pending request instead of a stale match', () => {
    const [first] = markPendingFontMatches([layer()])
    const [second] = markPendingFontMatches([layer()])
    const stale = {
      ...first!,
      typography: { ...first!.typography, fontFamily: 'Roboto' },
      fontMatch: {
        ...first!.fontMatch!,
        family: 'Roboto',
        status: 'ready' as const,
      },
    }
    expect(mergeMatchedFontLayer(second!, stale)).toBe(second)
  })

  it('keeps a font the user picked while matching was still pending', () => {
    const [pending] = markPendingFontMatches([layer()])
    const edited = {
      ...pending!,
      typography: { ...pending!.typography, fontFamily: 'Georgia' },
    }
    const matched = {
      ...pending!,
      typography: { ...pending!.typography, fontFamily: 'Roboto' },
      fontMatch: {
        ...pending!.fontMatch!,
        family: 'Roboto',
        status: 'ready' as const,
      },
    }
    expect(mergeMatchedFontLayer(edited, matched)).toEqual({
      ...edited,
      fontMatch: matched.fontMatch,
    })
  })
})

