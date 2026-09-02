import type { TextLayer } from '../document/types'
import { drawLayerText } from './drawTextLayer'
import { ensureFontsForLayers } from './fonts'

export type ExportFormat = 'image/png' | 'image/jpeg' | 'image/webp'

export const extensionFor = (format: ExportFormat) => {
  if (format === 'image/jpeg') return 'jpg'
  if (format === 'image/webp') return 'webp'
  return 'png'
}

export const exportFileName = (sourceName: string | undefined, format: ExportFormat) => {
  const base = sourceName?.replace(/\.[^.]+$/, '') || 'edited-image'
  return `${base}.${extensionFor(format)}`
}

export const downloadFromUrl = (url: string, filename: string) => {
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.rel = 'noopener'
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
}

export const renderExportImage = async (
  cleanImageUrl: string,
  width: number,
  height: number,
  layers: TextLayer[],
  format: ExportFormat,
) => {
  const [imageBlob] = await Promise.all([
    fetch(cleanImageUrl).then((response) => response.blob()),
    ensureFontsForLayers(layers),
  ])
  const background = await createImageBitmap(imageBlob)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas 2D is unavailable in this browser.')

  context.drawImage(background, 0, 0, width, height)
  background.close()

  for (const layer of layers) {
    const { bounds, effects } = layer
    context.save()
    context.globalAlpha = effects.opacity
    context.translate(
      bounds.x + bounds.width / 2,
      bounds.y + bounds.height / 2,
    )
    context.rotate((layer.rotation * Math.PI) / 180)
    context.translate(-bounds.width / 2, -bounds.height / 2)
    drawLayerText(context, layer)
    context.restore()
  }

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) =>
        result ? resolve(result) : reject(new Error('Image export failed.')),
      format,
      format === 'image/png' ? undefined : 0.94,
    )
  })
}
