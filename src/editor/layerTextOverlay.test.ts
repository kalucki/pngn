import { describe, expect, it } from 'vitest'
import type { TextLayer } from '../document/types'
import {
  layerTextOverlayStyle,
  overlayDisplayScale,
} from './layerTextOverlay'

const layer = (patch: Partial<TextLayer> = {}): TextLayer => ({
  id: 'layer',
  originalText: 'Hi',
  text: 'Hi',
  bounds: { x: 10, y: 20, width: 100, height: 40 },
  polygon: [],
  rotation: 12,
  typography: {
    fontFamily: 'Open Sans',
    fontSize: 32,
    fontWeight: 700,
    italic: true,
    color: '#ffffff',
    strokeColor: '#000000',
    strokeWidth: 4,
    letterSpacing: 2,
    lineHeight: 1,
    alignment: 'center',
  },
  effects: { opacity: 0.8 },
  processing: {
    recognitionConfidence: 1,
    maskConfidence: 1,
    reconstructionConfidence: 1,
    reconstructionMethod: 'flat',
    backgroundType: 'flat',
  },
  removal: {
    bounds: { x: 10, y: 20, width: 100, height: 40 },
    mask: new Uint8Array(0),
  },
  ...patch,
})

describe('overlayDisplayScale', () => {
  it('maps image pixels onto the displayed frame', () => {
    expect(overlayDisplayScale(400, 200)).toBe(2)
    expect(overlayDisplayScale(100, 0)).toBe(1)
  })
})

describe('layerTextOverlayStyle', () => {
  it('scales type to the displayed layer box and keeps rotation', () => {
    const style = layerTextOverlayStyle(
      layer(),
      { left: 20, top: 40, width: 200, height: 80 },
      2,
    )
    expect(style).toMatchObject({
      left: 20,
      top: 40,
      width: 200,
      height: 80,
      minWidth: 200,
      minHeight: 80,
      maxWidth: 200,
      maxHeight: 80,
      transform: 'rotate(12deg)',
      fontSize: '64px',
      fontWeight: 700,
      fontStyle: 'italic',
      letterSpacing: '4px',
      color: 'transparent',
      WebkitTextFillColor: 'transparent',
      caretColor: '#ffffff',
      textAlign: 'center',
    })
    expect(style.fontFamily).toContain('Open Sans')
  })
})
