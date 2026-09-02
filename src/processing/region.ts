import type { Bounds, DetectedText } from '../document/types'

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value))

export const expandSelection = (
  selection: Bounds,
  imageWidth: number,
  imageHeight: number,
): Bounds => {
  const paddingX = Math.max(
    16,
    Math.min(selection.width * 0.3, selection.height * 1.35),
  )
  const paddingY = Math.max(12, selection.height * 0.8)
  const left = clamp(Math.floor(selection.x - paddingX), 0, imageWidth - 1)
  const top = clamp(Math.floor(selection.y - paddingY), 0, imageHeight - 1)
  const right = clamp(
    Math.ceil(selection.x + selection.width + paddingX),
    left + 1,
    imageWidth,
  )
  const bottom = clamp(
    Math.ceil(selection.y + selection.height + paddingY),
    top + 1,
    imageHeight,
  )
  return { x: left, y: top, width: right - left, height: bottom - top }
}

const intersectionArea = (left: Bounds, right: Bounds) => {
  const width = Math.max(
    0,
    Math.min(left.x + left.width, right.x + right.width) -
      Math.max(left.x, right.x),
  )
  const height = Math.max(
    0,
    Math.min(left.y + left.height, right.y + right.height) -
      Math.max(left.y, right.y),
  )
  return width * height
}

export const mapRegionalDetections = (
  detections: DetectedText[],
  crop: Bounds,
  selection: Bounds,
) =>
  detections
    .map((detection) => ({
      ...detection,
      bounds: {
        ...detection.bounds,
        x: detection.bounds.x + crop.x,
        y: detection.bounds.y + crop.y,
      },
    }))
    .filter((detection) => {
      const centerX = detection.bounds.x + detection.bounds.width / 2
      const centerY = detection.bounds.y + detection.bounds.height / 2
      const centerInside =
        centerX >= selection.x &&
        centerX <= selection.x + selection.width &&
        centerY >= selection.y &&
        centerY <= selection.y + selection.height
      const overlap =
        intersectionArea(detection.bounds, selection) /
        Math.max(1, detection.bounds.width * detection.bounds.height)
      return centerInside || overlap >= 0.22
    })
