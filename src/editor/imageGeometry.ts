import type { Bounds, Point } from '../document/types'

export type DisplayRect = {
  left: number
  top: number
  width: number
  height: number
}

export const normalizeBounds = (start: Point, end: Point): Bounds => ({
  x: Math.min(start.x, end.x),
  y: Math.min(start.y, end.y),
  width: Math.abs(end.x - start.x),
  height: Math.abs(end.y - start.y),
})

export const containedRect = (
  box: DisplayRect,
  contentWidth: number,
  contentHeight: number,
): DisplayRect => {
  if (
    box.width <= 0 ||
    box.height <= 0 ||
    contentWidth <= 0 ||
    contentHeight <= 0
  ) {
    return { ...box }
  }

  const boxAspect = box.width / box.height
  const contentAspect = contentWidth / contentHeight
  if (boxAspect > contentAspect) {
    const width = box.height * contentAspect
    return {
      left: box.left + (box.width - width) / 2,
      top: box.top,
      width,
      height: box.height,
    }
  }

  const height = box.width / contentAspect
  return {
    left: box.left,
    top: box.top + (box.height - height) / 2,
    width: box.width,
    height,
  }
}

export const fittedContainSize = (
  box: Pick<DisplayRect, 'width' | 'height'>,
  contentWidth: number,
  contentHeight: number,
) => {
  const fitted = containedRect(
    { left: 0, top: 0, width: box.width, height: box.height },
    contentWidth,
    contentHeight,
  )
  if (fitted.width > contentWidth || fitted.height > contentHeight) {
    return { width: contentWidth, height: contentHeight }
  }
  return { width: fitted.width, height: fitted.height }
}

export const overlayRectInViewport = (
  bounds: { x: number; y: number; width: number; height: number },
  imageWidth: number,
  imageHeight: number,
  frame: DisplayRect,
  viewport: Pick<DisplayRect, 'left' | 'top'>,
) => ({
  left: frame.left - viewport.left + (bounds.x / imageWidth) * frame.width,
  top: frame.top - viewport.top + (bounds.y / imageHeight) * frame.height,
  width: (bounds.width / imageWidth) * frame.width,
  height: (bounds.height / imageHeight) * frame.height,
})

export const clientPointToImage = (
  clientX: number,
  clientY: number,
  display: DisplayRect,
  imageWidth: number,
  imageHeight: number,
  clamp = true,
): Point => {
  const x =
    display.width === 0
      ? 0
      : ((clientX - display.left) / display.width) * imageWidth
  const y =
    display.height === 0
      ? 0
      : ((clientY - display.top) / display.height) * imageHeight
  if (!clamp) return { x, y }
  return {
    x: Math.max(0, Math.min(imageWidth, x)),
    y: Math.max(0, Math.min(imageHeight, y)),
  }
}

export const pointerToImagePoint = (
  event: Pick<PointerEvent, 'clientX' | 'clientY'>,
  element: HTMLElement,
  imageWidth: number,
  imageHeight: number,
  fit: 'fill' | 'contain' = 'fill',
  clamp = true,
) => {
  const box = element.getBoundingClientRect()
  const display =
    fit === 'contain' ? containedRect(box, imageWidth, imageHeight) : box
  return clientPointToImage(
    event.clientX,
    event.clientY,
    display,
    imageWidth,
    imageHeight,
    clamp,
  )
}

export const boundsCenter = (bounds: Bounds): Point => ({
  x: bounds.x + bounds.width / 2,
  y: bounds.y + bounds.height / 2,
})

export const toLocalBoundsPoint = (
  point: Point,
  bounds: Bounds,
  rotation: number,
): Point => {
  const center = boundsCenter(bounds)
  const radians = (rotation * Math.PI) / 180
  const dx = point.x - center.x
  const dy = point.y - center.y
  const cos = Math.cos(radians)
  const sin = Math.sin(radians)
  return {
    x: dx * cos + dy * sin + bounds.width / 2,
    y: -dx * sin + dy * cos + bounds.height / 2,
  }
}

export const pointInRotatedBounds = (
  point: Point,
  bounds: Bounds,
  rotation: number,
) => {
  const local = toLocalBoundsPoint(point, bounds, rotation)
  return (
    local.x >= 0 &&
    local.x <= bounds.width &&
    local.y >= 0 &&
    local.y <= bounds.height
  )
}

export const rotateEdgeWidth = (imageWidth: number, displayWidth: number) => {
  const cssToImage = displayWidth <= 0 ? 1 : imageWidth / displayWidth
  return Math.max(14 * cssToImage, 8)
}

export const layerOutlinePadding = (
  fontSize: number,
  imageWidth: number,
  displayWidth: number,
) => {
  const cssToImage = displayWidth <= 0 ? 1 : imageWidth / displayWidth
  return Math.max(10 * cssToImage, fontSize * 0.25)
}

export const isOnRotateEdge = (
  local: Point,
  bounds: Bounds,
  edgeWidth: number,
  padding = 0,
) => {
  const outlineWidth = bounds.width + padding * 2
  const outlineHeight = bounds.height + padding * 2
  const innerWidth = Math.min(edgeWidth, Math.max(outlineWidth * 0.35, 1))
  const outside = edgeWidth * 0.45
  const padY = Math.min(edgeWidth * 0.2, outlineHeight * 0.15)
  const right = bounds.width + padding
  return (
    local.x >= right - innerWidth &&
    local.x <= right + outside &&
    local.y >= -padding - padY &&
    local.y <= bounds.height + padding + padY
  )
}

export const rotationFromDrag = (
  center: Point,
  startPoint: Point,
  currentPoint: Point,
  startRotation: number,
) => {
  const startAngle = Math.atan2(startPoint.y - center.y, startPoint.x - center.x)
  const currentAngle = Math.atan2(
    currentPoint.y - center.y,
    currentPoint.x - center.x,
  )
  return startRotation + ((currentAngle - startAngle) * 180) / Math.PI
}
