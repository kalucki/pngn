import { openCvInpaint } from './openCvClient'

export type InpaintMethod = 'telea' | 'navier-stokes' | 'patch'

const copyImageData = (image: ImageData) =>
  new ImageData(new Uint8ClampedArray(image.data), image.width, image.height)

const pixelOffset = (index: number) => index * 4

const distanceOrder = (mask: Uint8Array, width: number, height: number) => {
  const distances = new Uint16Array(mask.length)
  const queued = new Uint8Array(mask.length)
  const queue = new Int32Array(mask.length)
  let read = 0
  let write = 0
  const neighbors = [-width, -1, 1, width]

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x
      if (!mask[index]) continue
      for (const delta of neighbors) {
        const adjacent = index + delta
        const adjacentX = adjacent % width
        if (
          adjacent >= 0 &&
          adjacent < mask.length &&
          Math.abs(adjacentX - x) <= 1 &&
          !mask[adjacent]
        ) {
          queue[write] = index
          write += 1
          queued[index] = 1
          distances[index] = 1
          break
        }
      }
    }
  }

  while (read < write) {
    const current = queue[read]
    read += 1
    const x = current % width
    const nextDistance = distances[current] + 1
    for (const delta of neighbors) {
      const next = current + delta
      if (next < 0 || next >= mask.length || queued[next] || !mask[next]) continue
      const nextX = next % width
      if (Math.abs(nextX - x) > 1) continue
      queued[next] = 1
      distances[next] = nextDistance
      queue[write] = next
      write += 1
    }
  }

  return Array.from(queue.slice(0, write)).sort(
    (left, right) => distances[left] - distances[right] || left - right,
  )
}

const weightedDiffusionInpaint = (
  crop: ImageData,
  mask: Uint8Array,
  radius: number,
) => {
  const output = copyImageData(crop)
  const remaining = new Uint8Array(mask)
  const order = distanceOrder(mask, crop.width, crop.height)
  const searchRadius = Math.max(2, Math.min(8, radius))

  for (const target of order) {
    const targetX = target % crop.width
    const targetY = Math.floor(target / crop.width)
    const sums = [0, 0, 0]
    let totalWeight = 0
    for (let offsetY = -searchRadius; offsetY <= searchRadius; offsetY += 1) {
      for (let offsetX = -searchRadius; offsetX <= searchRadius; offsetX += 1) {
        const sampleX = targetX + offsetX
        const sampleY = targetY + offsetY
        if (
          sampleX < 0 ||
          sampleX >= crop.width ||
          sampleY < 0 ||
          sampleY >= crop.height
        ) {
          continue
        }
        const sample = sampleY * crop.width + sampleX
        if (remaining[sample]) continue
        const distanceSquared = offsetX * offsetX + offsetY * offsetY
        if (distanceSquared === 0 || distanceSquared > searchRadius ** 2) continue
        const weight = 1 / distanceSquared
        const source = pixelOffset(sample)
        sums[0] += output.data[source] * weight
        sums[1] += output.data[source + 1] * weight
        sums[2] += output.data[source + 2] * weight
        totalWeight += weight
      }
    }
    if (totalWeight > 0) {
      const destination = pixelOffset(target)
      output.data[destination] = sums[0] / totalWeight
      output.data[destination + 1] = sums[1] / totalWeight
      output.data[destination + 2] = sums[2] / totalWeight
    }
    remaining[target] = 0
  }
  return output
}

const collectPatchSources = (
  mask: Uint8Array,
  width: number,
  height: number,
  patchRadius: number,
  maximum: number,
) => {
  const candidates: number[] = []
  const stride = Math.max(1, Math.floor(Math.sqrt((width * height) / 5000)))
  for (let y = patchRadius; y < height - patchRadius; y += stride) {
    for (let x = patchRadius; x < width - patchRadius; x += stride) {
      const center = y * width + x
      if (mask[center]) continue
      let valid = true
      for (let offsetY = -patchRadius; offsetY <= patchRadius && valid; offsetY += 1) {
        for (let offsetX = -patchRadius; offsetX <= patchRadius; offsetX += 1) {
          if (mask[(y + offsetY) * width + x + offsetX]) {
            valid = false
            break
          }
        }
      }
      if (valid) candidates.push(center)
    }
  }
  if (candidates.length <= maximum) return candidates
  const sampled: number[] = []
  const interval = candidates.length / maximum
  for (let index = 0; index < maximum; index += 1) {
    sampled.push(candidates[Math.floor(index * interval)])
  }
  return sampled
}

export const patchInpaint = (crop: ImageData, mask: Uint8Array) => {
  const output = copyImageData(crop)
  const remaining = new Uint8Array(mask)
  const maskedPixels = mask.reduce((total, value) => total + (value ? 1 : 0), 0)
  const patchRadius = maskedPixels > 12_000 ? 1 : 2
  const maximumCandidates = maskedPixels > 12_000 ? 40 : 96
  const sources = collectPatchSources(
    mask,
    crop.width,
    crop.height,
    patchRadius,
    maximumCandidates,
  )
  if (!sources.length) return weightedDiffusionInpaint(crop, mask, 5)

  for (const target of distanceOrder(mask, crop.width, crop.height)) {
    const targetX = target % crop.width
    const targetY = Math.floor(target / crop.width)
    let bestSource = sources[0]
    let bestScore = Number.POSITIVE_INFINITY
    for (const source of sources) {
      const sourceX = source % crop.width
      const sourceY = Math.floor(source / crop.width)
      let score = 0
      let compared = 0
      for (let offsetY = -patchRadius; offsetY <= patchRadius; offsetY += 1) {
        for (let offsetX = -patchRadius; offsetX <= patchRadius; offsetX += 1) {
          const compareX = targetX + offsetX
          const compareY = targetY + offsetY
          if (
            compareX < 0 ||
            compareX >= crop.width ||
            compareY < 0 ||
            compareY >= crop.height
          ) {
            continue
          }
          const compare = compareY * crop.width + compareX
          if (remaining[compare]) continue
          const sourceCompare =
            (sourceY + offsetY) * crop.width + sourceX + offsetX
          const compareOffset = pixelOffset(compare)
          const sourceOffset = pixelOffset(sourceCompare)
          for (let channel = 0; channel < 3; channel += 1) {
            const difference =
              output.data[compareOffset + channel] -
              crop.data[sourceOffset + channel]
            score += difference * difference
          }
          compared += 1
        }
      }
      if (!compared) continue
      score /= compared
      score +=
        0.015 *
        ((sourceX - targetX) ** 2 + (sourceY - targetY) ** 2)
      if (score < bestScore) {
        bestScore = score
        bestSource = source
      }
    }
    const destination = pixelOffset(target)
    const sourceOffset = pixelOffset(bestSource)
    output.data[destination] = crop.data[sourceOffset]
    output.data[destination + 1] = crop.data[sourceOffset + 1]
    output.data[destination + 2] = crop.data[sourceOffset + 2]
    remaining[target] = 0
  }
  return output
}

export const inpaint = async (
  crop: ImageData,
  mask: Uint8Array,
  method: InpaintMethod,
  radius: number,
) => {
  if (method === 'patch') return patchInpaint(crop, mask)
  try {
    return (
      (await openCvInpaint(crop, mask, method, radius)) ??
      weightedDiffusionInpaint(crop, mask, radius)
    )
  } catch (error) {
    console.warn(`OpenCV ${method} inpainting failed; using fallback.`, error)
    return weightedDiffusionInpaint(crop, mask, radius)
  }
}
