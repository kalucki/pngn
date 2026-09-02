import { beforeAll, describe, expect, it } from 'vitest'
import { analyticalFillDisagreesWithRing, segmentGlyphs } from './segmentation'

beforeAll(() => {
  if (typeof ImageData !== 'undefined') return
  class TestImageData {
    data: Uint8ClampedArray
    width: number
    height: number

    constructor(data: Uint8ClampedArray, width: number, height: number) {
      this.data = data
      this.width = width
      this.height = height
    }
  }
  Object.assign(globalThis, { ImageData: TestImageData })
})

const createEffectFixture = () => {
  const width = 64
  const height = 40
  const pixels = new Uint8ClampedArray(width * height * 4)
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const target = (y * width + x) * 4
      const background = 205 + Math.round((x / width) * 25)
      pixels[target] = background
      pixels[target + 1] = background
      pixels[target + 2] = background
      pixels[target + 3] = 255
    }
  }
  const paint = (left: number, top: number, right: number, bottom: number, value: number) => {
    for (let y = top; y < bottom; y += 1) {
      for (let x = left; x < right; x += 1) {
        const target = (y * width + x) * 4
        pixels[target] = value
        pixels[target + 1] = value
        pixels[target + 2] = value
      }
    }
  }
  paint(19, 15, 47, 27, 150)
  paint(16, 12, 44, 24, 95)
  paint(18, 14, 42, 22, 20)
  return new ImageData(pixels, width, height)
}

describe('segmentGlyphs', () => {
  it('connects antialiasing and a nearby simple shadow to the core mask', () => {
    const image = createEffectFixture()
    const segmentation = segmentGlyphs(
      image,
      {
        text: 'TEST',
        confidence: 0.97,
        bounds: { x: 15, y: 11, width: 30, height: 15 },
      },
      { method: 'auto', maskThreshold: 34, maskDilation: 0 },
    )
    const localIndex = (globalX: number, globalY: number) =>
      (globalY - segmentation.bounds.y) * segmentation.width +
      globalX -
      segmentation.bounds.x

    expect(segmentation.coreMask[localIndex(25, 18)]).toBe(255)
    expect(segmentation.removalMask[localIndex(17, 13)]).toBe(255)
    expect(segmentation.removalMask[localIndex(45, 25)]).toBe(255)
    expect(segmentation.confidence).toBeGreaterThan(0.5)
  })

  it('keeps distant background pixels outside the removal mask', () => {
    const image = createEffectFixture()
    const segmentation = segmentGlyphs(
      image,
      {
        text: 'TEST',
        confidence: 0.97,
        bounds: { x: 15, y: 11, width: 30, height: 15 },
      },
      { method: 'auto', maskThreshold: 34, maskDilation: 1 },
    )
    expect(segmentation.removalMask[0]).toBe(0)
  })

  it('masks large high-contrast letters when nearby artwork would inflate a wide ring', () => {
    const width = 240
    const height = 160
    const pixels = new Uint8ClampedArray(width * height * 4)
    for (let offset = 0; offset < pixels.length; offset += 4) {
      pixels[offset] = 252
      pixels[offset + 1] = 252
      pixels[offset + 2] = 252
      pixels[offset + 3] = 255
    }
    const paint = (
      left: number,
      top: number,
      right: number,
      bottom: number,
      value: number,
    ) => {
      for (let y = top; y < bottom; y += 1) {
        for (let x = left; x < right; x += 1) {
          const target = (y * width + x) * 4
          pixels[target] = value
          pixels[target + 1] = value
          pixels[target + 2] = value
        }
      }
    }
    paint(18, 6, 222, 58, 20)
    paint(32, 78, 208, 122, 12)
    const image = new ImageData(pixels, width, height)
    const segmentation = segmentGlyphs(
      image,
      {
        text: 'STORK',
        confidence: 0.99,
        bounds: { x: 30, y: 76, width: 180, height: 48 },
      },
      { method: 'auto', maskThreshold: 34, maskDilation: 2 },
    )
    const localIndex = (globalX: number, globalY: number) =>
      (globalY - segmentation.bounds.y) * segmentation.width +
      globalX -
      segmentation.bounds.x

    expect(segmentation.coreMask[localIndex(120, 100)]).toBe(255)
    expect(segmentation.removalMask[localIndex(120, 100)]).toBe(255)
    expect(segmentation.removalMask[localIndex(80, 50)]).toBe(0)
    expect(segmentation.model.localVariance).toBeLessThan(105)
  })

  const paintHole = (
    image: ImageData,
    segmentation: ReturnType<typeof segmentGlyphs>,
    color: [number, number, number],
  ) => {
    const filled = new ImageData(
      new Uint8ClampedArray(image.data),
      image.width,
      image.height,
    )
    for (let y = 0; y < segmentation.height; y += 1) {
      for (let x = 0; x < segmentation.width; x += 1) {
        if (!segmentation.removalMask[y * segmentation.width + x]) continue
        const target =
          ((segmentation.bounds.y + y) * filled.width +
            segmentation.bounds.x +
            x) *
          4
        filled.data[target] = color[0]
        filled.data[target + 1] = color[1]
        filled.data[target + 2] = color[2]
      }
    }
    return filled
  }

  it('accepts an analytical fill that matches the surviving ring', () => {
    const image = createEffectFixture()
    const segmentation = segmentGlyphs(
      image,
      {
        text: 'TEST',
        confidence: 0.97,
        bounds: { x: 15, y: 11, width: 30, height: 15 },
      },
      { method: 'auto', maskThreshold: 34, maskDilation: 0 },
    )
    const filled = paintHole(image, segmentation, segmentation.model.flatColor)
    expect(analyticalFillDisagreesWithRing(filled, segmentation)).toBe(false)
  })

  it('rejects an analytical fill that does not match the surviving ring', () => {
    const image = createEffectFixture()
    const segmentation = segmentGlyphs(
      image,
      {
        text: 'TEST',
        confidence: 0.97,
        bounds: { x: 15, y: 11, width: 30, height: 15 },
      },
      { method: 'auto', maskThreshold: 34, maskDilation: 0 },
    )
    const filled = paintHole(image, segmentation, [16, 220, 48])
    expect(analyticalFillDisagreesWithRing(filled, segmentation)).toBe(true)
  })
})
