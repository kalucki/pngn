import { describe, expect, it } from 'vitest'
import type { ProcessingOptions, TextLayer } from '../document/types'
import {
  adoptRegionLayers,
  layersFromRegions,
  optionsEqual,
  staleLayerIds,
  type ProcessedRegion,
} from './processedRegions'

const options = (
  overrides: Partial<ProcessingOptions> = {},
): ProcessingOptions => ({
  method: 'auto',
  maskThreshold: 34,
  maskDilation: 2,
  ...overrides,
})

const layer = (overrides: Partial<TextLayer> & Pick<TextLayer, 'id'>): TextLayer => ({
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
  ...overrides,
})

describe('optionsEqual', () => {
  it('treats identical processing options as equal', () => {
    expect(optionsEqual(options(), options())).toBe(true)
  })

  it('detects mask and reconstruction changes', () => {
    expect(optionsEqual(options(), options({ maskThreshold: 50 }))).toBe(false)
    expect(optionsEqual(options(), options({ maskDilation: 6 }))).toBe(false)
    expect(optionsEqual(options(), options({ method: 'flat' }))).toBe(false)
    expect(optionsEqual(options(), options({ method: 'lama' }))).toBe(false)
  })
})

describe('adoptRegionLayers', () => {
  it('keeps edited text and ids when OCR returns the same copy', () => {
    const previous = [
      layer({
        id: 'keep-me',
        originalText: 'Hello',
        text: 'Goodbye',
        typography: {
          fontFamily: 'Georgia',
          fontSize: 22,
          fontWeight: 400,
          color: '#ff0000',
          strokeColor: '#ffffff',
          strokeWidth: 3,
          letterSpacing: 0,
          lineHeight: 1,
          alignment: 'center',
        },
        rotation: 12,
      }),
    ]
    const next = [layer({ id: 'fresh', originalText: 'Hello', text: 'Hello' })]
    const adopted = adoptRegionLayers(previous, next, 'region-1')

    expect(adopted[0]?.id).toBe('keep-me')
    expect(adopted[0]?.text).toBe('Goodbye')
    expect(adopted[0]?.typography.fontFamily).toBe('Georgia')
    expect(adopted[0]?.typography.strokeColor).toBe('#ffffff')
    expect(adopted[0]?.typography.strokeWidth).toBe(3)
    expect(adopted[0]?.rotation).toBe(12)
    expect(adopted[0]?.processing.reconstructionMethod).toBe('migan')
  })

  it('assigns stable ids for newly detected lines', () => {
    const adopted = adoptRegionLayers(
      [],
      [layer({ id: 'text-0-1-2' })],
      'region-9',
    )
    expect(adopted[0]?.id).toBe('region-9-text-0-1-2')
  })
})

describe('staleLayerIds', () => {
  it('marks layers whose region was processed with different settings', () => {
    const regions: ProcessedRegion[] = [
      {
        id: 'a',
        selection: { x: 0, y: 0, width: 10, height: 10 },
        options: options({ maskThreshold: 34 }),
        layerIds: ['one'],
        processed: {} as ProcessedRegion['processed'],
      },
      {
        id: 'b',
        selection: { x: 20, y: 0, width: 10, height: 10 },
        options: options({ maskThreshold: 50 }),
        layerIds: ['two'],
        processed: {} as ProcessedRegion['processed'],
      },
    ]
    expect([...staleLayerIds(regions, options({ maskThreshold: 50 }))]).toEqual([
      'one',
    ])
  })
})

describe('layersFromRegions', () => {
  it('rebuilds layers in region order and applies a replacement', () => {
    const current = [
      layer({ id: 'a1', text: 'A' }),
      layer({ id: 'b1', text: 'B' }),
    ]
    const regions: ProcessedRegion[] = [
      {
        id: 'a',
        selection: { x: 0, y: 0, width: 10, height: 10 },
        options: options(),
        layerIds: ['a1'],
        processed: {} as ProcessedRegion['processed'],
      },
      {
        id: 'b',
        selection: { x: 20, y: 0, width: 10, height: 10 },
        options: options(),
        layerIds: ['b1'],
        processed: {} as ProcessedRegion['processed'],
      },
    ]
    const replacement = [layer({ id: 'a1', text: 'Edited' })]
    const combined = layersFromRegions(regions, current, {
      regionId: 'a',
      layers: replacement,
    })
    expect(combined.map((item) => item.text)).toEqual(['Edited', 'B'])
  })
})
