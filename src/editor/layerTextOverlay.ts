import type { CSSProperties } from 'react'
import type { TextLayer } from '../document/types'
import { cssFontFamily } from './fonts'

export type OverlayRect = {
  left: number
  top: number
  width: number
  height: number
}

export const overlayDisplayScale = (
  displayWidth: number,
  imageWidth: number,
) => (imageWidth <= 0 ? 1 : displayWidth / imageWidth)

export const layerTextOverlayStyle = (
  layer: TextLayer,
  overlay: OverlayRect,
  scale: number,
): CSSProperties => ({
  left: overlay.left,
  top: overlay.top,
  width: overlay.width,
  height: overlay.height,
  minWidth: overlay.width,
  minHeight: overlay.height,
  maxWidth: overlay.width,
  maxHeight: overlay.height,
  transform: `rotate(${layer.rotation}deg)`,
  fontFamily: cssFontFamily(layer.typography.fontFamily),
  fontSize: `${layer.typography.fontSize * scale}px`,
  fontWeight: layer.typography.fontWeight,
  fontStyle: layer.typography.italic ? 'italic' : 'normal',
  lineHeight: layer.typography.lineHeight,
  letterSpacing: `${layer.typography.letterSpacing * scale}px`,
  color: 'transparent',
  WebkitTextFillColor: 'transparent',
  textAlign: layer.typography.alignment as CSSProperties['textAlign'],
  caretColor: layer.typography.color,
})
