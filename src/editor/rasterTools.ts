import type { Bounds, NeuralInpaintModel } from '../document/types'
import { neuralInpaint } from '../processing/inpaintClient'

export type RasterEditResult = {
  url: string
  buffer: ArrayBuffer
  width: number
  height: number
}

const context2d = (canvas: HTMLCanvasElement | OffscreenCanvas) => {
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas 2D is unavailable in this browser.')
  return context
}

export const imageDataFromUrl = async (url: string) => {
  const blob = await fetch(url).then((response) => response.blob())
  const bitmap = await createImageBitmap(blob)
  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  context2d(canvas).drawImage(bitmap, 0, 0)
  bitmap.close()
  return context2d(canvas).getImageData(0, 0, canvas.width, canvas.height)
}

export const imageDataToPng = async (image: ImageData): Promise<RasterEditResult> => {
  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height
  context2d(canvas).putImageData(image, 0, 0)
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) =>
        result ? resolve(result) : reject(new Error('Canvas encoding failed.')),
      'image/png',
    )
  })
  return {
    url: URL.createObjectURL(blob),
    buffer: await blob.arrayBuffer(),
    width: image.width,
    height: image.height,
  }
}

export const cropImageData = (image: ImageData, bounds: Bounds) => {
  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height
  context2d(canvas).putImageData(image, 0, 0)
  return context2d(canvas).getImageData(bounds.x, bounds.y, bounds.width, bounds.height)
}

const putCrop = (target: ImageData, crop: ImageData, bounds: Bounds, mask?: Uint8Array) => {
  for (let y = 0; y < bounds.height; y += 1) {
    for (let x = 0; x < bounds.width; x += 1) {
      const sourceIndex = y * bounds.width + x
      if (mask && !mask[sourceIndex]) continue
      const source = sourceIndex * 4
      const destination = ((bounds.y + y) * target.width + bounds.x + x) * 4
      target.data[destination] = crop.data[source]
      target.data[destination + 1] = crop.data[source + 1]
      target.data[destination + 2] = crop.data[source + 2]
      target.data[destination + 3] = crop.data[source + 3]
    }
  }
}

export const eraseRaster = async (
  imageUrl: string,
  bounds: Bounds,
  mask: Uint8Array,
  model: NeuralInpaintModel,
) => {
  const image = await imageDataFromUrl(imageUrl)
  const crop = cropImageData(image, bounds)
  const restored = await neuralInpaint(crop, mask, model)
  putCrop(image, restored.image, bounds, mask)
  return imageDataToPng(image)
}

export const cropRaster = async (imageUrl: string, bounds: Bounds) =>
  imageDataToPng(cropImageData(await imageDataFromUrl(imageUrl), bounds))

export const flipRaster = async (imageUrl: string, axis: 'horizontal' | 'vertical') => {
  const image = await imageDataFromUrl(imageUrl)
  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height
  const source = document.createElement('canvas')
  source.width = image.width
  source.height = image.height
  context2d(source).putImageData(image, 0, 0)
  const context = context2d(canvas)
  context.translate(axis === 'horizontal' ? image.width : 0, axis === 'vertical' ? image.height : 0)
  context.scale(axis === 'horizontal' ? -1 : 1, axis === 'vertical' ? -1 : 1)
  context.drawImage(source, 0, 0)
  return imageDataToPng(context.getImageData(0, 0, canvas.width, canvas.height))
}

export const resizeRaster = async (imageUrl: string, width: number, height: number) => {
  const blob = await fetch(imageUrl).then((response) => response.blob())
  const bitmap = await createImageBitmap(blob)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = context2d(canvas)
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()
  return imageDataToPng(context.getImageData(0, 0, width, height))
}

