import { useLayoutEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import type { TextLayer } from '../document/types'
import { useLocale } from '../i18n/useLocale'
import { overlayRectInViewport } from './imageGeometry'
import type { ZoomTransform } from './imageZoom'
import {
  layerTextOverlayStyle,
  overlayDisplayScale,
  type OverlayRect,
} from './layerTextOverlay'

type OverlayLayout = OverlayRect & { displayWidth: number }

type LayerTextEditorProps = {
  layer: TextLayer
  imageWidth: number
  imageHeight: number
  frameRef: RefObject<HTMLElement | null>
  viewportRef: RefObject<HTMLElement | null>
  transform: ZoomTransform
  layoutSize: { width: number; height: number }
  onChange: (text: string) => void
  onExit: () => void
}

export const LayerTextEditor = ({
  layer,
  imageWidth,
  imageHeight,
  frameRef,
  viewportRef,
  transform,
  layoutSize,
  onChange,
  onExit,
}: LayerTextEditorProps) => {
  const { t } = useLocale()
  const textRef = useRef<HTMLTextAreaElement>(null)
  const focusedIdRef = useRef<string | null>(null)
  const [overlay, setOverlay] = useState<OverlayLayout | null>(null)

  useLayoutEffect(() => {
    const frame = frameRef.current
    const viewport = viewportRef.current
    if (!frame || !viewport) {
      setOverlay(null)
      return
    }
    const frameRect = frame.getBoundingClientRect()
    setOverlay({
      ...overlayRectInViewport(
        layer.bounds,
        imageWidth,
        imageHeight,
        frameRect,
        viewport.getBoundingClientRect(),
      ),
      displayWidth: frameRect.width,
    })
  }, [
    frameRef,
    imageHeight,
    imageWidth,
    layer.bounds,
    layoutSize,
    transform,
    viewportRef,
  ])

  useLayoutEffect(() => {
    if (!overlay) return
    const node = textRef.current
    if (!node || focusedIdRef.current === layer.id) return
    focusedIdRef.current = layer.id
    node.focus({ preventScroll: true })
    const length = node.value.length
    node.setSelectionRange(length, length)
  }, [layer.id, overlay])

  if (!overlay) return null

  const scale = overlayDisplayScale(overlay.displayWidth, imageWidth)

  return (
    <textarea
      ref={textRef}
      className="layer-text-overlay"
      style={layerTextOverlayStyle(layer, overlay, scale)}
      value={layer.text}
      aria-label={t('toolbar.text')}
      spellCheck={false}
      autoCorrect="off"
      autoCapitalize="off"
      onChange={(event) => onChange(event.currentTarget.value)}
      onKeyDown={(event) => {
        if (event.key !== 'Escape') return
        event.preventDefault()
        event.stopPropagation()
        onExit()
      }}
      onPointerDown={(event) => event.stopPropagation()}
    />
  )
}
