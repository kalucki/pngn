import { describe, expect, it } from 'vitest'
import {
  applyWheelZoom,
  canvasBackingSize,
  IDENTITY_ZOOM,
  MAX_CANVAS_BACKING_EDGE,
  MAX_ZOOM,
  scaleFromWheelDelta,
  zoomTowardPoint,
} from './imageZoom'

describe('image zoom', () => {
  it('keeps the focal point under the cursor when zooming in', () => {
    const next = zoomTowardPoint(IDENTITY_ZOOM, 2, 100, 50)
    expect(next.scale).toBe(2)
    expect(next.x + 100 * next.scale).toBe(100)
    expect(next.y + 50 * next.scale).toBe(50)
  })

  it('returns to the original transform when zooming back out to 1', () => {
    const zoomed = zoomTowardPoint(IDENTITY_ZOOM, 2.5, 80, 40)
    expect(zoomTowardPoint(zoomed, 1, 80, 40)).toEqual(IDENTITY_ZOOM)
  })

  it('does not shrink past the original size', () => {
    expect(zoomTowardPoint(IDENTITY_ZOOM, 0.4, 20, 10)).toEqual(IDENTITY_ZOOM)
  })

  it('clamps to the maximum scale', () => {
    const next = zoomTowardPoint(IDENTITY_ZOOM, 40, 10, 10)
    expect(next.scale).toBe(MAX_ZOOM)
  })

  it('zooms in when scrolling up and out when scrolling down', () => {
    expect(scaleFromWheelDelta(-120, 0)).toBeGreaterThan(1)
    expect(scaleFromWheelDelta(120, 0)).toBeLessThan(1)
  })

  it('maps a wheel event through the current layout offset', () => {
    const next = applyWheelZoom(IDENTITY_ZOOM, -100, 0, 150, 90, 50, 30)
    const localX = 100
    const localY = 60
    expect(next.scale).toBeGreaterThan(1)
    expect(next.x + localX * next.scale).toBeCloseTo(localX)
    expect(next.y + localY * next.scale).toBeCloseTo(localY)
  })
})

describe('canvas backing store', () => {
  it('matches the on-screen size times device pixel ratio', () => {
    expect(canvasBackingSize(800, 600, 2)).toEqual({ width: 1600, height: 1200 })
  })

  it('caps the long edge so extreme zoom does not allocate a huge bitmap', () => {
    const next = canvasBackingSize(3000, 2000, 2, 4096)
    expect(Math.max(next.width, next.height)).toBe(4096)
    expect(next.width / next.height).toBeCloseTo(3000 / 2000)
  })

  it('uses the shared max edge by default', () => {
    const next = canvasBackingSize(4000, 3000, 3)
    expect(Math.max(next.width, next.height)).toBe(MAX_CANVAS_BACKING_EDGE)
  })
})
