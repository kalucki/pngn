import type {
  DetectedText,
  NeuralInpaintModel,
  ProcessingOptions,
  ResolvedReconstructionMethod,
  TextLayer,
} from '../document/types'
import { inpaint, type InpaintMethod } from './inpaint'
import { neuralInpaint } from './inpaintClient'
import { defaultOcrFontSize } from '../fonts/ocrDefaults'
import {
  analyticalFillDisagreesWithRing,
  COMPLEX_RING_SPREAD,
  leftoverInkMask,
  predictBackground,
  segmentGlyphs,
  type GlyphSegmentation,
} from './segmentation'
import { groupLineIndices } from './inpaintGroups'

const COMPLEX_BACKGROUND_ENGINE: NeuralInpaintModel = 'lama'

export type ReconstructionResult = {
  clean: ImageData
  mask: ImageData
  layers: TextLayer[]
  maskedPixels: number
  segmentationMs: number
  inpaintMs: number
  inpaintModel: NeuralInpaintModel | null
  inpaintProvider: 'webgpu' | 'wasm' | null
}

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value))

const globalOffset = (x: number, y: number, width: number) =>
  (y * width + x) * 4

const NEURAL_METHODS: ReadonlySet<ResolvedReconstructionMethod> = new Set([
  'migan',
  'lama',
])

const chooseMethod = (
  requested: ProcessingOptions['method'],
  segmentation: GlyphSegmentation,
): ResolvedReconstructionMethod => {
  if (requested !== 'auto') return requested
  const { model } = segmentation
  if (model.ringSpread >= COMPLEX_RING_SPREAD) return COMPLEX_BACKGROUND_ENGINE
  // A thin ring around the glyph wins over the padded window: nearby artwork
  // must not force a neural pass when the letters themselves sit on a flat field.
  if (model.localVariance < 105) return 'flat'
  // Truly flat/gradient backgrounds are handled instantly and losslessly by the
  // analytical fills; there is no quality benefit to spending a neural pass.
  if (model.variance < 105 && model.fitError < 95) return 'flat'
  if (model.fitError < 185 && model.edgeDensity < 0.09) return 'gradient'
  return COMPLEX_BACKGROUND_ENGINE
}

type CropRegion = {
  bounds: { x: number; y: number; width: number; height: number }
  crop: ImageData
  mask: Uint8Array
}

const extractRegion = (
  image: ImageData,
  bounds: { x: number; y: number; width: number; height: number },
) => {
  const pixels = new Uint8ClampedArray(bounds.width * bounds.height * 4)
  for (let y = 0; y < bounds.height; y += 1) {
    const sourceStart = globalOffset(bounds.x, bounds.y + y, image.width)
    const sourceEnd = sourceStart + bounds.width * 4
    pixels.set(
      image.data.subarray(sourceStart, sourceEnd),
      y * bounds.width * 4,
    )
  }
  return new ImageData(pixels, bounds.width, bounds.height)
}

const extractCrop = (image: ImageData, segmentation: GlyphSegmentation) =>
  extractRegion(image, segmentation.bounds)

// A generous padded crop around the glyph bounds. Neural inpainters (and, to a
// lesser degree, the classical ones) reconstruct far better when they can see
// plenty of intact background context surrounding the hole.
const extractGroupContext = (
  image: ImageData,
  group: GlyphSegmentation[],
): CropRegion => {
  const padding = Math.max(
    ...group.map((segmentation) =>
      clamp(Math.round(segmentation.detection.bounds.height * 1.25), 24, 192),
    ),
  )
  let left = image.width
  let top = image.height
  let right = 0
  let bottom = 0
  for (const segmentation of group) {
    const { bounds } = segmentation
    left = Math.min(left, bounds.x)
    top = Math.min(top, bounds.y)
    right = Math.max(right, bounds.x + bounds.width)
    bottom = Math.max(bottom, bounds.y + bounds.height)
  }
  const x = clamp(left - padding, 0, image.width - 1)
  const y = clamp(top - padding, 0, image.height - 1)
  const contextBounds = {
    x,
    y,
    width: clamp(right + padding, x + 1, image.width) - x,
    height: clamp(bottom + padding, y + 1, image.height) - y,
  }
  const crop = extractRegion(image, contextBounds)
  const mask = new Uint8Array(contextBounds.width * contextBounds.height)
  for (const segmentation of group) {
    const dx = segmentation.bounds.x - contextBounds.x
    const dy = segmentation.bounds.y - contextBounds.y
    for (let localY = 0; localY < segmentation.height; localY += 1) {
      for (let localX = 0; localX < segmentation.width; localX += 1) {
        if (!segmentation.removalMask[localY * segmentation.width + localX]) {
          continue
        }
        mask[(localY + dy) * contextBounds.width + (localX + dx)] = 255
      }
    }
  }
  return { bounds: contextBounds, crop, mask }
}

const restoreMaskedRegion = (
  clean: ImageData,
  original: ImageData,
  segmentation: GlyphSegmentation,
) => {
  for (let y = 0; y < segmentation.height; y += 1) {
    for (let x = 0; x < segmentation.width; x += 1) {
      const local = y * segmentation.width + x
      if (!segmentation.removalMask[local]) continue
      const destination = globalOffset(
        segmentation.bounds.x + x,
        segmentation.bounds.y + y,
        clean.width,
      )
      clean.data[destination] = original.data[destination]
      clean.data[destination + 1] = original.data[destination + 1]
      clean.data[destination + 2] = original.data[destination + 2]
      clean.data[destination + 3] = original.data[destination + 3]
    }
  }
}

const applyAnalyticalFill = (
  clean: ImageData,
  segmentation: GlyphSegmentation,
  method: 'flat' | 'gradient',
) => {
  for (let y = 0; y < segmentation.height; y += 1) {
    for (let x = 0; x < segmentation.width; x += 1) {
      const local = y * segmentation.width + x
      if (!segmentation.removalMask[local]) continue
      const globalX = segmentation.bounds.x + x
      const globalY = segmentation.bounds.y + y
      const color =
        method === 'flat'
          ? segmentation.model.flatColor
          : predictBackground(segmentation.model, globalX, globalY)
      const destination = globalOffset(globalX, globalY, clean.width)
      clean.data[destination] = color[0]
      clean.data[destination + 1] = color[1]
      clean.data[destination + 2] = color[2]
    }
  }
}

// Inner-distance alpha ramp: 1.0 deep inside the hole, tapering toward the mask
// boundary. This blends the reconstructed pixels into the surrounding image so
// there is no hard seam, while never touching a pixel outside the removal mask
// (so untouched source pixels stay bit-identical).
const featherAlpha = (
  mask: Uint8Array,
  width: number,
  height: number,
  feather: number,
) => {
  const alpha = new Float32Array(mask.length)
  if (feather <= 0) {
    for (let index = 0; index < mask.length; index += 1) {
      alpha[index] = mask[index] ? 1 : 0
    }
    return alpha
  }
  const distance = new Int32Array(mask.length).fill(-1)
  const queue = new Int32Array(mask.length)
  let read = 0
  let write = 0
  const horizontal = [-1, 1]
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x
      if (!mask[index]) continue
      let boundary =
        y === 0 ||
        y === height - 1 ||
        x === 0 ||
        x === width - 1 ||
        !mask[index - width] ||
        !mask[index + width]
      if (!boundary) {
        for (const delta of horizontal) {
          if (!mask[index + delta]) {
            boundary = true
            break
          }
        }
      }
      if (boundary) {
        distance[index] = 1
        queue[write] = index
        write += 1
      }
    }
  }
  const neighbors = [-width, width, -1, 1]
  while (read < write) {
    const current = queue[read]
    read += 1
    const currentX = current % width
    const next = distance[current] + 1
    for (const delta of neighbors) {
      const candidate = current + delta
      if (candidate < 0 || candidate >= mask.length) continue
      if (
        (delta === -1 || delta === 1) &&
        Math.abs((candidate % width) - currentX) !== 1
      ) {
        continue
      }
      if (!mask[candidate] || distance[candidate] !== -1) continue
      distance[candidate] = next
      queue[write] = candidate
      write += 1
    }
  }
  const span = feather + 1
  for (let index = 0; index < mask.length; index += 1) {
    if (!mask[index]) {
      alpha[index] = 0
      continue
    }
    const value = distance[index] < 0 ? span : distance[index]
    // Keep the hole mostly inpaint even at the boundary so thin glyphs do not
    // ghost through a 1-3px inner-distance ramp.
    alpha[index] = clamp(Math.max(value / span, 0.75), 0, 1)
  }
  return alpha
}

const compositeFeathered = (
  clean: ImageData,
  restored: ImageData,
  bounds: { x: number; y: number; width: number; height: number },
  mask: Uint8Array,
  alpha: Float32Array,
) => {
  for (let y = 0; y < bounds.height; y += 1) {
    for (let x = 0; x < bounds.width; x += 1) {
      const local = y * bounds.width + x
      if (!mask[local]) continue
      const weight = alpha[local]
      if (weight <= 0) continue
      const source = local * 4
      const destination = globalOffset(bounds.x + x, bounds.y + y, clean.width)
      const inverse = 1 - weight
      clean.data[destination] = Math.round(
        clean.data[destination] * inverse + restored.data[source] * weight,
      )
      clean.data[destination + 1] = Math.round(
        clean.data[destination + 1] * inverse +
          restored.data[source + 1] * weight,
      )
      clean.data[destination + 2] = Math.round(
        clean.data[destination + 2] * inverse +
          restored.data[source + 2] * weight,
      )
    }
  }
}

const reconstructionConfidence = (
  segmentation: GlyphSegmentation,
  method: ResolvedReconstructionMethod,
) => {
  const { model } = segmentation
  if (method === 'flat') {
    return clamp(1 - model.variance / 950, 0.45, 0.99)
  }
  if (method === 'gradient') {
    return clamp(1 - model.fitError / 1100, 0.42, 0.98)
  }
  if (method === 'lama') {
    return clamp(0.94 - model.edgeDensity * 0.4, 0.6, 0.94)
  }
  if (method === 'migan') {
    return clamp(0.9 - model.edgeDensity * 0.45, 0.55, 0.9)
  }
  if (method === 'navier-stokes') {
    return clamp(0.82 - model.edgeDensity * 0.8, 0.45, 0.82)
  }
  if (method === 'patch') {
    return clamp(0.79 - model.edgeDensity * 0.45, 0.48, 0.79)
  }
  return clamp(0.78 - model.edgeDensity * 0.55, 0.45, 0.78)
}

const backgroundTypeFor = (
  segmentation: GlyphSegmentation,
): TextLayer['processing']['backgroundType'] => {
  const { model } = segmentation
  if (model.ringSpread >= COMPLEX_RING_SPREAD) return 'complex'
  if (model.localVariance < 105) return 'flat'
  if (model.variance < 105 && model.fitError < 95) return 'flat'
  if (model.fitError < 185 && model.edgeDensity < 0.09) return 'gradient'
  return 'complex'
}

const createLayer = (
  segmentation: GlyphSegmentation,
  method: ResolvedReconstructionMethod,
  index: number,
): TextLayer => {
  const { detection } = segmentation
  const { bounds } = detection
  return {
    id: `text-${index}-${Math.round(bounds.x)}-${Math.round(bounds.y)}`,
    originalText: detection.text,
    text: detection.text,
    bounds: { ...bounds },
    removal: {
      bounds: { ...segmentation.bounds },
      mask: new Uint8Array(segmentation.removalMask),
    },
    polygon: [
      { x: bounds.x, y: bounds.y },
      { x: bounds.x + bounds.width, y: bounds.y },
      { x: bounds.x + bounds.width, y: bounds.y + bounds.height },
      { x: bounds.x, y: bounds.y + bounds.height },
    ],
    rotation: 0,
    typography: {
      fontFamily: 'Arial',
      fontSize: defaultOcrFontSize(bounds.height),
      fontWeight: 700,
      color: segmentation.textColor,
      strokeColor: '#000000',
      strokeWidth: 0,
      letterSpacing: 0,
      lineHeight: 1,
      alignment: 'left',
    },
    effects: { opacity: 1 },
    processing: {
      recognitionConfidence: detection.confidence,
      maskConfidence: segmentation.confidence,
      reconstructionConfidence: reconstructionConfidence(segmentation, method),
      reconstructionMethod: method,
      backgroundType: backgroundTypeFor(segmentation),
    },
  }
}

const featherRadius = (segmentation: GlyphSegmentation) =>
  clamp(Math.round(segmentation.detection.bounds.height * 0.06), 1, 3)

const absorbLeftoverInk = (
  image: ImageData,
  group: GlyphSegmentation[],
) => {
  let added = 0
  for (const segmentation of group) {
    const extra = leftoverInkMask(image, segmentation)
    for (let index = 0; index < extra.length; index += 1) {
      if (!extra[index] || segmentation.removalMask[index]) continue
      segmentation.removalMask[index] = 255
      added += 1
    }
  }
  return added
}

const writeGlobalMask = (
  globalMask: Uint8Array,
  imageWidth: number,
  group: GlyphSegmentation[],
) => {
  for (const segmentation of group) {
    for (let y = 0; y < segmentation.height; y += 1) {
      for (let x = 0; x < segmentation.width; x += 1) {
        if (!segmentation.removalMask[y * segmentation.width + x]) continue
        const globalX = segmentation.bounds.x + x
        const globalY = segmentation.bounds.y + y
        globalMask[globalY * imageWidth + globalX] = 255
      }
    }
  }
}

const paintNeuralGroup = async (
  clean: ImageData,
  group: GlyphSegmentation[],
  method: NeuralInpaintModel,
) => {
  const radius = clamp(
    Math.round(
      Math.max(
        ...group.map((segmentation) => segmentation.detection.bounds.height),
      ) * 0.12,
    ),
    2,
    12,
  )
  const feather = Math.max(...group.map(featherRadius))
  const context = extractGroupContext(clean, group)
  let restored: ImageData
  let provider: 'webgpu' | 'wasm' | null = null
  let usedModel: NeuralInpaintModel | null = method
  try {
    const result = await neuralInpaint(
      context.crop,
      context.mask,
      method,
    )
    restored = result.image
    provider = result.provider
  } catch (error) {
    console.warn(
      `Neural inpaint (${method}) failed; falling back to Telea.`,
      error,
    )
    restored = await inpaint(context.crop, context.mask, 'telea', radius)
    usedModel = null
  }
  const alpha = featherAlpha(
    context.mask,
    context.bounds.width,
    context.bounds.height,
    feather,
  )
  compositeFeathered(clean, restored, context.bounds, context.mask, alpha)
  return { model: usedModel, provider }
}

export const reconstructTextRegions = async (
  original: ImageData,
  detections: DetectedText[],
  options: ProcessingOptions,
): Promise<ReconstructionResult> => {
  const clean = new ImageData(
    new Uint8ClampedArray(original.data),
    original.width,
    original.height,
  )
  const globalMask = new Uint8Array(original.width * original.height)
  const segmentationStartedAt = performance.now()
  const segmentations = detections.map((detection) =>
    segmentGlyphs(original, detection, options),
  )
  const segmentationMs = performance.now() - segmentationStartedAt
  const methods = segmentations.map((segmentation) =>
    chooseMethod(options.method, segmentation),
  )

  let inpaintModel: NeuralInpaintModel | null = null
  let inpaintProvider: 'webgpu' | 'wasm' | null = null

  const inpaintStartedAt = performance.now()
  const pendingNeural: number[] = []
  for (let index = 0; index < segmentations.length; index += 1) {
    const segmentation = segmentations[index]
    let method = methods[index]
    if (method === 'flat' || method === 'gradient') {
      applyAnalyticalFill(clean, segmentation, method)
      if (
        options.method === 'auto' &&
        analyticalFillDisagreesWithRing(clean, segmentation)
      ) {
        restoreMaskedRegion(clean, original, segmentation)
        method = COMPLEX_BACKGROUND_ENGINE
        methods[index] = method
      } else {
        continue
      }
    }

    if (NEURAL_METHODS.has(method)) {
      pendingNeural.push(index)
      continue
    }

    const radius = clamp(
      Math.round(segmentation.detection.bounds.height * 0.12),
      2,
      12,
    )
    const crop = extractCrop(clean, segmentation)
    const restored = await inpaint(
      crop,
      segmentation.removalMask,
      method as InpaintMethod,
      radius,
    )
    const alpha = featherAlpha(
      segmentation.removalMask,
      segmentation.width,
      segmentation.height,
      featherRadius(segmentation),
    )
    compositeFeathered(
      clean,
      restored,
      segmentation.bounds,
      segmentation.removalMask,
      alpha,
    )
  }

  const neuralGroups = groupLineIndices(
    pendingNeural.map((index) => segmentations[index].detection.bounds),
  )
  for (const localGroup of neuralGroups) {
    const indices = localGroup.map((local) => pendingNeural[local])
    const group = indices.map((index) => segmentations[index])
    absorbLeftoverInk(original, group)
    const method = methods[indices[0]] as NeuralInpaintModel
    const first = await paintNeuralGroup(clean, group, method)
    if (first.model) inpaintModel = first.model
    if (first.provider) inpaintProvider = first.provider
    if (absorbLeftoverInk(original, group) >= 6) {
      const second = await paintNeuralGroup(clean, group, method)
      if (second.model) inpaintModel = second.model
      if (second.provider) inpaintProvider = second.provider
    }
  }
  writeGlobalMask(globalMask, original.width, segmentations)
  const inpaintMs = performance.now() - inpaintStartedAt

  const maskPixels = new Uint8ClampedArray(original.width * original.height * 4)
  let maskedPixels = 0
  for (let pixel = 0; pixel < globalMask.length; pixel += 1) {
    const value = globalMask[pixel]
    const destination = pixel * 4
    maskPixels[destination] = value
    maskPixels[destination + 1] = value
    maskPixels[destination + 2] = value
    maskPixels[destination + 3] = value
    if (value) maskedPixels += 1
  }

  return {
    clean,
    mask: new ImageData(maskPixels, original.width, original.height),
    layers: segmentations.map((segmentation, index) =>
      createLayer(segmentation, methods[index], index),
    ),
    maskedPixels,
    segmentationMs,
    inpaintMs,
    inpaintModel,
    inpaintProvider,
  }
}
