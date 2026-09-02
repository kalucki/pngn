import { describe, expect, it } from 'vitest'
import { expandSelection, mapRegionalDetections } from './region'

describe('regional OCR geometry', () => {
  it('adds context without crossing image boundaries', () => {
    expect(
      expandSelection({ x: 4, y: 3, width: 80, height: 30 }, 400, 300),
    ).toEqual({ x: 0, y: 0, width: 108, height: 57 })
  })

  it('maps crop detections to image coordinates and rejects context-only text', () => {
    const detections = mapRegionalDetections(
      [
        {
          text: 'TARGET',
          confidence: 0.95,
          bounds: { x: 38, y: 26, width: 80, height: 24 },
        },
        {
          text: 'NEIGHBOR',
          confidence: 0.9,
          bounds: { x: 4, y: 3, width: 60, height: 18 },
        },
      ],
      { x: 60, y: 40, width: 180, height: 100 },
      { x: 90, y: 60, width: 100, height: 45 },
    )

    expect(detections).toHaveLength(1)
    expect(detections[0].bounds).toEqual({
      x: 98,
      y: 66,
      width: 80,
      height: 24,
    })
  })
})
