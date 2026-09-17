import type {
  Bounds,
  ProcessedImage,
  ProcessingOptions,
} from '../document/types'

export type ProcessingRunRequest = {
  type: 'process'
  requestId: string
  // Stable per uploaded file so the worker can skip re-decoding the source
  // image on every region: the client mints one id per file and reuses it
  // for every selection processed against it.
  imageId: string
  image: ArrayBuffer
  mimeType: string
  selection: Bounds
  options: ProcessingOptions
}

export type ProcessingWarmupRequest = {
  type: 'warmup'
}

export type ProcessingRequest = ProcessingRunRequest | ProcessingWarmupRequest

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
