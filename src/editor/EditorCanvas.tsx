import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { Bounds, Point, TextLayer } from '../document/types'
import {
  boundsCenter,
  cappedResizeHandleSize,
  containedRect,
  eraserScreenDiameter,
  fittedContainSize,
  fontSizeFromCornerDrag,
  isOnResizeCorner,
  isOnRotateEdge,
  layerOutlinePadding,
  normalizeBounds,
  outlineCorners,
  pointerToImagePoint,
  resizeCursorForCorner,
  resizeHandleSize,
  rotateEdgeWidth,
  rotationFromDrag,
  scaleBoundsFromCorner,
  toLocalBoundsPoint,
  type ResizeCorner,
} from './imageGeometry'
import { drawLayerText, layerStrokeOutset } from './drawTextLayer'
import { ensureFontsForLayers, withSettledFonts } from './fonts'
import {
  applyCanvasBacking,
  ZOOM_REDRAW_DEBOUNCE_MS,
} from './imageZoom'
import { drawCanvasGrid } from './canvasGrid'
import { readShowGrid, writeShowGrid } from './editorSession'
import { GridToggleButton } from './GridToggleButton'
import { LayerTextEditor } from './LayerTextEditor'
import { ZoomResetButton } from './ZoomResetButton'
import { useImageZoom } from './useImageZoom'

type EditorCanvasProps = {
  backgroundUrl: string
  documentKey: string
  width: number
  height: number
  layers: TextLayer[]
  selectedLayerIds: string[]
  interactionMode?: 'edit' | 'select-region' | 'preview' | 'erase'
  regionSelection?: Bounds | null
  eraserSize?: number
  onSelectLayer: (
    id: string | null,
    options?: { additive?: boolean },
  ) => void
  onMoveLayer: (id: string, x: number, y: number) => void
  onRotateLayer: (id: string, rotation: number) => void
  onFontSizeLayer: (id: string, fontSize: number, bounds: Bounds) => void
  onEditText?: (id: string, text: string) => void
  onFitTextBounds?: () => void
  onRegionSelectionChange?: (selection: Bounds | null) => void
  onEraseMask?: (stroke: { bounds: Bounds; mask: Uint8Array }) => void
}

type DragState =
  | {
      type: 'move'
      id: string
      offsetX: number
      offsetY: number
    }
  | {
      type: 'rotate'
      id: string
      startRotation: number
      startPoint: Point
      center: Point
    }
  | {
      type: 'scale'
      id: string
      corner: ResizeCorner
      startFontSize: number
      startBounds: Bounds
      startRotation: number
      padding: number
    }

type LayerHit = {
  layer: TextLayer
  action: 'move' | 'rotate' | 'scale'
  corner?: ResizeCorner
}

type ClickCandidate = {
  id: string
  clientX: number
  clientY: number
  additive: boolean
  toggleIfClick: boolean
}

const CLICK_MOVE_THRESHOLD_PX = 5

const ROTATE_CURSOR = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><g fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"><path d="M25.5 16a9.5 9.5 0 1 1-2.8-6.7"/><path d="M25.5 6.2v7.2h-7.2"/></g><g fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M25.5 16a9.5 9.5 0 1 1-2.8-6.7"/><path d="M25.5 6.2v7.2h-7.2"/></g></svg>',
)}") 16 16, grab`

const applyLayerTransform = (
  context: CanvasRenderingContext2D,
  layer: TextLayer,
) => {
  const { bounds } = layer
  context.translate(
    bounds.x + bounds.width / 2,
    bounds.y + bounds.height / 2,
  )
  context.rotate((layer.rotation * Math.PI) / 180)
  context.translate(-bounds.width / 2, -bounds.height / 2)
}

const displayedImageWidth = (
  canvas: HTMLCanvasElement,
  imageWidth: number,
  imageHeight: number,
) => containedRect(canvas.getBoundingClientRect(), imageWidth, imageHeight).width

export const EditorCanvas = ({
  backgroundUrl,
  documentKey,
  width,
  height,
  layers,
  selectedLayerIds,
  interactionMode = 'edit',
  regionSelection = null,
  eraserSize = 36,
  onSelectLayer,
  onMoveLayer,
  onRotateLayer,
  onFontSizeLayer,
  onEditText,
  onFitTextBounds,
  onRegionSelectionChange,
  onEraseMask,
}: EditorCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const dragRef = useRef<DragState | null>(null)
  const clickCandidateRef = useRef<ClickCandidate | null>(null)
  const regionStartRef = useRef<Point | null>(null)
  const eraserDraftRef = useRef<Point[] | null>(null)
  const eraserCursorRef = useRef<HTMLDivElement>(null)
  const eraserPointerRef = useRef<{ x: number; y: number } | null>(null)
  const layoutSizeRef = useRef({ width: 0, height: 0 })
  const [layoutSize, setLayoutSize] = useState({ width: 0, height: 0 })
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null)
  const [showGrid, setShowGrid] = useState(readShowGrid)
  const { viewportRef, transform, contentStyle, resetZoom } = useImageZoom(
    documentKey,
    canvasRef,
  )
  const transformRef = useRef(transform)
  const settledLayersRef = useRef(layers)
  const editingLayer =
    layers.find((layer) => layer.id === editingLayerId) ?? null

  const eraseMaskFromPoints = (points: Point[]) => {
    const radius = eraserSize / 2
    const minX = Math.max(0, Math.floor(Math.min(...points.map((point) => point.x)) - radius - 2))
    const minY = Math.max(0, Math.floor(Math.min(...points.map((point) => point.y)) - radius - 2))
    const maxX = Math.min(width, Math.ceil(Math.max(...points.map((point) => point.x)) + radius + 2))
    const maxY = Math.min(height, Math.ceil(Math.max(...points.map((point) => point.y)) + radius + 2))
    const bounds = {
      x: minX,
      y: minY,
      width: Math.max(1, maxX - minX),
      height: Math.max(1, maxY - minY),
    }
    const maskCanvas = document.createElement('canvas')
    maskCanvas.width = bounds.width
    maskCanvas.height = bounds.height
    const context = maskCanvas.getContext('2d')
    if (!context) throw new Error('Canvas 2D is unavailable in this browser.')
    context.strokeStyle = '#fff'
    context.fillStyle = '#fff'
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.lineWidth = eraserSize
    context.beginPath()
    points.forEach((point, index) => {
      const x = point.x - bounds.x
      const y = point.y - bounds.y
      if (index === 0) context.moveTo(x, y)
      else context.lineTo(x, y)
    })
    context.stroke()
    if (points.length === 1) {
      const point = points[0]
      context.beginPath()
      context.arc(point.x - bounds.x, point.y - bounds.y, radius, 0, Math.PI * 2)
      context.fill()
    }
    const pixels = context.getImageData(0, 0, bounds.width, bounds.height).data
    const mask = new Uint8Array(bounds.width * bounds.height)
    for (let index = 0; index < mask.length; index += 1) {
      mask[index] = pixels[index * 4 + 3] > 0 ? 255 : 0
    }
    return { bounds, mask }
  }

  const outlineMetrics = (layer: TextLayer, displayWidth: number) => {
    const pad =
      layerOutlinePadding(layer.typography.fontSize, width, displayWidth) +
      layerStrokeOutset(layer)
    const handleSize = cappedResizeHandleSize(
      resizeHandleSize(width, displayWidth),
      layer.bounds,
      pad,
    )
    return { pad, handleSize }
  }

  const hitAtPoint = (canvas: HTMLCanvasElement, point: Point): LayerHit | null => {
    const displayWidth = displayedImageWidth(canvas, width, height)
    const selectedIds = new Set(selectedLayerIds)
    for (const layer of [...layers].reverse()) {
      const local = toLocalBoundsPoint(point, layer.bounds, layer.rotation)
      const { pad, handleSize } = outlineMetrics(layer, displayWidth)
      const selected = selectedIds.has(layer.id)
      if (selected) {
        const corner = isOnResizeCorner(local, layer.bounds, handleSize, pad)
        if (corner) return { layer, action: 'scale', corner }
      }
      const edgeWidth = rotateEdgeWidth(width, displayWidth)
      if (isOnRotateEdge(local, layer.bounds, edgeWidth, pad)) {
        return { layer, action: 'rotate' }
      }
      if (
        local.x >= -pad &&
        local.x <= layer.bounds.width + pad &&
        local.y >= -pad &&
        local.y <= layer.bounds.height + pad
      ) {
        return { layer, action: 'move' }
      }
    }
    return null
  }

  const syncCanvasLayout = useCallback(() => {
    const viewport = viewportRef.current
    if (!viewport) return layoutSizeRef.current
    const next = fittedContainSize(
      viewport.getBoundingClientRect(),
      width,
      height,
    )
    const rounded = {
      width: Math.max(0, Math.round(next.width)),
      height: Math.max(0, Math.round(next.height)),
    }
    layoutSizeRef.current = rounded
    return rounded
  }, [height, viewportRef, width])

  const draw = useCallback(
    (selection = regionSelection) => {
      const canvas = canvasRef.current
      const image = imageRef.current
      if (!canvas || !image) return

      const layout = syncCanvasLayout()
      const zoom = transformRef.current.scale
      let cssWidth = layout.width
      let cssHeight = layout.height
      if (cssWidth <= 0 || cssHeight <= 0) {
        const visual = canvas.getBoundingClientRect()
        cssWidth = visual.width / zoom
        cssHeight = visual.height / zoom
      }
      if (cssWidth <= 0 || cssHeight <= 0) return
      applyCanvasBacking(
        canvas,
        cssWidth * zoom,
        cssHeight * zoom,
        window.devicePixelRatio || 1,
      )
      const context = canvas.getContext('2d')
      if (!context) return
      context.setTransform(
        canvas.width / width,
        0,
        0,
        canvas.height / height,
        0,
        0,
      )

      const displayWidth = displayedImageWidth(canvas, width, height)
      context.clearRect(0, 0, width, height)
      context.drawImage(image, 0, 0, width, height)

      const paintLayers = withSettledFonts(layers, settledLayersRef.current)
      if (paintLayers === layers) settledLayersRef.current = layers
      const selectedIds = new Set(selectedLayerIds)

      for (const [index, layer] of layers.entries()) {
        const { effects } = layer
        const paintLayer = paintLayers[index] ?? layer
        context.save()
        context.globalAlpha = effects.opacity
        applyLayerTransform(context, layer)
        drawLayerText(context, paintLayer)
        context.restore()
      }

      if (showGrid && interactionMode !== 'preview') {
        drawCanvasGrid(context, width, height)
      }

      for (const layer of layers) {
        if (interactionMode === 'preview') continue

        const { bounds, typography } = layer
        const selected = selectedIds.has(layer.id)
        const pad =
          layerOutlinePadding(
            typography.fontSize,
            width,
            displayWidth,
          ) + layerStrokeOutset(layer)
        const outlineWidth = bounds.width + pad * 2
        const outlineHeight = bounds.height + pad * 2
        const edgeWidth = Math.min(
          rotateEdgeWidth(width, displayWidth),
          Math.max(outlineWidth * 0.35, 1),
        )
        context.save()
        applyLayerTransform(context, layer)
        context.strokeStyle = selected ? '#1098F7' : '#000000'
        context.lineWidth = Math.max(selected ? 2 : 1, width / 900)
        context.setLineDash(
          selected ? [width / 180, width / 260] : [width / 300, width / 300],
        )
        context.strokeRect(-pad, -pad, outlineWidth, outlineHeight)
        if (selected) {
          const handleSize = cappedResizeHandleSize(
            resizeHandleSize(width, displayWidth),
            bounds,
            pad,
          )
          const rotateTop = -pad + handleSize
          const rotateHeight = Math.max(0, outlineHeight - handleSize * 2)
          context.fillStyle = 'rgba(16, 152, 247, 0.28)'
          context.fillRect(
            bounds.width + pad - edgeWidth,
            rotateTop,
            edgeWidth,
            rotateHeight,
          )
          context.setLineDash([])
          context.lineWidth = Math.max(3, width / 700)
          context.beginPath()
          context.moveTo(bounds.width + pad, rotateTop)
          context.lineTo(bounds.width + pad, rotateTop + rotateHeight)
          context.stroke()
          context.fillStyle = '#1098F7'
          context.strokeStyle = '#ffffff'
          context.lineWidth = Math.max(1.5, width / 1100)
          for (const corner of Object.values(outlineCorners(bounds, pad))) {
            context.fillRect(
              corner.x - handleSize / 2,
              corner.y - handleSize / 2,
              handleSize,
              handleSize,
            )
            context.strokeRect(
              corner.x - handleSize / 2,
              corner.y - handleSize / 2,
              handleSize,
              handleSize,
            )
          }
        }
        context.restore()
      }

      if (selection && selection.width > 0) {
        context.save()
        context.fillStyle = 'rgba(16, 152, 247, 0.22)'
        context.strokeStyle = '#1098F7'
        context.lineWidth = Math.max(2, width / 700)
        context.setLineDash([])
        context.fillRect(
          selection.x,
          selection.y,
          selection.width,
          selection.height,
        )
        context.strokeRect(
          selection.x,
          selection.y,
          selection.width,
          selection.height,
        )
        context.restore()
      }
      const eraserDraft = eraserDraftRef.current
      if (eraserDraft && eraserDraft.length > 0) {
        context.save()
        context.strokeStyle = 'rgba(255, 255, 255, 0.85)'
        context.fillStyle = 'rgba(255, 255, 255, 0.85)'
        context.lineCap = 'round'
        context.lineJoin = 'round'
        context.lineWidth = eraserSize
        context.shadowColor = 'rgba(0, 0, 0, 0.35)'
        context.shadowBlur = Math.max(3, eraserSize / 8)
        context.beginPath()
        eraserDraft.forEach((point, index) => {
          if (index === 0) context.moveTo(point.x, point.y)
          else context.lineTo(point.x, point.y)
        })
        context.stroke()
        context.restore()
      }
    },
    [
      height,
      interactionMode,
      layers,
      regionSelection,
      selectedLayerIds,
      eraserSize,
      showGrid,
      syncCanvasLayout,
      width,
    ],
  )

  const drawRef = useRef(draw)

  useLayoutEffect(() => {
    transformRef.current = transform
    drawRef.current = draw
  }, [draw, transform])

  useLayoutEffect(() => {
    drawRef.current()
  }, [showGrid])

  useEffect(() => {
    const image = new Image()
    image.onload = () => {
      imageRef.current = image
      draw()
    }
    image.src = backgroundUrl
    return () => {
      image.onload = null
    }
  }, [backgroundUrl, draw])

  useEffect(() => {
    let cancelled = false
    void ensureFontsForLayers(layers)
      .catch(() => undefined)
      .then(() => {
        if (cancelled) return
        draw()
        onFitTextBounds?.()
      })
    return () => {
      cancelled = true
    }
  }, [draw, layers, onFitTextBounds, regionSelection, selectedLayerIds])

  useLayoutEffect(() => {
    if (layoutSize.width <= 0) return
    drawRef.current()
  }, [layoutSize])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    const observer = new ResizeObserver(() => {
      const next = syncCanvasLayout()
      setLayoutSize((current) =>
        current.width === next.width && current.height === next.height
          ? current
          : next,
      )
    })
    observer.observe(viewport)
    return () => observer.disconnect()
  }, [syncCanvasLayout, viewportRef])

  const skipZoomRedrawRef = useRef(true)
  useEffect(() => {
    if (skipZoomRedrawRef.current) {
      skipZoomRedrawRef.current = false
      return
    }
    const timeout = window.setTimeout(
      () => drawRef.current(),
      ZOOM_REDRAW_DEBOUNCE_MS,
    )
    return () => window.clearTimeout(timeout)
  }, [transform.scale])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) canvas.style.cursor = ''
    if (interactionMode !== 'erase') eraserPointerRef.current = null
  }, [interactionMode])

  useEffect(() => {
    if (regionSelection !== null) return
    regionStartRef.current = null
  }, [regionSelection])

  useEffect(() => {
    if (interactionMode === 'select-region') return
    if (interactionMode === 'erase') return
    regionStartRef.current = null
    if (interactionMode === 'preview') dragRef.current = null
  }, [interactionMode])

  if (
    editingLayerId &&
    (interactionMode !== 'edit' || !selectedLayerIds.includes(editingLayerId))
  ) {
    setEditingLayerId(null)
  }

  useEffect(() => {
    if (interactionMode !== 'select-region') return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      const target = event.target
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.closest('input, textarea, select, [role="combobox"]'))
      ) {
        return
      }
      if (!regionStartRef.current && !regionSelection) return
      event.preventDefault()
      regionStartRef.current = null
      draw(null)
      onRegionSelectionChange?.(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [draw, interactionMode, onRegionSelectionChange, regionSelection])

  const imagePoint = (
    event: React.PointerEvent<HTMLCanvasElement>,
    clamp = true,
  ) =>
    pointerToImagePoint(
      event,
      event.currentTarget,
      width,
      height,
      'contain',
      clamp,
    )

  const placeEraserCursor = useCallback(
    (clientX: number, clientY: number) => {
      const cursor = eraserCursorRef.current
      const canvas = canvasRef.current
      const shell = viewportRef.current
      if (!cursor || !canvas || !shell) return
      const display = containedRect(canvas.getBoundingClientRect(), width, height)
      const shellBox = shell.getBoundingClientRect()
      const diameter = eraserScreenDiameter(eraserSize, width, display.width)
      cursor.style.visibility = diameter > 0 ? 'visible' : 'hidden'
      cursor.style.width = `${diameter}px`
      cursor.style.height = `${diameter}px`
      cursor.style.left = `${clientX - shellBox.left}px`
      cursor.style.top = `${clientY - shellBox.top}px`
    },
    [eraserSize, height, viewportRef, width],
  )

  useLayoutEffect(() => {
    const point = eraserPointerRef.current
    if (interactionMode !== 'erase' || !point) return
    placeEraserCursor(point.x, point.y)
  }, [interactionMode, layoutSize, placeEraserCursor, transform])

  const trackEraserCursor = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (interactionMode !== 'erase') return
    eraserPointerRef.current = { x: event.clientX, y: event.clientY }
    placeEraserCursor(event.clientX, event.clientY)
  }

  const updateCursor = (
    canvas: HTMLCanvasElement,
    point: Point,
    drag: DragState | null,
  ) => {
    if (interactionMode === 'preview') {
      canvas.style.cursor = 'default'
      return
    }
    if (interactionMode === 'erase') {
      canvas.style.cursor = 'none'
      return
    }
    if (interactionMode === 'select-region' || regionStartRef.current) {
      canvas.style.cursor = 'crosshair'
      return
    }
    if (drag?.type === 'rotate') {
      canvas.style.cursor = ROTATE_CURSOR
      return
    }
    if (drag?.type === 'scale') {
      const layer = layers.find((item) => item.id === drag.id)
      canvas.style.cursor = resizeCursorForCorner(
        drag.corner,
        layer?.rotation ?? 0,
      )
      return
    }
    if (drag?.type === 'move') {
      canvas.style.cursor = 'grabbing'
      return
    }
    const hit = hitAtPoint(canvas, point)
    if (hit?.action === 'rotate') {
      canvas.style.cursor = ROTATE_CURSOR
      return
    }
    if (hit?.action === 'scale' && hit.corner) {
      canvas.style.cursor = resizeCursorForCorner(hit.corner, hit.layer.rotation)
      return
    }
    canvas.style.cursor = hit ? 'grab' : 'default'
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const point = imagePoint(event)
    clickCandidateRef.current = null
    if (editingLayerId) setEditingLayerId(null)
    if (interactionMode === 'preview') return
    if (interactionMode === 'erase') {
      trackEraserCursor(event)
      eraserDraftRef.current = [point]
      draw()
      event.currentTarget.setPointerCapture(event.pointerId)
      return
    }
    if (interactionMode === 'select-region') {
      regionStartRef.current = point
      draw({ ...point, width: 0, height: 0 })
      event.currentTarget.setPointerCapture(event.pointerId)
      return
    }
    const hit = hitAtPoint(event.currentTarget, point)
    const additive = event.shiftKey
    const alreadySelected = Boolean(
      hit && selectedLayerIds.includes(hit.layer.id),
    )
    if (!(additive && alreadySelected)) {
      onSelectLayer(hit?.layer.id ?? null, { additive })
    }
    if (!hit) return
    if (hit.action === 'rotate') {
      dragRef.current = {
        type: 'rotate',
        id: hit.layer.id,
        startRotation: hit.layer.rotation,
        startPoint: point,
        center: boundsCenter(hit.layer.bounds),
      }
    } else if (hit.action === 'scale' && hit.corner) {
      const displayWidth = displayedImageWidth(
        event.currentTarget,
        width,
        height,
      )
      const { pad } = outlineMetrics(hit.layer, displayWidth)
      dragRef.current = {
        type: 'scale',
        id: hit.layer.id,
        corner: hit.corner,
        startFontSize: hit.layer.typography.fontSize,
        startBounds: hit.layer.bounds,
        startRotation: hit.layer.rotation,
        padding: pad,
      }
    } else {
      clickCandidateRef.current = {
        id: hit.layer.id,
        clientX: event.clientX,
        clientY: event.clientY,
        additive,
        toggleIfClick: additive && alreadySelected,
      }
      dragRef.current = {
        type: 'move',
        id: hit.layer.id,
        offsetX: point.x - hit.layer.bounds.x,
        offsetY: point.y - hit.layer.bounds.y,
      }
    }
    updateCursor(event.currentTarget, point, dragRef.current)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    trackEraserCursor(event)
    const drag = dragRef.current
    const point = imagePoint(
      event,
      drag?.type !== 'rotate' && drag?.type !== 'scale',
    )
    const clickCandidate = clickCandidateRef.current
    if (clickCandidate) {
      const dx = event.clientX - clickCandidate.clientX
      const dy = event.clientY - clickCandidate.clientY
      if (dx * dx + dy * dy > CLICK_MOVE_THRESHOLD_PX ** 2) {
        clickCandidateRef.current = null
      }
    }
    if (regionStartRef.current) {
      if (interactionMode !== 'select-region') {
        regionStartRef.current = null
        return
      }
      const nextSelection = normalizeBounds(regionStartRef.current, point)
      draw(nextSelection)
      return
    }
    if (eraserDraftRef.current) {
      eraserDraftRef.current = [...eraserDraftRef.current, point]
      draw()
      return
    }
    if (!drag) {
      updateCursor(event.currentTarget, point, null)
      return
    }
    const layer = layers.find((item) => item.id === drag.id)
    if (!layer) return
    if (drag.type === 'rotate') {
      onRotateLayer(
        layer.id,
        rotationFromDrag(drag.center, drag.startPoint, point, drag.startRotation),
      )
      return
    }
    if (drag.type === 'scale') {
      const local = toLocalBoundsPoint(point, drag.startBounds, drag.startRotation)
      const fontSize = fontSizeFromCornerDrag(
        drag.startFontSize,
        drag.startBounds,
        drag.corner,
        local,
        drag.padding,
      )
      const scale =
        drag.startFontSize <= 0 ? 1 : fontSize / drag.startFontSize
      const bounds = scaleBoundsFromCorner(
        drag.startBounds,
        scale,
        drag.corner,
        drag.startRotation,
      )
      if (
        fontSize !== layer.typography.fontSize ||
        bounds.x !== layer.bounds.x ||
        bounds.y !== layer.bounds.y ||
        bounds.width !== layer.bounds.width ||
        bounds.height !== layer.bounds.height
      ) {
        onFontSizeLayer(layer.id, fontSize, bounds)
      }
      return
    }
    onMoveLayer(
      layer.id,
      Math.max(
        0,
        Math.min(width - layer.bounds.width, point.x - drag.offsetX),
      ),
      Math.max(
        0,
        Math.min(height - layer.bounds.height, point.y - drag.offsetY),
      ),
    )
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const point = imagePoint(event)
    if (regionStartRef.current) {
      if (interactionMode === 'select-region') {
        const nextSelection = normalizeBounds(regionStartRef.current, point)
        if (nextSelection.width >= 4 && nextSelection.height >= 4) {
          draw(nextSelection)
          onRegionSelectionChange?.(nextSelection)
        } else {
          draw(null)
        }
      }
      regionStartRef.current = null
    }
    if (eraserDraftRef.current) {
      const points = eraserDraftRef.current
      eraserDraftRef.current = null
      draw()
      if (points.length > 0) onEraseMask?.(eraseMaskFromPoints(points))
    }
    const clickCandidate = clickCandidateRef.current
    clickCandidateRef.current = null
    dragRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    if (clickCandidate && interactionMode === 'edit') {
      if (clickCandidate.toggleIfClick) {
        onSelectLayer(clickCandidate.id, { additive: true })
      } else if (!clickCandidate.additive) {
        setEditingLayerId(clickCandidate.id)
      }
    }
    if (interactionMode === 'erase') {
      const box = event.currentTarget.getBoundingClientRect()
      const inside =
        event.clientX >= box.left &&
        event.clientX <= box.right &&
        event.clientY >= box.top &&
        event.clientY <= box.bottom
      if (!inside) {
        eraserPointerRef.current = null
        if (eraserCursorRef.current) {
          eraserCursorRef.current.style.visibility = 'hidden'
        }
      }
    }
    updateCursor(event.currentTarget, point, null)
  }

  const handlePointerLeave = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (dragRef.current || regionStartRef.current || eraserDraftRef.current) return
    eraserPointerRef.current = null
    if (eraserCursorRef.current) eraserCursorRef.current.style.visibility = 'hidden'
    event.currentTarget.style.cursor = ''
  }

  const handleToggleGrid = () => {
    setShowGrid((current) => {
      const next = !current
      writeShowGrid(next)
      return next
    })
  }

  return (
    <div ref={viewportRef} className="editor-canvas-shell">
      <canvas
        ref={canvasRef}
        className={`editor-canvas${interactionMode === 'select-region' ? ' selecting-region' : ''}${interactionMode === 'erase' ? ' erasing' : ''}`}
        onPointerEnter={trackEraserCursor}
        style={{
          ...contentStyle,
          aspectRatio: `${width} / ${height}`,
          width: layoutSize.width || undefined,
          height: layoutSize.height || undefined,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerLeave}
      />
      {interactionMode === 'erase' ? (
        <div ref={eraserCursorRef} className="eraser-cursor" aria-hidden="true" />
      ) : null}
      {editingLayer && onEditText ? (
        <LayerTextEditor
          layer={editingLayer}
          imageWidth={width}
          imageHeight={height}
          frameRef={canvasRef}
          viewportRef={viewportRef}
          transform={transform}
          layoutSize={layoutSize}
          onChange={(text) => onEditText(editingLayer.id, text)}
          onExit={() => setEditingLayerId(null)}
        />
      ) : null}
      <div className="canvas-overlay-controls canvas-overlay-controls-start">
        <GridToggleButton pressed={showGrid} onToggle={handleToggleGrid} />
      </div>
      <div className="canvas-overlay-controls canvas-overlay-controls-end">
        <ZoomResetButton scale={transform.scale} onReset={resetZoom} />
      </div>
    </div>
  )
}
