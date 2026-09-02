import type {
  Bounds,
  ProcessedImage,
  ProcessingOptions,
  TextLayer,
} from '../document/types'

export type ProcessedRegion = {
  id: string
  selection: Bounds
  options: ProcessingOptions
  layerIds: string[]
  processed: ProcessedImage
}

export const optionsEqual = (
  left: ProcessingOptions,
  right: ProcessingOptions,
) =>
  left.method === right.method &&
  left.maskThreshold === right.maskThreshold &&
  left.maskDilation === right.maskDilation

export const findRegionByLayerId = (
  regions: ProcessedRegion[],
  layerId: string,
) => regions.find((region) => region.layerIds.includes(layerId)) ?? null

export const staleLayerIds = (
  regions: ProcessedRegion[],
  options: ProcessingOptions,
) =>
  new Set(
    regions.flatMap((region) =>
      optionsEqual(region.options, options) ? [] : region.layerIds,
    ),
  )

export const adoptRegionLayers = (
  previous: TextLayer[],
  next: TextLayer[],
  regionId: string,
): TextLayer[] => {
  const used = new Set<string>()
  return next.map((layer, index) => {
    const byText = previous.find(
      (candidate) =>
        candidate.originalText === layer.originalText && !used.has(candidate.id),
    )
    const byIndex = previous[index]
    const matched =
      byText ??
      (byIndex && !used.has(byIndex.id) ? byIndex : undefined)
    if (matched) used.add(matched.id)
    return {
      ...layer,
      id: matched?.id ?? `${regionId}-${layer.id}`,
      text: matched?.text ?? layer.text,
      typography: matched?.typography ?? layer.typography,
      effects: matched?.effects ?? layer.effects,
      rotation: matched?.rotation ?? layer.rotation,
    }
  })
}

export const layersFromRegions = (
  regions: ProcessedRegion[],
  currentLayers: TextLayer[],
  replacement?: { regionId: string; layers: TextLayer[] },
) =>
  regions.flatMap((region) => {
    if (replacement && region.id === replacement.regionId) {
      return replacement.layers
    }
    return region.layerIds
      .map((id) => currentLayers.find((layer) => layer.id === id))
      .filter((layer): layer is TextLayer => Boolean(layer))
  })
