import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { Bounds } from '../document/types'
import { useLocale } from '../i18n/useLocale'
import {
  normalizeBounds,
  overlayRectInViewport,
  pointerToImagePoint,
} from './imageGeometry'
import { ZoomResetButton } from './ZoomResetButton'
import { useImageZoom } from './useImageZoom'

type RegionSelectorProps = {
  imageUrl: string
  documentKey: string
  width: number
  height: number
  selection: Bounds | null
  disabled?: boolean
  onChange: (selection: Bounds | null) => void
}

export const RegionSelector = ({
  imageUrl,
  documentKey,
  width,
  height,
  selection,
  disabled = false,
  onChange,
}: RegionSelectorProps) => {
  const { t } = useLocale()
  const frameRef = useRef<HTMLDivElement>(null)
  const startRef = useRef<{ x: number; y: number } | null>(null)
  const [draft, setDraft] = useState<Bounds | null>(selection)
  const [overlay, setOverlay] = useState<ReturnType<
    typeof overlayRectInViewport
  > | null>(null)
  const { viewportRef, transform, contentStyle, resetZoom } = useImageZoom(
    documentKey,
    frameRef,
  )

  useLayoutEffect(() => {
    if (selection === null) {
      startRef.current = null
      setDraft(null)
      return
    }
    if (startRef.current) return
    setDraft(selection)
  }, [selection])

  useEffect(() => {
    if (!disabled) return
    startRef.current = null
  }, [disabled])

  useEffect(() => {
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
      if (disabled || (!startRef.current && !selection)) return
      event.preventDefault()
      startRef.current = null
      setDraft(null)
      onChange(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [disabled, onChange, selection])

  const visible = draft && draft.width >= 1 && draft.height >= 1 ? draft : null

  useLayoutEffect(() => {
    const frame = frameRef.current
    const viewport = viewportRef.current
    if (!frame || !viewport || !visible) {
      setOverlay(null)
      return
    }
    setOverlay(
      overlayRectInViewport(
        visible,
        width,
        height,
        frame.getBoundingClientRect(),
        viewport.getBoundingClientRect(),
      ),
    )
  }, [height, transform, viewportRef, visible, width])

  const imagePoint = (event: React.PointerEvent<HTMLDivElement>) => {
    const frame = frameRef.current ?? event.currentTarget
    return pointerToImagePoint(event, frame, width, height)
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return
    event.preventDefault()
    startRef.current = imagePoint(event)
    event.currentTarget.setPointerCapture(event.pointerId)
    setDraft({ ...startRef.current, width: 0, height: 0 })
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || !startRef.current) return
    setDraft(normalizeBounds(startRef.current, imagePoint(event)))
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || !startRef.current) return
    const nextSelection = normalizeBounds(startRef.current, imagePoint(event))
    startRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    if (nextSelection.width >= 4 && nextSelection.height >= 4) {
      setDraft(nextSelection)
      onChange(nextSelection)
      return
    }
    setDraft(selection)
  }

  return (
    <div ref={viewportRef} className="region-selector">
      <div
        ref={frameRef}
        className={`region-selector-frame${disabled ? ' is-locked' : ''}`}
        style={{
          ['--image-w' as string]: width,
          ['--image-h' as string]: height,
          aspectRatio: `${width} / ${height}`,
          ...contentStyle,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <img src={imageUrl} alt={t('region.alt')} draggable={false} />
      </div>
      {overlay && visible && (
        <div
          className={`region-selection${visible.y / height < 0.05 ? ' label-below' : ''}`}
          style={{
            left: overlay.left,
            top: overlay.top,
            width: overlay.width,
            height: overlay.height,
          }}
        >
          <span>{t('region.selectText')}</span>
        </div>
      )}
      <ZoomResetButton scale={transform.scale} onReset={resetZoom} />
    </div>
  )
}
