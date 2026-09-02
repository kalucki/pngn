import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { Bounds, Point, TextLayer } from '../document/types'
import {
  boundsCenter,
  containedRect,
  fittedContainSize,
  isOnRotateEdge,
  layerOutlinePadding,
  normalizeBounds,
  pointerToImagePoint,
  rotateEdgeWidth,
  rotationFromDrag,
  toLocalBoundsPoint,
} from './imageGeometry'
import { drawLayerText, layerStrokeOutset } from './drawTextLayer'
import { ensureFontsForLayers, withSettledFonts } from './fonts'
import {
  applyCanvasBacking,
  ZOOM_REDRAW_DEBOUNCE_MS,
} from './imageZoom'
import { ZoomResetButton } from './ZoomResetButton'
import { useImageZoom } from './useImageZoom'

type EditorCanvasProps = {
  backgroundUrl: string
  documentKey: string
  width: number
  height: number
  layers: TextLayer[]
  selectedLayerId: string | null
  interactionMode?: 'edit' | 'select-region' | 'preview'
  regionSelection?: Bounds | null
  onSelectLayer: (id: string | null) => void
  onMoveLayer: (id: string, x: number, y: number) => void
  onRotateLayer: (id: string, rotation: number) => void
  onRegionSelectionChange?: (selection: Bounds) => void
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

type LayerHit = {
  layer: TextLayer
  action: 'move' | 'rotate'
}

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
  selectedLayerId,
  interactionMode = 'edit',
  regionSelection = null,
  onSelectLayer,
  onMoveLayer,
  onRotateLayer,
  onRegionSelectionChange,
}: EditorCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const dragRef = useRef<DragState | null>(null)
  const regionStartRef = useRef<Point | null>(null)
  const layoutSizeRef = useRef({ width: 0, height: 0 })
  const [layoutSize, setLayoutSize] = useState({ width: 0, height: 0 })
  const { viewportRef, transform, contentStyle, resetZoom } = useImageZoom(
    documentKey,
    canvasRef,
  )
  const transformRef = useRef(transform)
  const settledLayersRef = useRef(layers)

  const hitAtPoint = (canvas: HTMLCanvasElement, point: Point): LayerHit | null => {
    const displayWidth = displayedImageWidth(canvas, width, height)
    for (const layer of [...layers].reverse()) {
      const local = toLocalBoundsPoint(point, layer.bounds, layer.rotation)
      const pad =
        layerOutlinePadding(
          layer.typography.fontSize,
          width,
          displayWidth,
        ) + layerStrokeOutset(layer)
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

      for (const [index, layer] of layers.entries()) {
        const { bounds, typography, effects } = layer
        const paintLayer = paintLayers[index] ?? layer
        context.save()
        context.globalAlpha = effects.opacity
        applyLayerTransform(context, layer)
        drawLayerText(context, paintLayer)
        context.restore()

        if (interactionMode === 'preview') continue

        const selected = layer.id === selectedLayerId
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
          context.fillStyle = 'rgba(16, 152, 247, 0.28)'
          context.fillRect(
            bounds.width + pad - edgeWidth,
            -pad,
            edgeWidth,
            outlineHeight,
          )
          context.setLineDash([])
          context.lineWidth = Math.max(3, width / 700)
          context.beginPath()
          context.moveTo(bounds.width + pad, -pad)
          context.lineTo(bounds.width + pad, bounds.height + pad)
          context.stroke()
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
    },
    [
      height,
      interactionMode,
      layers,
      regionSelection,
      selectedLayerId,
      syncCanvasLayout,
      width,
    ],
  )

  const drawRef = useRef(draw)

  useLayoutEffect(() => {
    transformRef.current = transform
    drawRef.current = draw
  }, [draw, transform])

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
        if (!cancelled) draw()
      })
    return () => {
      cancelled = true
    }
  }, [draw, layers, regionSelection, selectedLayerId])

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
  }, [interactionMode])

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

  const updateCursor = (
    canvas: HTMLCanvasElement,
    point: Point,
    drag: DragState | null,
  ) => {
    if (interactionMode === 'preview') {
      canvas.style.cursor = 'default'
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
    if (drag?.type === 'move') {
      canvas.style.cursor = 'grabbing'
      return
    }
    const hit = hitAtPoint(canvas, point)
    if (hit?.action === 'rotate') {
      canvas.style.cursor = ROTATE_CURSOR
      return
    }
    canvas.style.cursor = hit ? 'grab' : 'default'
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const point = imagePoint(event)
    if (interactionMode === 'preview') return
    if (interactionMode === 'select-region') {
      regionStartRef.current = point
      draw({ ...point, width: 0, height: 0 })
      event.currentTarget.setPointerCapture(event.pointerId)
      return
    }
    const hit = hitAtPoint(event.currentTarget, point)
    onSelectLayer(hit?.layer.id ?? null)
    if (!hit) return
    if (hit.action === 'rotate') {
      dragRef.current = {
        type: 'rotate',
        id: hit.layer.id,
        startRotation: hit.layer.rotation,
        startPoint: point,
        center: boundsCenter(hit.layer.bounds),
      }
    } else {
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
    const drag = dragRef.current
    const point = imagePoint(event, drag?.type !== 'rotate')
    if (regionStartRef.current) {
      const nextSelection = normalizeBounds(regionStartRef.current, point)
      draw(nextSelection)
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
      const nextSelection = normalizeBounds(regionStartRef.current, point)
      regionStartRef.current = null
      if (nextSelection.width >= 4 && nextSelection.height >= 4) {
        draw(nextSelection)
        onRegionSelectionChange?.(nextSelection)
      } else {
        draw(null)
      }
    }
    dragRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    updateCursor(event.currentTarget, point, null)
  }

  const handlePointerLeave = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (dragRef.current || regionStartRef.current) return
    event.currentTarget.style.cursor = ''
  }

  return (
    <div ref={viewportRef} className="editor-canvas-shell">
      <canvas
        ref={canvasRef}
        className={`editor-canvas ${interactionMode === 'select-region' ? 'selecting-region' : ''}`}
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
      <ZoomResetButton scale={transform.scale} onReset={resetZoom} />
    </div>
  )
}
