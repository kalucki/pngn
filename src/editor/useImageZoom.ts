import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { readEditorZoom, writeEditorZoom } from './editorSession'
import {
  applyWheelZoom,
  IDENTITY_ZOOM,
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

  const resetZoom = useCallback(() => setTransform(IDENTITY_ZOOM), [])

  return {
    viewportRef,
    transform: visible,
    contentStyle: zoomContentStyle(visible),
    resetZoom,
  }
}
