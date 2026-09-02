import type {
  Bounds,
  ProcessedImage,
  ProcessingOptions,
} from '../document/types'
import { debugLog } from '../debugLog'
import type {
  ProcessingRequest,
  ProcessingResponse,
} from '../workers/messages'

type ProgressHandler = (
  stage: 'loading-models' | 'ocr' | 'masking' | 'reconstruction',
  progress: number,
) => void

type PendingRequest = {
  resolve: (result: ProcessedImage) => void
  reject: (error: Error) => void
  onProgress: ProgressHandler
}

const pending = new Map<string, PendingRequest>()
let worker: Worker | null = null

const getWorker = () => {
  if (worker) return worker
  debugLog('workers', 'creating processing worker')
  worker = new Worker(
    new URL('../workers/processing.worker.ts', import.meta.url),
    { type: 'module' },
  )
  worker.onmessage = (event: MessageEvent<ProcessingResponse>) => {
    const request = pending.get(event.data.requestId)
    if (!request) return

    if (event.data.type === 'progress') {
      request.onProgress(event.data.stage, event.data.progress)
      return
    }

    pending.delete(event.data.requestId)
    if (event.data.type === 'success') {
      request.resolve(event.data.result)
    } else {
      request.reject(new Error(event.data.message))
    }
  }

  worker.onerror = (event) => {
    const error = new Error(event.message || 'The processing worker crashed.')
    debugLog('workers', 'processing worker crashed', { message: error.message })
    for (const request of pending.values()) request.reject(error)
    pending.clear()
    worker?.terminate()
    worker = null
  }
  return worker
}

export const warmupProcessingWorker = () => {
  getWorker()
}

export const processImage = (
  image: ArrayBuffer,
  mimeType: string,
  selection: Bounds,
  options: ProcessingOptions,
  onProgress: ProgressHandler,
) =>
  new Promise<ProcessedImage>((resolve, reject) => {
    const requestId = crypto.randomUUID()
    pending.set(requestId, { resolve, reject, onProgress })
    const request: ProcessingRequest = {
      type: 'process',
      requestId,
      image,
      mimeType,
      selection,
      options,
    }
    debugLog('workers', 'post process request', {
      requestId,
      method: options.method,
      mimeType,
    })
    getWorker().postMessage(request, [image])
  })
