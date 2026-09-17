import type { Bounds, TextLayer } from '../document/types'
import { visualTextSize } from '../fonts/fitFontSize'
import { layerStrokeOutset } from './drawTextLayer'
import { applyCanvasLetterSpacing, canvasFont, isMonospaceFont } from './fonts'

const BOUNDS_EPSILON = 0.05

type TextSize = {
  width: number
  height: number
}

const boundsClose = (a: Bounds, b: Bounds) =>
  Math.abs(a.x - b.x) < BOUNDS_EPSILON &&
  Math.abs(a.y - b.y) < BOUNDS_EPSILON &&
  Math.abs(a.width - b.width) < BOUNDS_EPSILON &&
  Math.abs(a.height - b.height) < BOUNDS_EPSILON

export const estimatedTextSize = (layer: TextLayer): TextSize => {
  const lines = layer.text.split('\n')
  const longestLine = lines.reduce(
    (longest, line) => (line.length > longest.length ? line : longest),
    '',
  )
  const advance = isMonospaceFont(layer.typography.fontFamily) ? 0.62 : 0.56
  return {
    width:
      longestLine.length *
      layer.typography.fontSize *
      advance,
    height:
      lines.length * layer.typography.fontSize * layer.typography.lineHeight,
  }
}

let measureContext:
  | CanvasRenderingContext2D
  | OffscreenCanvasRenderingContext2D
  | null
  | undefined

const contextForMeasure = () => {
  if (measureContext !== undefined) return measureContext
  if (typeof OffscreenCanvas !== 'undefined') {
    measureContext = new OffscreenCanvas(1, 1).getContext('2d')
    return measureContext
  }
  if (typeof document === 'undefined') {
    measureContext = null
    return null
  }
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  measureContext = canvas.getContext('2d')
  return measureContext
}

export const measuredTextSize = (layer: TextLayer): TextSize | null => {
  const context = contextForMeasure()
  if (!context) return null
  const { typography } = layer
  context.font = canvasFont(
    typography.fontWeight,
    typography.fontSize,
    typography.fontFamily,
    typography.italic,
  )
  applyCanvasLetterSpacing(context, typography.letterSpacing)
  context.textAlign = 'left'
  context.textBaseline = 'alphabetic'
  const lines = layer.text.split('\n')
  let width = 0
  let height = 0
  for (const [index, line] of lines.entries()) {
    const ink = visualTextSize(context.measureText(line), typography.fontSize)
    if (ink.width > 1) width = Math.max(width, ink.width)
    height =
      index * typography.fontSize * typography.lineHeight + ink.height
  }
  if (width <= 1) return null
  const stroke = layerStrokeOutset(layer) * 2
  return { width: width + stroke, height: height + stroke }
}

export const growBoundsToText = (
  bounds: Bounds,
  textSize: TextSize,
  alignment: CanvasTextAlign = 'left',
): Bounds => {
  const width = Math.max(bounds.width, textSize.width)
  const height = Math.max(bounds.height, textSize.height)
  const extraX = width - bounds.width
  const x =
    alignment === 'center'
      ? bounds.x - extraX / 2
      : alignment === 'right' || alignment === 'end'
        ? bounds.x - extraX
        : bounds.x
  return { ...bounds, x, width, height }
}

export const withTextSizeBounds = (layer: TextLayer): TextLayer => {
  const bounds = growBoundsToText(
    layer.bounds,
    measuredTextSize(layer) ?? estimatedTextSize(layer),
    layer.typography.alignment,
  )
  if (boundsClose(bounds, layer.bounds)) return layer
  return { ...layer, bounds }
}

export const withFontSize = (layer: TextLayer, fontSize: number) =>
  withTextSizeBounds({
    ...layer,
    typography: { ...layer.typography, fontSize },
  })

export const fitLayersTextBounds = (layers: TextLayer[]) => {
  let changed = false
  const next = layers.map((layer) => {
    const fitted = withTextSizeBounds(layer)
    if (fitted !== layer) changed = true
    return fitted
  })
  return changed ? next : layers
}
