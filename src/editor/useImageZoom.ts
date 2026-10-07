import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { readEditorZoom, writeEditorZoom } from './editorSession'
import {
  applyWheelZoom,
  IDENTITY_ZOOM,
  zoomTowardPoint,
  zoomContentStyle,
  type ZoomTransform,
} from './imageZoom'

export const useImageZoom = <T extends HTMLElement>(
  documentKey: string,
  contentRef: RefObject<T | null>,
) => {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState<ZoomTransform>(() =>
    readEditorZoom(documentKey),
  )
  const [seenKey, setSeenKey] = useState(documentKey)
  const pointersRef = useRef(new Map<number, PointerEvent>())
  const pinchRef = useRef<{
    distance: number
    scale: number
    midpoint: { x: number; y: number }
  } | null>(null)
  let visible = transform
  if (seenKey !== documentKey) {
    const next = readEditorZoom(documentKey)
    setSeenKey(documentKey)
    setTransform(next)
    visible = next
  }

  useEffect(() => {
    if (seenKey !== documentKey) return
    writeEditorZoom(documentKey, transform)
  }, [documentKey, seenKey, transform])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      const content = contentRef.current
      if (!content) return
      const rect = content.getBoundingClientRect()
      setTransform((current) =>
        applyWheelZoom(
          current,
          event.deltaY,
          event.deltaMode,
          event.clientX,
          event.clientY,
          rect.left - current.x,
          rect.top - current.y,
        ),
      )
    }

    viewport.addEventListener('wheel', onWheel, { passive: false })
    return () => viewport.removeEventListener('wheel', onWheel)
  }, [contentRef])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const distance = (left: PointerEvent, right: PointerEvent) =>
      Math.hypot(left.clientX - right.clientX, left.clientY - right.clientY)

    const midpoint = (left: PointerEvent, right: PointerEvent) => ({
      x: (left.clientX + right.clientX) / 2,
      y: (left.clientY + right.clientY) / 2,
    })

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== 'touch') return
      pointersRef.current.set(event.pointerId, event)
      if (pointersRef.current.size === 2) {
        const [left, right] = [...pointersRef.current.values()]
        pinchRef.current = {
          distance: distance(left, right),
          scale: transform.scale,
          midpoint: midpoint(left, right),
        }
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!pointersRef.current.has(event.pointerId)) return
      pointersRef.current.set(event.pointerId, event)
      if (pointersRef.current.size !== 2 || !pinchRef.current) return
      event.preventDefault()
      const content = contentRef.current
      if (!content) return
      const [left, right] = [...pointersRef.current.values()]
      const nextMidpoint = midpoint(left, right)
      const rect = content.getBoundingClientRect()
      const layoutLeft = rect.left - transform.x
      const layoutTop = rect.top - transform.y
      const localX = (pinchRef.current.midpoint.x - layoutLeft - transform.x) / transform.scale
      const localY = (pinchRef.current.midpoint.y - layoutTop - transform.y) / transform.scale
      const nextScale =
        pinchRef.current.scale * (distance(left, right) / pinchRef.current.distance)
      setTransform(() => ({
        ...zoomTowardPoint(transform, nextScale, localX, localY),
        x: zoomTowardPoint(transform, nextScale, localX, localY).x +
          nextMidpoint.x -
          pinchRef.current!.midpoint.x,
        y: zoomTowardPoint(transform, nextScale, localX, localY).y +
          nextMidpoint.y -
          pinchRef.current!.midpoint.y,
      }))
    }

    const onPointerUp = (event: PointerEvent) => {
      pointersRef.current.delete(event.pointerId)
      pinchRef.current = null
    }

    viewport.addEventListener('pointerdown', onPointerDown)
    viewport.addEventListener('pointermove', onPointerMove, { passive: false })
    viewport.addEventListener('pointerup', onPointerUp)
    viewport.addEventListener('pointercancel', onPointerUp)
    return () => {
      viewport.removeEventListener('pointerdown', onPointerDown)
      viewport.removeEventListener('pointermove', onPointerMove)
      viewport.removeEventListener('pointerup', onPointerUp)
      viewport.removeEventListener('pointercancel', onPointerUp)
    }
  }, [contentRef, transform])

  const resetZoom = useCallback(() => setTransform(IDENTITY_ZOOM), [])

  return {
    viewportRef,
    transform: visible,
    contentStyle: zoomContentStyle(visible),
    resetZoom,
  }
}
