import type { LayerRemoval, ProcessedImage } from '../document/types'

const pixelOffset = (x: number, y: number, width: number) => (y * width + x) * 4

const coversPixel = (removal: LayerRemoval, x: number, y: number) => {
  const localX = x - removal.bounds.x
  const localY = y - removal.bounds.y
  if (
    localX < 0 ||
    localY < 0 ||
    localX >= removal.bounds.width ||
    localY >= removal.bounds.height
  ) {
    return false
  }
  return removal.mask[localY * removal.bounds.width + localX] !== 0
}

const countMaskedPixels = (mask: ImageData) => {
  let maskedPixels = 0
  for (let pixel = 0; pixel < mask.width * mask.height; pixel += 1) {
    if (mask.data[pixel * 4]) maskedPixels += 1
  }
  return maskedPixels
}

export const revertLayerRemoval = (
  original: ImageData,
  clean: ImageData,
  mask: ImageData,
  removed: LayerRemoval,
  remaining: LayerRemoval[],
) => {
  const { bounds } = removed
  for (let y = 0; y < bounds.height; y += 1) {
    for (let x = 0; x < bounds.width; x += 1) {
      if (!removed.mask[y * bounds.width + x]) continue
      const globalX = bounds.x + x
      const globalY = bounds.y + y
      if (
        globalX < 0 ||
        globalY < 0 ||
        globalX >= clean.width ||
        globalY >= clean.height
      ) {
        continue
      }
      if (remaining.some((entry) => coversPixel(entry, globalX, globalY))) {
        continue
      }
      const offset = pixelOffset(globalX, globalY, clean.width)
      clean.data[offset] = original.data[offset]
      clean.data[offset + 1] = original.data[offset + 1]
      clean.data[offset + 2] = original.data[offset + 2]
      clean.data[offset + 3] = original.data[offset + 3]
      mask.data[offset] = 0
      mask.data[offset + 1] = 0
      mask.data[offset + 2] = 0
      mask.data[offset + 3] = 0
    }
  }
  return { maskedPixels: countMaskedPixels(mask) }
}

const imageDataFromBitmap = (bitmap: ImageBitmap) => {
  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas 2D is unavailable in this browser.')
  context.drawImage(bitmap, 0, 0)
  const image = context.getImageData(0, 0, canvas.width, canvas.height)
  bitmap.close()
  return image
}

export const imageDataFromFile = async (file: File) => {
  const bitmap = await createImageBitmap(file, {
    imageOrientation: 'from-image',
  })
  return imageDataFromBitmap(bitmap)
}

export const imageDataFromPng = async (buffer: ArrayBuffer) => {
  const bitmap = await createImageBitmap(
    new Blob([buffer], { type: 'image/png' }),
  )
  return imageDataFromBitmap(bitmap)
}

export const imageDataToPngBuffer = async (image: ImageData) => {
  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas 2D is unavailable in this browser.')
  context.putImageData(image, 0, 0)
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) =>
        result ? resolve(result) : reject(new Error('Canvas encoding failed.')),
      'image/png',
    )
  })
  return blob.arrayBuffer()
}

export const patchProcessedImage = async (
  original: ImageData,
  processed: ProcessedImage,
  removed: LayerRemoval,
  remaining: LayerRemoval[],
): Promise<ProcessedImage> => {
  const [clean, mask] = await Promise.all([
    imageDataFromPng(processed.cleanImage),
    imageDataFromPng(processed.maskImage),
  ])
  const { maskedPixels } = revertLayerRemoval(
    original,
    clean,
    mask,
    removed,
    remaining,
  )
  const [cleanImage, maskImage] = await Promise.all([
    imageDataToPngBuffer(clean),
    imageDataToPngBuffer(mask),
  ])
  return {
    ...processed,
    cleanImage,
    maskImage,
    diagnostics: { ...processed.diagnostics, maskedPixels },
  }
}
