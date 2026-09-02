import { beforeAll, describe, expect, it, vi } from 'vitest'
import { neuralInpaint } from './inpaintClient'
import { reconstructTextRegions } from './reconstruction'

vi.mock('./inpaintClient', () => ({
  neuralInpaint: vi.fn(async (crop: ImageData) => ({
    image: crop,
    provider: 'wasm' as const,
  })),
}))

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

const createFixture = () => {
  const width = 40
  const height = 24
  const pixels = new Uint8ClampedArray(width * height * 4)
  for (let offset = 0; offset < pixels.length; offset += 4) {
    pixels[offset] = 240
    pixels[offset + 1] = 240
    pixels[offset + 2] = 240
    pixels[offset + 3] = 255
  }
  for (let y = 9; y < 15; y += 1) {
    for (let x = 12; x < 28; x += 1) {
      const offset = (y * width + x) * 4
      pixels[offset] = 15
      pixels[offset + 1] = 15
      pixels[offset + 2] = 15
    }
  }
  return new ImageData(pixels, width, height)
}

const createNearbyArtFixture = () => {
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
    color: [number, number, number],
  ) => {
    for (let y = top; y < bottom; y += 1) {
      for (let x = left; x < right; x += 1) {
        const target = (y * width + x) * 4
        pixels[target] = color[0]
        pixels[target + 1] = color[1]
        pixels[target + 2] = color[2]
      }
    }
  }
  paint(18, 6, 222, 58, [18, 18, 18])
  paint(40, 14, 120, 44, [240, 140, 32])
  paint(130, 18, 200, 50, [40, 90, 170])
  paint(32, 78, 208, 122, [12, 12, 12])
  paint(70, 136, 170, 148, [16, 16, 16])
  return new ImageData(pixels, width, height)
}

const createTexturedRingFixture = () => {
  const width = 280
  const height = 200
  const pixels = new Uint8ClampedArray(width * height * 4)
  for (let offset = 0; offset < pixels.length; offset += 4) {
    pixels[offset] = 248
    pixels[offset + 1] = 248
    pixels[offset + 2] = 248
    pixels[offset + 3] = 255
  }
  const text = { x: 80, y: 60, width: 120, height: 80 }
  const ringBand = 8
  const quietBand = 3
  for (let y = text.y - ringBand; y < text.y + text.height + ringBand; y += 1) {
    for (let x = text.x - ringBand; x < text.x + text.width + ringBand; x += 1) {
      const dx =
        x < text.x
          ? text.x - x
          : x >= text.x + text.width
            ? x - (text.x + text.width - 1)
            : 0
      const dy =
        y < text.y
          ? text.y - y
          : y >= text.y + text.height
            ? y - (text.y + text.height - 1)
            : 0
      const distance = Math.max(dx, dy)
      if (distance <= quietBand || distance > ringBand) continue
      const target = (y * width + x) * 4
      const orange = (x + y) % 2 === 0
      pixels[target] = orange ? 255 : 20
      pixels[target + 1] = orange ? 80 : 90
      pixels[target + 2] = orange ? 20 : 255
    }
  }
  for (let y = text.y; y < text.y + text.height; y += 1) {
    for (let x = text.x; x < text.x + text.width; x += 1) {
      const target = (y * width + x) * 4
      pixels[target] = 12
      pixels[target + 1] = 12
      pixels[target + 2] = 12
    }
  }
  return { image: new ImageData(pixels, width, height), text }
}

describe('reconstructTextRegions', () => {
  it('replaces contrasting text on a flat background', async () => {
    const original = createFixture()
    const result = await reconstructTextRegions(
      original,
      [
        {
          text: 'TEST',
          confidence: 0.98,
          bounds: { x: 10, y: 7, width: 20, height: 10 },
        },
      ],
      { method: 'auto', maskThreshold: 30, maskDilation: 1 },
    )

    const center = (11 * original.width + 16) * 4
    expect(result.clean.data[center]).toBeGreaterThan(220)
    expect(result.maskedPixels).toBeGreaterThan(0)
    expect(result.layers[0].processing.reconstructionMethod).toBe('flat')
  })

  it('removes large black letters even when colorful artwork sits nearby', async () => {
    const original = createNearbyArtFixture()
    const result = await reconstructTextRegions(
      original,
      [
        {
          text: 'STORK',
          confidence: 0.99,
          bounds: { x: 30, y: 76, width: 180, height: 48 },
        },
      ],
      { method: 'auto', maskThreshold: 34, maskDilation: 2 },
    )

    const letter = (100 * original.width + 120) * 4
    const artwork = (30 * original.width + 80) * 4
    expect(result.clean.data[letter]).toBeGreaterThan(220)
    expect(result.clean.data[letter + 1]).toBeGreaterThan(220)
    expect(result.clean.data[artwork]).toBeGreaterThan(200)
    expect(result.maskedPixels).toBeGreaterThan(2000)
    expect(result.layers[0].processing.reconstructionMethod).toBe('flat')
  })

  it('preserves every pixel outside the removal mask', async () => {
    const original = createFixture()
    const result = await reconstructTextRegions(
      original,
      [
        {
          text: 'TEST',
          confidence: 0.98,
          bounds: { x: 10, y: 7, width: 20, height: 10 },
        },
      ],
      { method: 'gradient', maskThreshold: 30, maskDilation: 1 },
    )

    for (let pixel = 0; pixel < original.width * original.height; pixel += 1) {
      const offset = pixel * 4
      if (result.mask.data[offset] !== 0) continue
      expect(Array.from(result.clean.data.slice(offset, offset + 4))).toEqual(
        Array.from(original.data.slice(offset, offset + 4)),
      )
    }
  })

  it('escalates a rejected analytical fill to LaMa', async () => {
    const { image, text } = createTexturedRingFixture()
    const result = await reconstructTextRegions(
      image,
      [
        {
          text: 'HELLO',
          confidence: 0.99,
          bounds: text,
        },
      ],
      { method: 'auto', maskThreshold: 34, maskDilation: 2 },
    )

    expect(result.layers[0].processing.reconstructionMethod).toBe('lama')
    expect(neuralInpaint).toHaveBeenCalled()
  })
})
