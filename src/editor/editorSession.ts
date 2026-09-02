import {
  IDENTITY_ZOOM,
  MAX_ZOOM,
  MIN_ZOOM,
  type ZoomTransform,
} from './imageZoom'

export const EDITOR_ZOOM_STORAGE_KEY = 'txtimg.editor.zoom'

type StoredEditorZoom = {
  documentKey: string
  zoom: ZoomTransform
}

export const editorDocumentKey = (
  file: { name: string; size: number; lastModified: number },
  width: number,
  height: number,
) => `${file.name}:${file.size}:${file.lastModified}:${width}x${height}`

export const parseZoomTransform = (value: unknown): ZoomTransform | null => {
  if (!value || typeof value !== 'object') return null
  const { scale, x, y } = value as Record<string, unknown>
  if (
    typeof scale !== 'number' ||
    typeof x !== 'number' ||
    typeof y !== 'number' ||
    !Number.isFinite(scale) ||
    !Number.isFinite(x) ||
    !Number.isFinite(y)
  ) {
    return null
  }
  const nextScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, scale))
  if (nextScale <= MIN_ZOOM + 0.001) return IDENTITY_ZOOM
  return { scale: nextScale, x, y }
}

const readStoredZoom = (): StoredEditorZoom | null => {
  try {
    const raw = sessionStorage.getItem(EDITOR_ZOOM_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return null
    const { documentKey } = parsed as Record<string, unknown>
    if (typeof documentKey !== 'string' || documentKey.length === 0) return null
    const zoom = parseZoomTransform((parsed as Record<string, unknown>).zoom)
    if (!zoom) return null
    return { documentKey, zoom }
  } catch {
    return null
  }
}

export const readEditorZoom = (documentKey: string): ZoomTransform => {
  if (!documentKey) return IDENTITY_ZOOM
  const stored = readStoredZoom()
  if (!stored || stored.documentKey !== documentKey) return IDENTITY_ZOOM
  return stored.zoom
}

export const writeEditorZoom = (documentKey: string, zoom: ZoomTransform) => {
  if (!documentKey) return
  try {
    const payload: StoredEditorZoom = { documentKey, zoom }
    sessionStorage.setItem(EDITOR_ZOOM_STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // Ignore quota / privacy errors.
  }
}
