import { beforeAll, describe, expect, it } from 'vitest'
import type { LayerRemoval } from '../document/types'
import { revertLayerRemoval } from './revertLayerRemoval'

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

const fill = (
  width: number,
  height: number,
  color: [number, number, number, number],
) => {
  const data = new Uint8ClampedArray(width * height * 4)
  for (let offset = 0; offset < data.length; offset += 4) {
    data[offset] = color[0]
    data[offset + 1] = color[1]
    data[offset + 2] = color[2]
    data[offset + 3] = color[3]
  }
  return new ImageData(data, width, height)
}

const paintRect = (
  image: ImageData,
  x: number,
  y: number,
  width: number,
  height: number,
  color: [number, number, number, number],
) => {
  for (let row = y; row < y + height; row += 1) {
    for (let column = x; column < x + width; column += 1) {
      const offset = (row * image.width + column) * 4
      image.data[offset] = color[0]
      image.data[offset + 1] = color[1]
      image.data[offset + 2] = color[2]
      image.data[offset + 3] = color[3]
    }
  }
}

const rectMask = (width: number, height: number): LayerRemoval => {
  const mask = new Uint8Array(width * height)
  mask.fill(255)
  return { bounds: { x: 0, y: 0, width, height }, mask }
}

const pixel = (image: ImageData, x: number, y: number) => {
  const offset = (y * image.width + x) * 4
  return Array.from(image.data.slice(offset, offset + 4))
}

describe('revertLayerRemoval', () => {
  it('restores original pixels under the removed mask', () => {
    const original = fill(8, 6, [10, 20, 30, 255])
    const clean = fill(8, 6, [10, 20, 30, 255])
    paintRect(clean, 2, 1, 3, 2, [200, 200, 200, 255])
    const mask = fill(8, 6, [0, 0, 0, 0])
    paintRect(mask, 2, 1, 3, 2, [255, 255, 255, 255])
    const removed: LayerRemoval = {
      bounds: { x: 2, y: 1, width: 3, height: 2 },
      mask: new Uint8Array(6).fill(255),
    }

    const { maskedPixels } = revertLayerRemoval(
      original,
      clean,
      mask,
      removed,
      [],
    )

    expect(pixel(clean, 3, 1)).toEqual([10, 20, 30, 255])
    expect(pixel(mask, 3, 1)).toEqual([0, 0, 0, 0])
    expect(pixel(clean, 0, 0)).toEqual([10, 20, 30, 255])
    expect(maskedPixels).toBe(0)
  })

  it('leaves pixels that remaining layers still own', () => {
    const original = fill(6, 4, [1, 2, 3, 255])
    const clean = fill(6, 4, [9, 9, 9, 255])
    const mask = fill(6, 4, [255, 255, 255, 255])
    const removed = rectMask(6, 4)
    const remaining: LayerRemoval = {
      bounds: { x: 2, y: 1, width: 2, height: 1 },
      mask: new Uint8Array([255, 255]),
    }

    revertLayerRemoval(original, clean, mask, removed, [remaining])

    expect(pixel(clean, 0, 0)).toEqual([1, 2, 3, 255])
    expect(pixel(clean, 2, 1)).toEqual([9, 9, 9, 255])
    expect(pixel(mask, 2, 1)).toEqual([255, 255, 255, 255])
    expect(pixel(mask, 0, 0)).toEqual([0, 0, 0, 0])
  })
})
