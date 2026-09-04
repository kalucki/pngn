import type { TextLayer } from '../document/types'
import { fontByFamily, nearestWeight, registerDetectedFonts } from '../editor/fonts'
import { fitFontSizeToBounds } from './fitFontSize'
import { identifyFont } from './fontIdClient'
import { defaultOcrFontSize } from './ocrDefaults'
import {
  autoApplyDecision,
  DEFAULT_OCR_FONT,
  rerankFontCandidates,
} from './rerankFont'
import type { FontCandidate } from './storiaLabels'

const DEFAULT_OCR_WEIGHT = 700
const LOG = '[pngn font]'
const MIN_MATCH_HEIGHT = 4
const MIN_MATCH_CROP_HEIGHT = 64
const MAX_MATCH_CROP_SIDE = 960
const MAX_MATCH_CROP_SCALE = 12

const formatCandidate = (candidate: FontCandidate & { renderScore?: number }) => {
  const score = candidate.renderScore ?? candidate.score
  const italic = candidate.italic ? ' italic' : ''
  return `${candidate.family} ${candidate.weight}${italic} (${score.toFixed(3)})`
}

export const cropScaleFor = (width: number, height: number) => {
  const heightScale = MIN_MATCH_CROP_HEIGHT / Math.max(1, height)
  const sideScale = MAX_MATCH_CROP_SIDE / Math.max(1, width, height)
  return Math.max(1, Math.min(MAX_MATCH_CROP_SCALE, heightScale, sideScale))
}

const skipReason = (layer: TextLayer) => {
  const text = layer.originalText.trim()
  const letterCount = [...text].filter((char) => /\p{L}|\p{N}/u.test(char)).length
  if (layer.processing.recognitionConfidence < 0.5) {
    return `OCR confidence ${layer.processing.recognitionConfidence.toFixed(2)} < 0.5`
  }
  if (letterCount < 3) return `only ${letterCount} letters`
  if (layer.bounds.height < MIN_MATCH_HEIGHT) {
    return `height ${layer.bounds.height.toFixed(1)}px < ${MIN_MATCH_HEIGHT}`
  }
  return null
}

export const isDefaultOcrFont = (layer: TextLayer) =>
  layer.typography.fontFamily === DEFAULT_OCR_FONT &&
  layer.typography.fontWeight === DEFAULT_OCR_WEIGHT

export const isDefaultOcrSize = (layer: TextLayer) =>
  Math.abs(layer.typography.fontSize - defaultOcrFontSize(layer.bounds.height)) <
  0.05

export const isDefaultOcrTypography = (layer: TextLayer) =>
  isDefaultOcrFont(layer) && isDefaultOcrSize(layer)

export const isViableFontMatchLayer = (layer: TextLayer) => skipReason(layer) === null

const attachMatch = (
  layer: TextLayer,
  fontMatch: NonNullable<TextLayer['fontMatch']>,
): TextLayer => ({
  ...layer,
  fontMatch: layer.fontMatch?.requestId
    ? { ...fontMatch, requestId: layer.fontMatch.requestId }
    : fontMatch,
})

export const mergeMatchedFontLayer = (current: TextLayer, matched: TextLayer) => {
  if (current.id !== matched.id) return current
  const currentRequest = current.fontMatch?.requestId
  const matchedRequest = matched.fontMatch?.requestId
  if (currentRequest && matchedRequest && currentRequest !== matchedRequest) {
    return current
  }
  const pending = current.fontMatch?.status === 'pending'
  if (pending && !isDefaultOcrFont(current)) {
    return { ...current, fontMatch: matched.fontMatch }
  }
  if (pending && !isDefaultOcrSize(current)) {
    return {
      ...matched,
      typography: {
        ...matched.typography,
        fontSize: current.typography.fontSize,
      },
    }
  }
  return matched
}

const cropLayer = (bitmap: ImageBitmap, layer: TextLayer) => {
  const pad = Math.max(3, Math.round(layer.bounds.height * 0.28))
  const x = Math.max(0, Math.floor(layer.bounds.x - pad))
  const y = Math.max(0, Math.floor(layer.bounds.y - pad))
  const right = Math.min(bitmap.width, Math.ceil(layer.bounds.x + layer.bounds.width + pad))
  const bottom = Math.min(bitmap.height, Math.ceil(layer.bounds.y + layer.bounds.height + pad))
  const width = Math.max(1, right - x)
  const height = Math.max(1, bottom - y)
  const scale = cropScaleFor(width, height)
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(width * scale))
  canvas.height = Math.max(1, Math.round(height * scale))
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) throw new Error('Canvas 2D is unavailable in this browser.')
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.drawImage(
    bitmap,
    x,
    y,
    width,
    height,
    0,
    0,
    canvas.width,
    canvas.height,
  )
  return context.getImageData(0, 0, canvas.width, canvas.height)
}

const applyBestCandidate = (layer: TextLayer, family: string, weight: number) => {
  const font = fontByFamily(family)
  return {
    ...layer,
    typography: {
      ...layer.typography,
      fontFamily: family,
      fontWeight: font ? nearestWeight(font.weights, weight) : weight,
    },
  }
}

const withFittedSize = async (layer: TextLayer) => {
  const fontSize = await fitFontSizeToBounds({
    text: layer.originalText || layer.text,
    fontFamily: layer.typography.fontFamily,
    fontWeight: layer.typography.fontWeight,
    bounds: layer.bounds,
  })
  if (Math.abs(fontSize - layer.typography.fontSize) < 0.05) return layer
  console.info(
    LOG,
    `fit size "${layer.originalText.slice(0, 48)}" ${layer.typography.fontSize.toFixed(1)} → ${fontSize.toFixed(1)}`,
  )
  return {
    ...layer,
    typography: { ...layer.typography, fontSize },
  }
}

const matchLayer = async (bitmap: ImageBitmap, layer: TextLayer) => {
  const label = `"${layer.originalText.slice(0, 48)}"`
  const skipped = skipReason(layer)
  if (skipped) {
    console.info(LOG, `skip ${label}: ${skipped} — keeping ${layer.typography.fontFamily}`)
    return withFittedSize(
      attachMatch(layer, {
        family: layer.typography.fontFamily,
        weight: layer.typography.fontWeight,
        italic: false,
        score: 0,
        status: 'skipped',
        similar: [],
      }),
    )
  }

  try {
    const crop = cropLayer(bitmap, layer)
    console.info(
      LOG,
      `matching ${label} crop ${crop.width}×${crop.height} from ${layer.bounds.width.toFixed(1)}×${layer.bounds.height.toFixed(1)} OCR ${layer.processing.recognitionConfidence.toFixed(2)}`,
    )
    const modelCandidates = await identifyFont(crop, 10)
    console.info(
      LOG,
      `Storia top for ${label}:`,
      modelCandidates.slice(0, 5).map(formatCandidate),
    )
    registerDetectedFonts(modelCandidates)
    const ranked = await rerankFontCandidates(layer, crop, modelCandidates)
    console.info(
      LOG,
      `rerank top for ${label}:`,
      ranked.slice(0, 5).map(formatCandidate),
    )
    const best = ranked[0]
    if (!best) throw new Error('No font candidates returned.')
    const similar = ranked
      .slice(1, 6)
      .map((candidate) => ({
        family: candidate.family,
        weight: candidate.weight,
      }))
    const matched = attachMatch(layer, {
      family: best.family,
      weight: best.weight,
      italic: best.italic,
      score: best.renderScore || best.score,
      status: 'ready',
      similar,
    })
    const decision = autoApplyDecision(ranked)
    if (isDefaultOcrFont(layer) && decision.apply) {
      console.info(
        LOG,
        `auto-apply ${label}: ${formatCandidate(best)} — ${decision.reason}`,
      )
      return withFittedSize(applyBestCandidate(matched, best.family, best.weight))
    }
    console.info(
      LOG,
      `keep ${layer.typography.fontFamily} for ${label}; suggested ${formatCandidate(best)} — ${decision.reason}`,
    )
    return withFittedSize(matched)
  } catch (error) {
    console.warn(LOG, `failed ${label}:`, error)
    return withFittedSize(
      attachMatch(layer, {
        family: layer.typography.fontFamily,
        weight: layer.typography.fontWeight,
        italic: false,
        score: 0,
        status: 'error',
        similar: [],
      }),
    )
  }
}

export const markPendingFontMatches = (layers: TextLayer[]) =>
  layers.map((layer) =>
    isViableFontMatchLayer(layer)
      ? {
          ...layer,
          fontMatch: {
            family: layer.typography.fontFamily,
            weight: layer.typography.fontWeight,
            italic: false,
            score: 0,
            status: 'pending' as const,
            requestId: crypto.randomUUID(),
            similar: [],
          },
        }
      : layer,
  )

export const matchTextLayerFonts = async (
  file: File,
  layers: TextLayer[],
  onLayer?: (layer: TextLayer) => void,
) => {
  console.info(LOG, `start matching ${layers.length} layer(s)`)
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  try {
    const matched: TextLayer[] = []
    for (const layer of layers) {
      const next = await matchLayer(bitmap, layer)
      matched.push(next)
      onLayer?.(next)
    }
    return matched
  } finally {
    bitmap.close()
  }
}

