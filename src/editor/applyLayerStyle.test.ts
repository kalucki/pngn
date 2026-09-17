import { describe, expect, it } from 'vitest'
import type { TextLayer } from '../document/types'
import { applyLayerStylePatch } from './applyLayerStyle'
import { defaultStrokeWidth } from './drawTextLayer'

const layer = (
  overrides: Partial<TextLayer> & Pick<TextLayer, 'id'>,
): TextLayer => ({
  originalText: 'Hello',
  text: 'Hello',
  bounds: { x: 10, y: 10, width: 40, height: 16 },
  polygon: [],
  rotation: 0,
  typography: {
    fontFamily: 'Arial',
    fontSize: 16,
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
  removal: {
    bounds: { x: 10, y: 10, width: 40, height: 16 },
    mask: new Uint8Array(40 * 16),
  },
  ...overrides,
})

describe('applyLayerStylePatch', () => {
  it('applies only the patched typography keys', () => {
    const next = applyLayerStylePatch(
      layer({
        id: 'a',
        typography: {
          fontFamily: 'Georgia',
          fontSize: 22,
          fontWeight: 400,
          color: '#ff0000',
          strokeColor: '#ffffff',
          strokeWidth: 3,
          letterSpacing: 0,
          lineHeight: 1,
          alignment: 'left',
        },
      }),
      { typography: { color: '#00ff00' } },
    )

    expect(next.typography.color).toBe('#00ff00')
    expect(next.typography.fontFamily).toBe('Georgia')
    expect(next.typography.fontSize).toBe(22)
    expect(next.typography.strokeWidth).toBe(3)
  })

  it('keeps each layer weight when only the family changes', () => {
    const next = applyLayerStylePatch(
      layer({
        id: 'a',
        typography: {
          fontFamily: 'Arial',
          fontSize: 16,
          fontWeight: 900,
          color: '#111111',
          strokeColor: '#000000',
          strokeWidth: 0,
          letterSpacing: 0,
          lineHeight: 1,
          alignment: 'left',
        },
      }),
      { typography: { fontFamily: 'Inter' } },
    )

    expect(next.typography.fontFamily).toBe('Inter')
    expect(next.typography.fontWeight).toBe(900)
  })

  it('enables stroke from a color change using that layer font size', () => {
    const next = applyLayerStylePatch(
      layer({
        id: 'a',
        typography: {
          fontFamily: 'Arial',
          fontSize: 40,
          fontWeight: 400,
          color: '#111111',
          strokeColor: '#000000',
          strokeWidth: 0,
          letterSpacing: 0,
          lineHeight: 1,
          alignment: 'left',
        },
      }),
      { typography: { strokeColor: '#ffffff' } },
    )

    expect(next.typography.strokeColor).toBe('#ffffff')
    expect(next.typography.strokeWidth).toBe(defaultStrokeWidth(40))
  })

  it('keeps an existing stroke width when only the stroke color changes', () => {
    const next = applyLayerStylePatch(
      layer({
        id: 'a',
        typography: {
          fontFamily: 'Arial',
          fontSize: 16,
          fontWeight: 400,
          color: '#111111',
          strokeColor: '#000000',
          strokeWidth: 8,
          letterSpacing: 0,
          lineHeight: 1,
          alignment: 'left',
        },
      }),
      { typography: { strokeColor: '#ffffff' } },
    )

    expect(next.typography.strokeColor).toBe('#ffffff')
    expect(next.typography.strokeWidth).toBe(8)
  })

  it('applies an explicit stroke width to layers that already have a stroke', () => {
    const next = applyLayerStylePatch(
      layer({
        id: 'a',
        typography: {
          fontFamily: 'Arial',
          fontSize: 16,
          fontWeight: 400,
          color: '#111111',
          strokeColor: '#000000',
          strokeWidth: 8,
          letterSpacing: 0,
          lineHeight: 1,
          alignment: 'left',
        },
      }),
      { typography: { strokeWidth: 2 } },
    )

    expect(next.typography.strokeWidth).toBe(2)
    expect(next.typography.strokeColor).toBe('#000000')
  })

  it('copies only the changed keys onto another layer', () => {
    const other = applyLayerStylePatch(
      layer({
        id: 'b',
        typography: {
          fontFamily: 'Georgia',
          fontSize: 12,
          fontWeight: 400,
          color: '#00ff00',
          strokeColor: '#ffffff',
          strokeWidth: 4,
          letterSpacing: 0,
          lineHeight: 1,
          alignment: 'left',
        },
      }),
      { typography: { fontSize: 20 } },
    )

    expect(other.typography.fontSize).toBe(20)
    expect(other.typography.color).toBe('#00ff00')
    expect(other.typography.fontFamily).toBe('Georgia')
    expect(other.typography.strokeWidth).toBe(4)
  })

  it('applies letter spacing', () => {
    const next = applyLayerStylePatch(layer({ id: 'a' }), {
      typography: { letterSpacing: 4 },
    })
    expect(next.typography.letterSpacing).toBe(4)
  })

  it('applies opacity without touching typography', () => {
    const current = layer({ id: 'a' })
    const next = applyLayerStylePatch(current, { effects: { opacity: 0.4 } })

    expect(next.effects.opacity).toBe(0.4)
    expect(next.typography).toEqual(current.typography)
  })
})
