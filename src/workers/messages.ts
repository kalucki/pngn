import type {
  Bounds,
  ProcessedImage,
  ProcessingOptions,
} from '../document/types'

export type ProcessingRequest = {
  type: 'process'
  requestId: string
  image: ArrayBuffer
  mimeType: string
  selection: Bounds
  options: ProcessingOptions
}

export type ProcessingSuccess = {
  type: 'success'
  requestId: string
  result: ProcessedImage
}

export type ProcessingProgress = {
  type: 'progress'
  requestId: string
  stage: 'loading-models' | 'ocr' | 'masking' | 'reconstruction'
  progress: number
}

export type ProcessingFailure = {
  type: 'error'
  requestId: string
  message: string
}

export type ProcessingResponse =
  | ProcessingSuccess
  | ProcessingProgress
  | ProcessingFailure
