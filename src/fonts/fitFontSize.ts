import type { Bounds } from '../document/types'
import {
  canvasFont,
  ensureFont,
  fontByFamily,
  nearestWeight,
} from '../editor/fonts'
import {
  DEFAULT_OCR_FONT_SIZE_RATIO,
  defaultOcrFontSize,
} from './ocrDefaults'

export { defaultOcrFontSize } from './ocrDefaults'

const SAMPLE_SIZE = 100
const MIN_FONT_SIZE = 4
const MAX_FONT_SIZE = 600

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value))

export type TextSizeMetrics = {
  width: number
  actualBoundingBoxLeft?: number
  actualBoundingBoxRight?: number
  actualBoundingBoxAscent?: number
  actualBoundingBoxDescent?: number
}

export const visualTextSize = (metrics: TextSizeMetrics, fontSize: number) => {
  const inkWidth =
    (metrics.actualBoundingBoxLeft ?? 0) +
    (metrics.actualBoundingBoxRight ?? 0)
  const inkHeight =
    (metrics.actualBoundingBoxAscent ?? 0) +
    (metrics.actualBoundingBoxDescent ?? 0)
  return {
    width: inkWidth > 1 ? inkWidth : Math.max(metrics.width, 1),
    height: inkHeight > 1 ? inkHeight : fontSize * DEFAULT_OCR_FONT_SIZE_RATIO,
  }
}

export const fontSizeFromMetrics = (
  sampleSize: number,
  measuredHeight: number,
  boxHeight: number,
) =>
  clamp(
    sampleSize * (boxHeight / Math.max(1, measuredHeight)),
    MIN_FONT_SIZE,
    MAX_FONT_SIZE,
  )

const measureInkHeight = (
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  lines: string[],
  fontSize: number,
) => {
  let height = 0
  for (const line of lines) {
    height += visualTextSize(context.measureText(line), fontSize).height
  }
  return Math.max(height, 1)
}

const contextForFit = () => {
  if (typeof OffscreenCanvas !== 'undefined') {
    return new OffscreenCanvas(1, 1).getContext('2d')
  }
  if (typeof document === 'undefined') return null
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  return canvas.getContext('2d')
}

export const fitFontSizeToBounds = async ({
  text,
  fontFamily,
  fontWeight,
  bounds,
}: {
  text: string
  fontFamily: string
  fontWeight: number
  bounds: Pick<Bounds, 'width' | 'height'>
}) => {
  const fallback = defaultOcrFontSize(bounds.height)
  const lines = text.split('\n').filter((line) => line.length > 0)
  if (lines.length === 0 || bounds.width < 1 || bounds.height < 1) {
    return fallback
  }

  const font = fontByFamily(fontFamily)
  const weight = font ? nearestWeight(font.weights, fontWeight) : fontWeight
  try {
    await ensureFont(fontFamily, weight)
  } catch {
    // Measure with the fallback face if the file never arrives.
  }

  const context = contextForFit()
  if (!context) return fallback

  context.textAlign = 'left'
  context.textBaseline = 'alphabetic'
  context.font = canvasFont(weight, SAMPLE_SIZE, fontFamily)
  let fontSize = fontSizeFromMetrics(
    SAMPLE_SIZE,
    measureInkHeight(context, lines, SAMPLE_SIZE),
    bounds.height,
  )

  context.font = canvasFont(weight, fontSize, fontFamily)
  return fontSizeFromMetrics(
    fontSize,
    measureInkHeight(context, lines, fontSize),
    bounds.height,
  )
}
