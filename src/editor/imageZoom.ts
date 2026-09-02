export type ZoomTransform = {
  scale: number
  x: number
  y: number
}

export const MIN_ZOOM = 1
export const MAX_ZOOM = 10
export const IDENTITY_ZOOM: ZoomTransform = { scale: 1, x: 0, y: 0 }
export const ZOOM_REDRAW_DEBOUNCE_MS = 100
export const MAX_CANVAS_BACKING_EDGE = 8192

const ZOOM_INTENSITY = 0.0016
const LINE_HEIGHT_PX = 16
const PAGE_HEIGHT_PX = 800

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

export const wheelDeltaToPixels = (deltaY: number, deltaMode: number) => {
  if (deltaMode === 1) return deltaY * LINE_HEIGHT_PX
  if (deltaMode === 2) return deltaY * PAGE_HEIGHT_PX
  return deltaY
}

export const scaleFromWheelDelta = (deltaY: number, deltaMode: number) =>
  Math.exp(-wheelDeltaToPixels(deltaY, deltaMode) * ZOOM_INTENSITY)

export const zoomTowardPoint = (
  current: ZoomTransform,
  nextScale: number,
  localX: number,
  localY: number,
): ZoomTransform => {
  const scale = clamp(nextScale, MIN_ZOOM, MAX_ZOOM)
  if (scale <= MIN_ZOOM + 0.001) return IDENTITY_ZOOM
  return {
    scale,
    x: current.x + localX * (current.scale - scale),
    y: current.y + localY * (current.scale - scale),
  }
}

export const applyWheelZoom = (
  current: ZoomTransform,
  deltaY: number,
  deltaMode: number,
  clientX: number,
  clientY: number,
  layoutLeft: number,
  layoutTop: number,
): ZoomTransform => {
  const localX = (clientX - layoutLeft - current.x) / current.scale
  const localY = (clientY - layoutTop - current.y) / current.scale
  return zoomTowardPoint(
    current,
    current.scale * scaleFromWheelDelta(deltaY, deltaMode),
    localX,
    localY,
  )
}

export const zoomContentStyle = (
  transform: ZoomTransform,
): {
  transform: string
  transformOrigin: '0 0'
} => ({
  transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
  transformOrigin: '0 0',
})

export const canvasBackingSize = (
  cssWidth: number,
  cssHeight: number,
  devicePixelRatio: number,
  maxEdge = MAX_CANVAS_BACKING_EDGE,
) => {
  const dpr =
    Number.isFinite(devicePixelRatio) && devicePixelRatio > 0
      ? devicePixelRatio
      : 1
  const rawWidth = Math.max(0, cssWidth) * dpr
  const rawHeight = Math.max(0, cssHeight) * dpr
  const longEdge = Math.max(rawWidth, rawHeight, 1)
  const shrink = longEdge > maxEdge ? maxEdge / longEdge : 1
  return {
    width: Math.max(1, Math.round(rawWidth * shrink)),
    height: Math.max(1, Math.round(rawHeight * shrink)),
  }
}

export const applyCanvasBacking = (
  canvas: HTMLCanvasElement,
  cssWidth: number,
  cssHeight: number,
  devicePixelRatio: number,
) => {
  const next = canvasBackingSize(cssWidth, cssHeight, devicePixelRatio)
  if (canvas.width !== next.width || canvas.height !== next.height) {
    canvas.width = next.width
    canvas.height = next.height
  }
  return next
}
