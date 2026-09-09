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

export const worldFromLocalBoundsPoint = (
  local: Point,
  bounds: Bounds,
  rotation: number,
): Point => {
  const center = boundsCenter(bounds)
  const radians = (rotation * Math.PI) / 180
  const cos = Math.cos(radians)
  const sin = Math.sin(radians)
  const dx = local.x - bounds.width / 2
  const dy = local.y - bounds.height / 2
  return {
    x: center.x + dx * cos - dy * sin,
    y: center.y + dx * sin + dy * cos,
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

export type ResizeCorner = 'nw' | 'ne' | 'sw' | 'se'

const OPPOSITE_CORNER: Record<ResizeCorner, ResizeCorner> = {
  nw: 'se',
  ne: 'sw',
  sw: 'ne',
  se: 'nw',
}

const MIN_FONT_SIZE = 4
const MAX_FONT_SIZE = 600

export const resizeHandleSize = (imageWidth: number, displayWidth: number) => {
  const cssToImage = displayWidth <= 0 ? 1 : imageWidth / displayWidth
  return Math.max(10 * cssToImage, 8)
}

export const cappedResizeHandleSize = (
  handleSize: number,
  bounds: Bounds,
  padding: number,
) => {
  const outlineWidth = bounds.width + padding * 2
  const outlineHeight = bounds.height + padding * 2
  return Math.min(
    handleSize,
    Math.max(outlineWidth * 0.28, 1),
    Math.max(outlineHeight * 0.28, 1),
  )
}

export const outlineCorners = (
  bounds: Bounds,
  padding = 0,
): Record<ResizeCorner, Point> => ({
  nw: { x: -padding, y: -padding },
  ne: { x: bounds.width + padding, y: -padding },
  sw: { x: -padding, y: bounds.height + padding },
  se: { x: bounds.width + padding, y: bounds.height + padding },
})

export const isOnResizeCorner = (
  local: Point,
  bounds: Bounds,
  handleSize: number,
  padding = 0,
): ResizeCorner | null => {
  const reach = handleSize * 0.75
  const corners = outlineCorners(bounds, padding)
  let best: ResizeCorner | null = null
  let bestDist = Infinity
  for (const corner of Object.keys(corners) as ResizeCorner[]) {
    const pos = corners[corner]
    const dx = local.x - pos.x
    const dy = local.y - pos.y
    if (Math.abs(dx) > reach || Math.abs(dy) > reach) continue
    const dist = dx * dx + dy * dy
    if (dist < bestDist) {
      best = corner
      bestDist = dist
    }
  }
  return best
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

export const fontSizeFromCornerDrag = (
  startFontSize: number,
  startBounds: Bounds,
  corner: ResizeCorner,
  localPoint: Point,
  padding = 0,
) => {
  const corners = outlineCorners(startBounds, padding)
  const pin = corners[OPPOSITE_CORNER[corner]]
  const startHandle = corners[corner]
  const startX = startHandle.x - pin.x
  const startY = startHandle.y - pin.y
  const startDist = Math.hypot(startX, startY)
  if (startDist < 1) return startFontSize
  const projected =
    ((localPoint.x - pin.x) * startX + (localPoint.y - pin.y) * startY) /
    startDist
  return Math.max(
    MIN_FONT_SIZE,
    Math.min(MAX_FONT_SIZE, Math.round(startFontSize * (projected / startDist))),
  )
}

export const scaleBoundsFromCorner = (
  startBounds: Bounds,
  scale: number,
  corner: ResizeCorner,
  rotation = 0,
): Bounds => {
  const width = Math.max(1, startBounds.width * scale)
  const height = Math.max(1, startBounds.height * scale)
  const pinWorld = worldFromLocalBoundsPoint(
    outlineCorners(startBounds)[OPPOSITE_CORNER[corner]],
    startBounds,
    rotation,
  )
  const pinLocal = outlineCorners({ x: 0, y: 0, width, height })[
    OPPOSITE_CORNER[corner]
  ]
  const radians = (rotation * Math.PI) / 180
  const cos = Math.cos(radians)
  const sin = Math.sin(radians)
  const dx = pinLocal.x - width / 2
  const dy = pinLocal.y - height / 2
  const centerX = pinWorld.x - (dx * cos - dy * sin)
  const centerY = pinWorld.y - (dx * sin + dy * cos)
  return {
    x: centerX - width / 2,
    y: centerY - height / 2,
    width,
    height,
  }
}

export const resizeCursorForCorner = (
  corner: ResizeCorner,
  rotation: number,
) => {
  const nwse = corner === 'nw' || corner === 'se'
  const normalized = ((rotation % 180) + 180) % 180
  const swap = normalized > 45 && normalized <= 135
  return nwse === swap ? 'nesw-resize' : 'nwse-resize'
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
