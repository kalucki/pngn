import type { TextLayer } from '../document/types'
import { canvasFont } from './fonts'

const lineOriginX = (alignment: CanvasTextAlign, width: number) => {
  if (alignment === 'center') return width / 2
  if (alignment === 'right') return width
  return 0
}

export const defaultStrokeWidth = (fontSize: number) =>
  Math.max(2, Math.round(fontSize * 0.08))

export const layerStrokeOutset = (layer: TextLayer) =>
  Math.max(0, layer.typography.strokeWidth) / 2

export const lineInkBaseline = (
  fontSize: number,
  lineHeight: number,
  lineIndex: number,
  ascent: number,
) =>
  lineIndex * fontSize * lineHeight + (ascent > 0 ? ascent : fontSize * 0.72)

export const drawLayerText = (
  context: CanvasRenderingContext2D,
  layer: TextLayer,
) => {
  const { bounds, typography } = layer
  context.fillStyle = typography.color
  context.font = canvasFont(
    typography.fontWeight,
    typography.fontSize,
    typography.fontFamily,
  )
  context.textAlign = typography.alignment
  context.textBaseline = 'alphabetic'
  const originX = lineOriginX(typography.alignment, bounds.width)
  const strokeWidth = Math.max(0, typography.strokeWidth)
  if (strokeWidth > 0) {
    context.lineJoin = 'round'
    context.lineCap = 'round'
    context.miterLimit = 2
    context.lineWidth = strokeWidth
    context.strokeStyle = typography.strokeColor
  }
  layer.text.split('\n').forEach((line, lineIndex) => {
    const originY = lineInkBaseline(
      typography.fontSize,
      typography.lineHeight,
      lineIndex,
      context.measureText(line).actualBoundingBoxAscent,
    )
    if (strokeWidth > 0) context.strokeText(line, originX, originY)
    context.fillText(line, originX, originY)
  })
}
