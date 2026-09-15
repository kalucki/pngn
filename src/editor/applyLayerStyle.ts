import type { TextLayer } from '../document/types'
import { defaultStrokeWidth } from './drawTextLayer'
import { fontByFamily, nearestWeight } from './fonts'
import { withTextSizeBounds } from './textLayerBounds'

export type LayerStylePatch = {
  typography?: Partial<TextLayer['typography']>
  effects?: Partial<TextLayer['effects']>
}

export const applyLayerStylePatch = (
  layer: TextLayer,
  patch: LayerStylePatch,
): TextLayer => {
  const typography = patch.typography
    ? applyTypographyPatch(layer, patch.typography)
    : layer.typography
  const effects = patch.effects
    ? { ...layer.effects, ...patch.effects }
    : layer.effects
  if (typography === layer.typography && effects === layer.effects) {
    return layer
  }
  return withTextSizeBounds({ ...layer, typography, effects })
}

const applyTypographyPatch = (
  layer: TextLayer,
  patch: Partial<TextLayer['typography']>,
): TextLayer['typography'] => {
  const next = { ...layer.typography, ...patch }

  if (patch.fontFamily !== undefined) {
    const font = fontByFamily(patch.fontFamily)
    const requestedWeight = patch.fontWeight ?? layer.typography.fontWeight
    next.fontWeight = font
      ? nearestWeight(font.weights, requestedWeight)
      : requestedWeight
  } else if (patch.fontWeight !== undefined) {
    const font = fontByFamily(next.fontFamily)
    next.fontWeight = font
      ? nearestWeight(font.weights, patch.fontWeight)
      : patch.fontWeight
  }

  if (patch.strokeColor !== undefined && patch.strokeWidth === undefined) {
    next.strokeWidth =
      layer.typography.strokeWidth > 0
        ? layer.typography.strokeWidth
        : defaultStrokeWidth(next.fontSize)
  }

  return next
}
