import type { Bounds, LayerRemoval, TextLayer } from '../document/types'
import {
  applyCanvasLetterSpacing,
  canvasFont,
  ensureFont,
  FONT_CATALOG,
  fontByFamily,
  isFontFailed,
  nearestWeight,
  registerDetectedFonts,
} from '../editor/fonts'
import {
  collapseCandidates,
  type FontCandidate,
} from './storiaLabels'

export type RankedFontCandidate = FontCandidate & {
  renderScore: number
  iou?: number
  edgeScore?: number
  letterSpacing?: number
}

export type FontMatchCrop = {
  image: ImageData
  x: number
  y: number
  sourceWidth: number
  sourceHeight: number
}

export const DEFAULT_OCR_FONT = 'Arial'

const MODEL_RERANK_CAP = 12
const MIN_GLYPH_INK = 4
const MIN_GLYPH_INK_RATIO = 0.002
const WEIGHT_NEIGHBOR_RANGE = 200
const WEIGHT_NEIGHBOR_LIMIT = 2
const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value))

const systemFacesFor = (weight: number, italic: boolean): FontCandidate[] =>
  FONT_CATALOG.filter((font) => font.source === 'system').map((font) => ({
    family: font.family,
    weight: nearestWeight(font.weights, weight),
    italic,
    score: 0.05,
  }))

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

export const otsuThreshold = (luminance: Float32Array) => {
  const hist = new Float32Array(256)
  for (const value of luminance) {
    hist[Math.max(0, Math.min(255, Math.round(value)))] += 1
  }
  const total = luminance.length
  let sum = 0
  for (let bin = 0; bin < 256; bin += 1) {
    sum += bin * hist[bin]
  }
  let sumBackground = 0
  let weightBackground = 0
  let bestVariance = -1
  let threshold = 127
  for (let bin = 0; bin < 256; bin += 1) {
    weightBackground += hist[bin]
    if (weightBackground === 0) continue
    const weightForeground = total - weightBackground
    if (weightForeground === 0) break
    sumBackground += bin * hist[bin]
    const meanBackground = sumBackground / weightBackground
    const meanForeground = (sum - sumBackground) / weightForeground
    const variance =
      weightBackground * weightForeground * (meanBackground - meanForeground) ** 2
    if (variance >= bestVariance) {
      bestVariance = variance
      threshold = bin
    }
  }
  return threshold
}

export const inkMask = (image: ImageData) => {
  const plane = image.width * image.height
  const luminance = new Float32Array(plane)
  let sum = 0
  for (let index = 0; index < plane; index += 1) {
    const offset = index * 4
    const value =
      image.data[offset] * 0.2126 +
      image.data[offset + 1] * 0.7152 +
      image.data[offset + 2] * 0.0722
    luminance[index] = value
    sum += value
  }
  const mean = sum / plane
  const threshold = otsuThreshold(luminance)
  const darkInk = mean >= threshold
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

export const inkBounds = (
  mask: Uint8Array,
  width: number,
  height: number,
): Bounds | null => {
  let minX = width
  let minY = height
  let maxX = -1
  let maxY = -1
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (!mask[y * width + x]) continue
      minX = Math.min(minX, x)
      minY = Math.min(minY, y)
      maxX = Math.max(maxX, x)
      maxY = Math.max(maxY, y)
    }
  }
  if (maxX < 0) return null
  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  }
}

export const cropImageData = (image: ImageData, box: Bounds) => {
  const x = clamp(Math.floor(box.x), 0, image.width - 1)
  const y = clamp(Math.floor(box.y), 0, image.height - 1)
  const width = clamp(Math.ceil(box.width), 1, image.width - x)
  const height = clamp(Math.ceil(box.height), 1, image.height - y)
  if (x === 0 && y === 0 && width === image.width && height === image.height) {
    return image
  }
  const cropped = new ImageData(width, height)
  for (let row = 0; row < height; row += 1) {
    const source = ((y + row) * image.width + x) * 4
    cropped.data.set(
      image.data.subarray(source, source + width * 4),
      row * width * 4,
    )
  }
  return cropped
}

export const tightenToInk = (image: ImageData) => {
  const box = inkBounds(inkMask(image), image.width, image.height)
  if (!box) return image
  const area = image.width * image.height
  const inkArea = box.width * box.height
  if (inkArea < area * 0.04 || inkArea > area * 0.92) return image
  const pad = Math.max(2, Math.round(Math.max(box.width, box.height) * 0.08))
  return cropImageData(image, {
    x: Math.max(0, box.x - pad),
    y: Math.max(0, box.y - pad),
    width: Math.min(image.width - Math.max(0, box.x - pad), box.width + pad * 2),
    height: Math.min(
      image.height - Math.max(0, box.y - pad),
      box.height + pad * 2,
    ),
  })
}

export const edgeMask = (mask: Uint8Array, width: number, height: number) => {
  const edges = new Uint8Array(mask.length)
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x
      if (!mask[index]) continue
      if (
        x === 0 ||
        y === 0 ||
        x === width - 1 ||
        y === height - 1 ||
        !mask[index - 1] ||
        !mask[index + 1] ||
        !mask[index - width] ||
        !mask[index + width]
      ) {
        edges[index] = 1
      }
    }
  }
  return edges
}

export const maskIoU = (left: Uint8Array, right: Uint8Array) => {
  let intersection = 0
  let union = 0
  const length = Math.min(left.length, right.length)
  for (let index = 0; index < length; index += 1) {
    if (left[index] && right[index]) intersection += 1
    if (left[index] || right[index]) union += 1
  }
  return union > 0 ? intersection / union : 0
}

export const combinedRenderScore = (
  iou: number,
  edgeScore: number,
  modelScore: number,
) => 0.55 * iou + 0.25 * edgeScore + 0.2 * modelScore

export const maskInkCount = (mask: Uint8Array) => {
  let count = 0
  for (const bit of mask) {
    if (bit) count += 1
  }
  return count
}

export const removalInkWidth = (removal: LayerRemoval) => {
  const width = Math.max(1, Math.round(removal.bounds.width))
  const height = Math.max(1, Math.round(removal.mask.length / width))
  return inkBounds(removal.mask, width, height)?.width ?? 0
}

export const sampleRemovalMask = (
  removal: LayerRemoval,
  crop: {
    x: number
    y: number
    sourceWidth: number
    sourceHeight: number
    width: number
    height: number
  },
) => {
  const mask = new Uint8Array(crop.width * crop.height)
  if (
    removal.mask.length === 0 ||
    removal.bounds.width < 1 ||
    removal.bounds.height < 1
  ) {
    return mask
  }
  const scaleX = crop.sourceWidth / Math.max(1, crop.width)
  const scaleY = crop.sourceHeight / Math.max(1, crop.height)
  for (let y = 0; y < crop.height; y += 1) {
    const sourceY = crop.y + (y + 0.5) * scaleY
    const localY = Math.floor(sourceY - removal.bounds.y)
    if (localY < 0 || localY >= removal.bounds.height) continue
    for (let x = 0; x < crop.width; x += 1) {
      const sourceX = crop.x + (x + 0.5) * scaleX
      const localX = Math.floor(sourceX - removal.bounds.x)
      if (localX < 0 || localX >= removal.bounds.width) continue
      if (removal.mask[localY * removal.bounds.width + localX]) {
        mask[y * crop.width + x] = 1
      }
    }
  }
  return mask
}

export const targetInkMask = (layer: TextLayer, crop: FontMatchCrop) => {
  const sampled = sampleRemovalMask(layer.removal, {
    x: crop.x,
    y: crop.y,
    sourceWidth: crop.sourceWidth,
    sourceHeight: crop.sourceHeight,
    width: crop.image.width,
    height: crop.image.height,
  })
  const minInk = Math.max(
    MIN_GLYPH_INK,
    Math.round(sampled.length * MIN_GLYPH_INK_RATIO),
  )
  if (maskInkCount(sampled) >= minInk) return sampled
  return inkMask(crop.image)
}

export const neighborWeights = (weights: number[], weight: number) => {
  if (weights.length === 0) return [weight]
  const nearest = nearestWeight(weights, weight)
  const extras = weights
    .filter(
      (candidate) =>
        candidate !== nearest &&
        Math.abs(candidate - nearest) <= WEIGHT_NEIGHBOR_RANGE,
    )
    .sort(
      (left, right) =>
        Math.abs(left - nearest) - Math.abs(right - nearest) || left - right,
    )
    .slice(0, WEIGHT_NEIGHBOR_LIMIT)
  return [nearest, ...extras]
}

export const spacingGapsFor = (text: string) => {
  let longest = 0
  for (const line of text.split('\n')) {
    longest = Math.max(longest, [...line].length)
  }
  return Math.max(1, longest - 1)
}

export const letterSpacingForWidth = (
  targetWidth: number,
  renderedWidth: number,
  gaps: number,
  maxAbs: number,
) =>
  clamp((targetWidth - renderedWidth) / Math.max(1, gaps), -maxAbs, maxAbs)

export const letterSpacingToLayer = (spacing: number, cropScale: number) =>
  cropScale <= 0 ? spacing : spacing / cropScale

const inkExtent = (
  metrics: TextMetrics,
  fontSize: number,
  lineCount: number,
) => {
  const width =
    (metrics.actualBoundingBoxLeft ?? 0) + (metrics.actualBoundingBoxRight ?? 0)
  const lineHeight =
    (metrics.actualBoundingBoxAscent ?? 0) +
    (metrics.actualBoundingBoxDescent ?? 0)
  return {
    width: width > 1 ? width : Math.max(metrics.width, 1),
    height: lineHeight > 1 ? lineHeight * lineCount : fontSize * 0.72 * lineCount,
    left: metrics.actualBoundingBoxLeft ?? 0,
    ascent: metrics.actualBoundingBoxAscent ?? fontSize * 0.8,
  }
}

const renderMask = async (
  text: string,
  candidate: FontCandidate,
  width: number,
  height: number,
  target: Bounds,
  letterSpacing = 0,
): Promise<{ mask: Uint8Array; fontSize: number } | null> => {
  const font = fontByFamily(candidate.family)
  const weight = font ? nearestWeight(font.weights, candidate.weight) : candidate.weight
  try {
    await withTimeout(
      ensureFont(candidate.family, weight, { italic: candidate.italic }),
      8000,
      `Timed out loading ${candidate.family}`,
    )
  } catch {
    return null
  }
  if (isFontFailed(candidate.family, weight, candidate.italic)) return null
  const canvas = createCanvas(width, height)
  const context = contextFor(canvas)
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, width, height)
  context.fillStyle = '#000000'
  context.textAlign = 'left'
  context.textBaseline = 'alphabetic'
  applyCanvasLetterSpacing(context, letterSpacing)

  const lines = (text || ' ').split('\n')
  let fontSize = clamp(target.height / Math.max(1, lines.length) / 0.72, 6, 600)
  for (let attempt = 0; attempt < 6; attempt += 1) {
    context.font = canvasFont(
      weight,
      fontSize,
      candidate.family,
      candidate.italic,
    )
    const extent = inkExtent(context.measureText(lines[0] ?? ''), fontSize, 1)
    if (extent.height < 1) break
    const next = fontSize * (target.height / Math.max(1, lines.length) / extent.height)
    if (Math.abs(next - fontSize) < 0.25) break
    fontSize = clamp(next, 6, 600)
  }

  context.font = canvasFont(
    weight,
    fontSize,
    candidate.family,
    candidate.italic,
  )
  const lineHeight = target.height / Math.max(1, lines.length)
  lines.forEach((line, lineIndex) => {
    const extent = inkExtent(context.measureText(line), fontSize, 1)
    const x = target.x + extent.left
    const y = target.y + lineIndex * lineHeight + extent.ascent
    context.fillText(line, x, y)
  })

  const image = context.getImageData(0, 0, width, height)
  const mask = new Uint8Array(width * height)
  for (let index = 0; index < mask.length; index += 1) {
    mask[index] = image.data[index * 4] < 192 ? 1 : 0
  }
  return { mask, fontSize }
}

const expandNeighborWeights = (candidates: FontCandidate[]) => {
  const expanded: FontCandidate[] = []
  for (const candidate of candidates) {
    const font = fontByFamily(candidate.family)
    const weights = font
      ? neighborWeights(font.weights, candidate.weight)
      : [candidate.weight]
    for (const weight of weights) {
      expanded.push({ ...candidate, weight })
    }
  }
  return collapseCandidates(expanded)
}

const rerankPool = (candidates: FontCandidate[]) => {
  const model = expandNeighborWeights(
    collapseCandidates(candidates).slice(0, MODEL_RERANK_CAP),
  )
  const seed = model[0]
  const extras = systemFacesFor(seed?.weight ?? 700, seed?.italic ?? false)
  const pooled = collapseCandidates([...model, ...extras])
  if (pooled.some((candidate) => candidate.family === DEFAULT_OCR_FONT)) {
    return pooled
  }
  return [
    ...pooled,
    {
      family: DEFAULT_OCR_FONT,
      weight: seed?.weight ?? 700,
      italic: seed?.italic ?? false,
      score: 0.05,
    },
  ]
}

const scoreRendered = (
  candidate: FontCandidate,
  rendered: Uint8Array,
  target: Uint8Array,
  targetEdges: Uint8Array,
  width: number,
  height: number,
  letterSpacing: number,
): RankedFontCandidate => {
  const iou = maskIoU(target, rendered)
  const edgeScore = maskIoU(
    targetEdges,
    edgeMask(rendered, width, height),
  )
  return {
    ...candidate,
    iou,
    edgeScore,
    letterSpacing,
    renderScore: combinedRenderScore(iou, edgeScore, candidate.score),
  }
}

export const rerankFontCandidates = async (
  layer: TextLayer,
  crop: FontMatchCrop,
  candidates: FontCandidate[],
) => {
  const collapsed = rerankPool(candidates)
  registerDetectedFonts(collapsed)
  const target = targetInkMask(layer, crop)
  const width = crop.image.width
  const height = crop.image.height
  const targetBox =
    inkBounds(target, width, height) ?? {
      x: 0,
      y: 0,
      width,
      height,
    }
  const targetEdges = edgeMask(target, width, height)
  const text = layer.originalText || layer.text
  const scored: RankedFontCandidate[] = []
  for (const entry of await Promise.all(
    collapsed.map(async (candidate) => {
      const rendered = await renderMask(
        text,
        candidate,
        width,
        height,
        targetBox,
      )
      if (!rendered) return null
      const first = scoreRendered(
        candidate,
        rendered.mask,
        target,
        targetEdges,
        width,
        height,
        0,
      )
      return first
    }),
  )) {
    if (entry) scored.push(entry)
  }
  return scored.sort(
    (left, right) =>
      right.renderScore - left.renderScore || right.score - left.score,
  )
}

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
