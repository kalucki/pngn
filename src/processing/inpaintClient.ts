import type { NeuralInpaintModel } from '../document/types'

export type NeuralInpaintResult = {
  image: ImageData
  provider: 'webgpu' | 'wasm'
}

type WorkerResponse =
  | {
      requestId: string
      type: 'success'
      pixels: ArrayBuffer
      width: number
      height: number
      provider: 'webgpu' | 'wasm'
    }
  | { requestId: string; type: 'error'; message: string }

type PendingRequest = {
  resolve: (result: NeuralInpaintResult) => void
  reject: (error: Error) => void
}

let worker: Worker | null = null
const pending = new Map<string, PendingRequest>()

const getWorker = () => {
  if (worker) return worker
  worker = new Worker(new URL('../workers/inpaint.worker.ts', import.meta.url), {
    type: 'module',
  })
  worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
    const request = pending.get(event.data.requestId)
    if (!request) return
    pending.delete(event.data.requestId)
    if (event.data.type === 'error') {
      request.reject(new Error(event.data.message))
      return
    }
    request.resolve({
      image: new ImageData(
        new Uint8ClampedArray(event.data.pixels),
        event.data.width,
        event.data.height,
      ),
      provider: event.data.provider,
    })
  }
  worker.onerror = (event) => {
    const error = new Error(event.message || 'The inpainting worker crashed.')
    for (const request of pending.values()) request.reject(error)
    pending.clear()
    worker?.terminate()
    worker = null
  }
  return worker
}

export const warmupInpaintWorker = () => {
  getWorker()
}

// `mask` uses this app's convention: 255 = pixel to remove (hole), 0 = keep.
// The worker converts polarity to whatever the chosen model expects.
export const neuralInpaint = (
  crop: ImageData,
  mask: Uint8Array,
  model: NeuralInpaintModel,
) =>
  new Promise<NeuralInpaintResult>((resolve, reject) => {
    const requestId = crypto.randomUUID()
    pending.set(requestId, { resolve, reject })
    const pixels = crop.data.slice().buffer
    const maskBuffer = mask.slice().buffer
    getWorker().postMessage(
      {
        requestId,
        model,
        pixels,
        mask: maskBuffer,
        width: crop.width,
        height: crop.height,
      },
      [pixels, maskBuffer],
    )
  })
