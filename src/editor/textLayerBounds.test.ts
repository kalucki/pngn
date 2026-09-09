import { describe, expect, it } from 'vitest'
import type { TextLayer } from '../document/types'
import { withFontSize, withTextSizeBounds } from './textLayerBounds'

const layer = (overrides: Partial<TextLayer> = {}): TextLayer => ({
  id: 'layer',
  originalText: 'Hello',
  text: 'Hello',
  bounds: { x: 10, y: 20, width: 40, height: 16 },
  polygon: [],
  rotation: 12,
  typography: {
    fontFamily: 'Arial',
    fontSize: 16,
    fontWeight: 700,
    color: '#ffffff',
    strokeColor: '#000000',
    strokeWidth: 3,
    letterSpacing: 0,
    lineHeight: 1,
    alignment: 'left',
  },
  effects: { opacity: 1 },
  processing: {
    recognitionConfidence: 1,
    maskConfidence: 1,
    reconstructionConfidence: 1,
    reconstructionMethod: 'flat',
    backgroundType: 'flat',
  },
  removal: {
    bounds: { x: 10, y: 20, width: 40, height: 16 },
    mask: new Uint8Array(40 * 16),
  },
  ...overrides,
})

describe('withTextSizeBounds', () => {
  it('grows the box when type outruns the current bounds', () => {
    const next = withTextSizeBounds(layer({ typography: {
      ...layer().typography,
      fontSize: 40,
    } }))
    expect(next.bounds.width).toBeCloseTo(5 * 40 * 0.56)
    expect(next.bounds.height).toBe(40)
    expect(next.bounds.x).toBe(10)
    expect(next.bounds.y).toBe(20)
  })

  it('does not shrink the box when type gets smaller', () => {
    const next = withTextSizeBounds(layer({
      typography: { ...layer().typography, fontSize: 8 },
    }))
    expect(next.bounds.width).toBe(40)
    expect(next.bounds.height).toBe(16)
  })
})

describe('withFontSize', () => {
  it('matches patching font size then fitting bounds', () => {
    const current = layer()
    const patched = {
      ...current,
      typography: { ...current.typography, fontSize: 48 },
    }
    expect(withFontSize(current, 48)).toEqual(withTextSizeBounds(patched))
  })

  it('leaves stroke, color, and position alone', () => {
    const next = withFontSize(layer(), 48)
    expect(next.typography.strokeWidth).toBe(3)
    expect(next.typography.color).toBe('#ffffff')
    expect(next.rotation).toBe(12)
    expect(next.bounds.x).toBe(10)
    expect(next.bounds.y).toBe(20)
  })

  it('keeps a grown box after shrinking, like the size field', () => {
    const grown = withFontSize(layer(), 48)
    const shrunk = withFontSize(grown, 16)
    expect(shrunk.typography.fontSize).toBe(16)
    expect(shrunk.bounds.width).toBe(grown.bounds.width)
    expect(shrunk.bounds.height).toBe(grown.bounds.height)
  })
})
