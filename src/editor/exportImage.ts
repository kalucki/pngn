import type { Layer, TextLayer } from '../document/types'
import { drawLayerText } from './drawTextLayer'
import { ensureFontsForLayers } from './fonts'

export type ExportFormat = 'image/png' | 'image/jpeg' | 'image/webp' | 'image/avif'

export type ExportOptions = {
  width?: number
  height?: number
  targetBytes?: number
}

export const extensionFor = (format: ExportFormat) => {
  if (format === 'image/jpeg') return 'jpg'
  if (format === 'image/webp') return 'webp'
  if (format === 'image/avif') return 'avif'
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

const isTextLayer = (layer: Layer | TextLayer): layer is TextLayer =>
  !('kind' in layer) || layer.kind === 'text'

const textLayersFrom = (layers: Array<Layer | TextLayer>) =>
  layers.filter(isTextLayer)

const blobFromCanvas = (
  canvas: HTMLCanvasElement,
  format: ExportFormat,
  quality: number | undefined,
) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) =>
        result ? resolve(result) : reject(new Error('Image export failed.')),
      format,
      format === 'image/png' ? undefined : quality,
    )
  })

const encodeWithTargetBytes = async (
  canvas: HTMLCanvasElement,
  format: ExportFormat,
  targetBytes: number | undefined,
) => {
  if (!targetBytes || format === 'image/png') {
    return blobFromCanvas(canvas, format, format === 'image/png' ? undefined : 0.94)
  }
  let low = 0.45
  let high = 0.96
  let best = await blobFromCanvas(canvas, format, high)
  for (let step = 0; step < 7; step += 1) {
    const quality = (low + high) / 2
    const candidate = await blobFromCanvas(canvas, format, quality)
    if (candidate.size <= targetBytes) {
      best = candidate
      low = quality
    } else {
      high = quality
    }
  }
  return best
}

export const renderExportImage = async (
  cleanImageUrl: string,
  width: number,
  height: number,
  layers: Array<Layer | TextLayer>,
  format: ExportFormat,
  options: ExportOptions = {},
) => {
  const textLayers = textLayersFrom(layers)
  const [imageBlob] = await Promise.all([
    fetch(cleanImageUrl).then((response) => response.blob()),
    ensureFontsForLayers(textLayers),
  ])
  const background = await createImageBitmap(imageBlob)
  const canvas = document.createElement('canvas')
  canvas.width = options.width ?? width
  canvas.height = options.height ?? height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas 2D is unavailable in this browser.')

  const scaleX = canvas.width / width
  const scaleY = canvas.height / height
  context.drawImage(background, 0, 0, canvas.width, canvas.height)
  background.close()
  context.scale(scaleX, scaleY)

  for (const layer of layers) {
    if (!isTextLayer(layer)) continue
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

  return encodeWithTargetBytes(canvas, format, options.targetBytes)
}
