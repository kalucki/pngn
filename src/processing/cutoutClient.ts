import { imageDataFromUrl, imageDataToPng } from '../editor/rasterTools'

const sampleEdgeColor = (image: ImageData) => {
  const sums = [0, 0, 0]
  let count = 0
  const add = (x: number, y: number) => {
    const offset = (y * image.width + x) * 4
    sums[0] += image.data[offset]
    sums[1] += image.data[offset + 1]
    sums[2] += image.data[offset + 2]
    count += 1
  }
  for (let x = 0; x < image.width; x += Math.max(1, Math.floor(image.width / 100))) {
    add(x, 0)
    add(x, image.height - 1)
  }
  for (let y = 0; y < image.height; y += Math.max(1, Math.floor(image.height / 100))) {
    add(0, y)
    add(image.width - 1, y)
  }
  return sums.map((sum) => sum / Math.max(1, count))
}

export const removeBackground = async (imageUrl: string) => {
  const image = await imageDataFromUrl(imageUrl)
  const background = sampleEdgeColor(image)
  const maxDistance = 86
  for (let index = 0; index < image.width * image.height; index += 1) {
    const offset = index * 4
    const dr = image.data[offset] - background[0]
    const dg = image.data[offset + 1] - background[1]
    const db = image.data[offset + 2] - background[2]
    const distance = Math.sqrt(dr * dr + dg * dg + db * db)
    if (distance < maxDistance) {
      image.data[offset + 3] = Math.max(0, Math.min(255, (distance / maxDistance) * 255))
    }
  }
  return imageDataToPng(image)
}

export const replaceBackground = async (imageUrl: string, color: string) => {
  const cutout = await removeBackground(imageUrl)
  const foreground = await imageDataFromUrl(cutout.url)
  const canvas = document.createElement('canvas')
  canvas.width = foreground.width
  canvas.height = foreground.height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas 2D is unavailable in this browser.')
  context.fillStyle = color
  context.fillRect(0, 0, canvas.width, canvas.height)
  const foregroundCanvas = document.createElement('canvas')
  foregroundCanvas.width = foreground.width
  foregroundCanvas.height = foreground.height
  const foregroundContext = foregroundCanvas.getContext('2d')
  if (!foregroundContext) throw new Error('Canvas 2D is unavailable in this browser.')
  foregroundContext.putImageData(foreground, 0, 0)
  context.drawImage(foregroundCanvas, 0, 0)
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
    width: canvas.width,
    height: canvas.height,
  }
}
