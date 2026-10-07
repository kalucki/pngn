import type { EditorDocument, ImageAdjustments, Layer } from './types'

export type DocumentAction =
  | { type: 'set-layers'; layers: Layer[] }
  | { type: 'select-layers'; ids: string[] }
  | { type: 'set-adjustments'; adjustments: ImageAdjustments }
  | { type: 'resize'; width: number; height: number }
  | { type: 'replace'; document: EditorDocument }

export const defaultAdjustments: ImageAdjustments = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
}

export const createEditorDocument = (
  id: string,
  width: number,
  height: number,
): EditorDocument => ({
  id,
  width,
  height,
  layers: [],
  activeLayerIds: [],
  adjustments: defaultAdjustments,
})

export const documentReducer = (
  document: EditorDocument,
  action: DocumentAction,
): EditorDocument => {
  if (action.type === 'replace') return action.document
  if (action.type === 'set-layers') {
    return { ...document, layers: action.layers }
  }
  if (action.type === 'select-layers') {
    return { ...document, activeLayerIds: action.ids }
  }
  if (action.type === 'set-adjustments') {
    return { ...document, adjustments: action.adjustments }
  }
  return { ...document, width: action.width, height: action.height }
}
