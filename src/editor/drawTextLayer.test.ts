import { describe, expect, it } from 'vitest'
import type { TextLayer } from '../document/types'
import { defaultStrokeWidth, layerStrokeOutset } from './drawTextLayer'

const layer = (strokeWidth: number): TextLayer => ({
  id: 'layer',
  originalText: 'Hi',
  text: 'Hi',
  bounds: { x: 0, y: 0, width: 40, height: 16 },
  polygon: [],
  rotation: 0,
  typography: {
    fontFamily: 'Arial',
    fontSize: 16,
    fontWeight: 700,
    color: '#ffffff',
    strokeColor: '#000000',
    strokeWidth,
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
})

describe('defaultStrokeWidth', () => {
  it('scales with font size and stays visible on small type', () => {
    expect(defaultStrokeWidth(12)).toBe(2)
    expect(defaultStrokeWidth(50)).toBe(4)
  })
})

describe('layerStrokeOutset', () => {
  it('is half the stroke so the outline stays inside the hit box', () => {
    expect(layerStrokeOutset(layer(0))).toBe(0)
    expect(layerStrokeOutset(layer(6))).toBe(3)
  })
})
