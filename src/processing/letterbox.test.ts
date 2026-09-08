import { beforeAll, describe, expect, it } from 'vitest'
import {
  cropContentFromSquare,
  letterboxLayout,
  meanUnmaskedColor,
  padImageToSquare,
  padMaskToSquare,
} from './letterbox'

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

const solidImage = (
  width: number,
  height: number,
  color: [number, number, number],
) => {
  const pixels = new Uint8ClampedArray(width * height * 4)
  for (let index = 0; index < width * height; index += 1) {
    const offset = index * 4
    pixels[offset] = color[0]
    pixels[offset + 1] = color[1]
    pixels[offset + 2] = color[2]
    pixels[offset + 3] = 255
  }
  return new ImageData(pixels, width, height)
}

describe('letterboxLayout', () => {
  it('pads a wide crop instead of stretching it to a square', () => {
    const layout = letterboxLayout(1200, 300, 512)
    expect(layout.contentWidth).toBe(512)
    expect(layout.contentHeight).toBe(128)
    expect(layout.x).toBe(0)
    expect(layout.y).toBe(192)
  })

  it('keeps a tall crop’s aspect ratio', () => {
    const layout = letterboxLayout(200, 800, 512)
    expect(layout.contentWidth).toBe(128)
    expect(layout.contentHeight).toBe(512)
    expect(layout.x).toBe(192)
    expect(layout.y).toBe(0)
  })
})

describe('padImageToSquare', () => {
  it('round-trips pixels after pad and crop', () => {
    const image = solidImage(6, 2, [40, 80, 120])
    image.data[0] = 9
    image.data[1] = 10
    image.data[2] = 11
    const mask = new Uint8Array(12)
    mask[0] = 255
    const fill = meanUnmaskedColor(image, mask)
    const padded = padImageToSquare(image, fill)
    expect(padded.image.width).toBe(6)
    expect(padded.image.height).toBe(6)
    const restored = cropContentFromSquare(padded.image, padded.layout)
    expect(restored.width).toBe(6)
    expect(restored.height).toBe(2)
    expect(Array.from(restored.data)).toEqual(Array.from(image.data))
  })

  it('leaves pad pixels unmasked', () => {
    const mask = new Uint8Array([255, 255, 255, 255])
    const padded = padMaskToSquare(mask, 4, 1)
    expect(padded.length).toBe(16)
    expect(padded[4]).toBe(255)
    expect(padded[0]).toBe(0)
  })
})
