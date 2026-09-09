import { describe, expect, it } from 'vitest'
import {
  boundsCenter,
  clientPointToImage,
  containedRect,
  fittedContainSize,
  fontSizeFromCornerDrag,
  isOnResizeCorner,
  isOnRotateEdge,
  layerOutlinePadding,
  normalizeBounds,
  overlayRectInViewport,
  pointInRotatedBounds,
  resizeCursorForCorner,
  resizeHandleSize,
  rotateEdgeWidth,
  rotationFromDrag,
  scaleBoundsFromCorner,
  toLocalBoundsPoint,
  worldFromLocalBoundsPoint,
} from './imageGeometry'

describe('image geometry mapping', () => {
  it('keeps a matching aspect ratio unchanged', () => {
    expect(
      containedRect(
        { left: 40, top: 20, width: 800, height: 400 },
        1600,
        800,
      ),
    ).toEqual({ left: 40, top: 20, width: 800, height: 400 })
  })

  it('letterboxes a portrait image inside a wide box', () => {
    expect(
      containedRect(
        { left: 0, top: 0, width: 1000, height: 700 },
        1080,
        1920,
      ),
    ).toEqual({
      left: (1000 - 700 * (1080 / 1920)) / 2,
      top: 0,
      width: 700 * (1080 / 1920),
      height: 700,
    })
  })

  it('maps a click on letterboxed content to image pixels', () => {
    const display = containedRect(
      { left: 100, top: 50, width: 1000, height: 700 },
      1080,
      1920,
    )
    expect(clientPointToImage(display.left, display.top, display, 1080, 1920)).toEqual(
      { x: 0, y: 0 },
    )
    expect(
      clientPointToImage(
        display.left + display.width,
        display.top + display.height,
        display,
        1080,
        1920,
      ),
    ).toEqual({ x: 1080, y: 1920 })
  })

  it('can leave image pixels unclamped for rotation drags', () => {
    const display = { left: 0, top: 0, width: 100, height: 50 }
    expect(clientPointToImage(150, -10, display, 200, 100, false)).toEqual({
      x: 300,
      y: -20,
    })
  })

  it('normalizes a drag in any direction', () => {
    expect(
      normalizeBounds({ x: 80, y: 40 }, { x: 20, y: 10 }),
    ).toEqual({ x: 20, y: 10, width: 60, height: 30 })
  })

  it('does not upscale an image that already fits the viewport', () => {
    expect(
      fittedContainSize({ width: 800, height: 600 }, 400, 300),
    ).toEqual({ width: 400, height: 300 })
  })

  it('downscales a large image to fit the viewport', () => {
    expect(
      fittedContainSize({ width: 800, height: 600 }, 4000, 3000),
    ).toEqual({ width: 800, height: 600 })
  })

  it('maps an image-space box onto the zoomed frame in viewport coordinates', () => {
    expect(
      overlayRectInViewport(
        { x: 50, y: 25, width: 100, height: 50 },
        200,
        100,
        { left: 40, top: 20, width: 400, height: 200 },
        { left: 10, top: 5 },
      ),
    ).toEqual({ left: 130, top: 65, width: 200, height: 100 })
  })
})

describe('rotated text box geometry', () => {
  const bounds = { x: 10, y: 20, width: 100, height: 40 }

  it('maps unrotated corners to local box space', () => {
    expect(toLocalBoundsPoint({ x: 10, y: 20 }, bounds, 0)).toEqual({
      x: 0,
      y: 0,
    })
    expect(toLocalBoundsPoint({ x: 110, y: 40 }, bounds, 0)).toEqual({
      x: 100,
      y: 20,
    })
  })

  it('keeps the visual right edge as the local right edge after rotation', () => {
    const localRight = toLocalBoundsPoint(
      { x: boundsCenter(bounds).x, y: boundsCenter(bounds).y + bounds.width / 2 },
      bounds,
      90,
    )
    expect(localRight.x).toBeCloseTo(100)
    expect(localRight.y).toBeCloseTo(20)
  })

  it('hit-tests a box rotated 90 degrees around its center', () => {
    expect(
      pointInRotatedBounds(
        { x: boundsCenter(bounds).x, y: boundsCenter(bounds).y + 10 },
        bounds,
        90,
      ),
    ).toBe(true)
    expect(pointInRotatedBounds({ x: 15, y: 22 }, bounds, 90)).toBe(false)
  })

  it('treats the right strip as the rotate grab area', () => {
    expect(isOnRotateEdge({ x: 92, y: 20 }, bounds, 14)).toBe(true)
    expect(isOnRotateEdge({ x: 40, y: 20 }, bounds, 14)).toBe(false)
    expect(isOnRotateEdge({ x: 106, y: 20 }, bounds, 14)).toBe(true)
  })

  it('moves the rotate grab area to the padded outline edge', () => {
    expect(isOnRotateEdge({ x: 112, y: 20 }, bounds, 14, 16)).toBe(true)
    expect(isOnRotateEdge({ x: 92, y: 20 }, bounds, 14, 16)).toBe(false)
  })

  it('keeps a usable rotate strip in screen pixels on large images', () => {
    expect(rotateEdgeWidth(3000, 800)).toBeCloseTo(14 * (3000 / 800))
  })

  it('keeps outline padding visible in screen pixels on large images', () => {
    expect(layerOutlinePadding(40, 3000, 800)).toBeCloseTo(10 * (3000 / 800))
    expect(layerOutlinePadding(200, 800, 800)).toBeCloseTo(50)
  })

  it('rotates from the pointer angle around the box center', () => {
    const center = boundsCenter(bounds)
    expect(
      rotationFromDrag(center, { x: center.x + 40, y: center.y }, {
        x: center.x,
        y: center.y + 40,
      }, 0),
    ).toBeCloseTo(90)
  })
})

describe('corner font-size handles', () => {
  const bounds = { x: 10, y: 20, width: 100, height: 40 }
  const seHandle = { x: 100, y: 40 }

  it('hits the padded outline corners', () => {
    expect(isOnResizeCorner({ x: -16, y: -16 }, bounds, 14, 16)).toBe('nw')
    expect(isOnResizeCorner({ x: 116, y: 56 }, bounds, 14, 16)).toBe('se')
    expect(isOnResizeCorner({ x: 50, y: 20 }, bounds, 14, 16)).toBe(null)
  })

  it('wins over the rotate strip at the right-hand corners', () => {
    const se = { x: 116, y: 56 }
    expect(isOnRotateEdge(se, bounds, 14, 16)).toBe(true)
    expect(isOnResizeCorner(se, bounds, 14, 16)).toBe('se')
  })

  it('scales font size from the opposite corner like a size input', () => {
    expect(fontSizeFromCornerDrag(24, bounds, 'se', seHandle, 0)).toBeCloseTo(24)
    expect(
      fontSizeFromCornerDrag(24, bounds, 'se', { x: 200, y: 80 }, 0),
    ).toBeCloseTo(48)
    expect(
      fontSizeFromCornerDrag(24, bounds, 'nw', { x: 50, y: 20 }, 0),
    ).toBeCloseTo(12)
  })

  it('round-trips local points through world space', () => {
    const local = { x: 12, y: 7 }
    const world = worldFromLocalBoundsPoint(local, bounds, 35)
    const back = toLocalBoundsPoint(world, bounds, 35)
    expect(back.x).toBeCloseTo(local.x)
    expect(back.y).toBeCloseTo(local.y)
  })

  it('scales the box from the opposite corner', () => {
    const grown = scaleBoundsFromCorner(bounds, 2, 'se')
    expect(grown).toEqual({ x: 10, y: 20, width: 200, height: 80 })

    const shrunk = scaleBoundsFromCorner(bounds, 0.5, 'nw')
    expect(shrunk.width).toBe(50)
    expect(shrunk.height).toBe(20)
    expect(shrunk.x).toBeCloseTo(60)
    expect(shrunk.y).toBeCloseTo(40)
  })

  it('keeps the opposite corner fixed when the layer is rotated', () => {
    const pin = worldFromLocalBoundsPoint({ x: 0, y: 0 }, bounds, 40)
    const next = scaleBoundsFromCorner(bounds, 2, 'se', 40)
    const nextPin = worldFromLocalBoundsPoint({ x: 0, y: 0 }, next, 40)
    expect(nextPin.x).toBeCloseTo(pin.x)
    expect(nextPin.y).toBeCloseTo(pin.y)
    expect(next.width).toBe(200)
    expect(next.height).toBe(80)
  })

  it('clamps to the toolbar size range', () => {
    expect(
      fontSizeFromCornerDrag(24, bounds, 'se', { x: 10_000, y: 4_000 }, 0),
    ).toBe(600)
    expect(fontSizeFromCornerDrag(24, bounds, 'se', { x: 0, y: 0 }, 0)).toBe(4)
  })

  it('keeps resize handles visible in screen pixels on large images', () => {
    expect(resizeHandleSize(3000, 800)).toBeCloseTo(10 * (3000 / 800))
  })

  it('picks a resize cursor that follows rotation by 90 degrees', () => {
    expect(resizeCursorForCorner('se', 0)).toBe('nwse-resize')
    expect(resizeCursorForCorner('se', 90)).toBe('nesw-resize')
    expect(resizeCursorForCorner('ne', 0)).toBe('nesw-resize')
    expect(resizeCursorForCorner('ne', 90)).toBe('nwse-resize')
  })
})
