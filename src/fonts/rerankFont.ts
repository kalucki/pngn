import type { TextLayer } from '../document/types'
import {
  canvasFont,
  ensureFont,
  FONT_CATALOG,
  fontByFamily,
  nearestWeight,
  registerDetectedFonts,
} from '../editor/fonts'
import {
  collapseCandidates,
  type FontCandidate,
} from './storiaLabels'

export type RankedFontCandidate = FontCandidate & {
  renderScore: number
}

const SYSTEM_FACES = FONT_CATALOG.filter((font) => font.source === 'system').map(
  (font): FontCandidate => ({
    family: font.family,
    weight: 700,
    italic: false,
    score: 0.05,
  }),
)

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value))

const withTimeout = <T>(promise: Promise<T>, ms: number, message: string) =>
  new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), ms)
    promise.then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      (error) => {
        clearTimeout(timer)
        reject(error)
      },
    )
  })

const contextFor = (canvas: OffscreenCanvas | HTMLCanvasElement) => {
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) throw new Error('Canvas 2D is unavailable.')
  return context
}

const createCanvas = (width: number, height: number) => {
  if (typeof OffscreenCanvas !== 'undefined') {
    return new OffscreenCanvas(width, height)
  }
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

const inkMask = (image: ImageData) => {
  const plane = image.width * image.height
  const luminance = new Float32Array(plane)
  let min = 255
  let max = 0
  let sum = 0
  for (let index = 0; index < plane; index += 1) {
    const offset = index * 4
    const value =
      image.data[offset] * 0.2126 +
      image.data[offset + 1] * 0.7152 +
      image.data[offset + 2] * 0.0722
    luminance[index] = value
    min = Math.min(min, value)
    max = Math.max(max, value)
    sum += value
  }
  const mean = sum / plane
  const threshold = min + (max - min) * 0.48
  const darkInk = mean > 127
  const mask = new Uint8Array(plane)
  for (let index = 0; index < plane; index += 1) {
    mask[index] = darkInk
      ? luminance[index] < threshold
        ? 1
        : 0
      : luminance[index] > threshold
        ? 1
        : 0
  }
  return mask
}

const renderMask = async (
  text: string,
  candidate: FontCandidate,
  width: number,
  height: number,
) => {
  const font = fontByFamily(candidate.family)
  const weight = font ? nearestWeight(font.weights, candidate.weight) : candidate.weight
  try {
    await withTimeout(
      ensureFont(candidate.family, weight),
      8000,
      `Timed out loading ${candidate.family}`,
    )
  } catch {
    // Render with the fallback face so one stuck Google Font cannot stall matching.
  }
  const canvas = createCanvas(width, height)
  const context = contextFor(canvas)
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, width, height)
  context.fillStyle = '#000000'
  context.textAlign = 'center'
  context.textBaseline = 'middle'

  let fontSize = clamp(height * 0.84, 6, 600)
  for (let attempt = 0; attempt < 5; attempt += 1) {
    context.font = canvasFont(weight, fontSize, candidate.family)
    const metrics = context.measureText(text)
    if (metrics.width <= width * 0.92) break
    fontSize *= (width * 0.92) / Math.max(1, metrics.width)
  }

  context.font = canvasFont(weight, fontSize, candidate.family)
  context.fillText(text, width / 2, height / 2)
  const image = context.getImageData(0, 0, width, height)
  const mask = new Uint8Array(width * height)
  for (let index = 0; index < mask.length; index += 1) {
    mask[index] = image.data[index * 4] < 192 ? 1 : 0
  }
  return mask
}

const maskIoU = (left: Uint8Array, right: Uint8Array) => {
  let intersection = 0
  let union = 0
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] && right[index]) intersection += 1
    if (left[index] || right[index]) union += 1
  }
  return union > 0 ? intersection / union : 0
}

export const rerankFontCandidates = async (
  layer: TextLayer,
  crop: ImageData,
  candidates: FontCandidate[],
) => {
  const collapsed = collapseCandidates([...candidates, ...SYSTEM_FACES]).slice(0, 14)
  registerDetectedFonts(collapsed)
  const target = inkMask(crop)
  const ranked: RankedFontCandidate[] = []
  for (const candidate of collapsed) {
    const rendered = await renderMask(
      layer.originalText || layer.text,
      candidate,
      crop.width,
      crop.height,
    )
    ranked.push({
      ...candidate,
      renderScore: maskIoU(target, rendered),
    })
  }
  return ranked.sort(
    (left, right) =>
      right.renderScore - left.renderScore || right.score - left.score,
  )
}

export const DEFAULT_OCR_FONT = 'Arial'

export const autoApplyDecision = (ranked: RankedFontCandidate[]) => {
  const winner = ranked[0]
  if (!winner) {
    return { apply: false, reason: 'no candidates' }
  }
  const arialScore =
    ranked.find((candidate) => candidate.family === DEFAULT_OCR_FONT)
      ?.renderScore ?? 0
  if (winner.family === DEFAULT_OCR_FONT || winner.renderScore <= arialScore) {
    return {
      apply: false,
      reason: `keep ${DEFAULT_OCR_FONT}; ${winner.family} ${winner.renderScore.toFixed(3)} <= ${arialScore.toFixed(3)}`,
    }
  }
  return {
    apply: true,
    reason: `${winner.family} ${winner.renderScore.toFixed(3)} > ${DEFAULT_OCR_FONT} ${arialScore.toFixed(3)}`,
  }
}

export const shouldAutoApplyFont = (ranked: RankedFontCandidate[]) =>
  autoApplyDecision(ranked).apply

