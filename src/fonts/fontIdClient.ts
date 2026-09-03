import type { FontCandidate } from './storiaLabels'

type WorkerResponse =
  | {
      requestId: string
      type: 'success'
      provider: 'webgpu' | 'wasm'
      candidates: FontCandidate[]
    }
  | { requestId: string; type: 'error'; message: string }

type PendingRequest = {
  resolve: (result: FontCandidate[]) => void
  reject: (error: Error) => void
}

const IDENTIFY_TIMEOUT_MS = 30_000
const pending = new Map<string, PendingRequest>()
let worker: Worker | null = null
let runQueue: Promise<void> = Promise.resolve()

const settle = (requestId: string, action: (request: PendingRequest) => void) => {
  const request = pending.get(requestId)
  if (!request) return
  pending.delete(requestId)
  action(request)
}

const rejectAll = (error: Error) => {
  for (const request of pending.values()) request.reject(error)
  pending.clear()
}

const restartWorker = () => {
  worker?.terminate()
  worker = null
}

const getWorker = () => {
  if (worker) return worker
  worker = new Worker(new URL('../workers/fontId.worker.ts', import.meta.url), {
    type: 'module',
  })
  worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
    const { data } = event
    if (data.type === 'success') {
      settle(data.requestId, (request) => request.resolve(data.candidates))
      return
    }
    console.warn('[pngn font] worker error:', data.message)
    settle(data.requestId, (request) => request.reject(new Error(data.message)))
  }
  worker.onerror = (event) => {
    const error = new Error(event.message || 'The font matching worker crashed.')
    console.warn('[pngn font] worker crashed:', error.message)
    rejectAll(error)
    restartWorker()
  }
  worker.onmessageerror = () => {
    const error = new Error('The font matching worker returned a broken message.')
    console.warn('[pngn font] worker message error:', error.message)
    rejectAll(error)
    restartWorker()
  }
  return worker
}

export const warmupFontIdWorker = () => {
  getWorker()
}

const identifyFontNow = (crop: ImageData, topK: number) =>
  new Promise<FontCandidate[]>((resolve, reject) => {
    const requestId = crypto.randomUUID()
    const timer = setTimeout(() => {
      if (!pending.has(requestId)) return
      pending.delete(requestId)
      console.warn('[pngn font] identify timed out; restarting worker')
      restartWorker()
      reject(new Error('Font matching timed out.'))
    }, IDENTIFY_TIMEOUT_MS)

    pending.set(requestId, {
      resolve: (result) => {
        clearTimeout(timer)
        resolve(result)
      },
      reject: (error) => {
        clearTimeout(timer)
        reject(error)
      },
    })

    const pixels = crop.data.slice().buffer
    getWorker().postMessage(
      {
        requestId,
        pixels,
        width: crop.width,
        height: crop.height,
        topK,
      },
      [pixels],
    )
  })

export const identifyFont = (crop: ImageData, topK = 10) =>
  new Promise<FontCandidate[]>((resolve, reject) => {
    const run = () => identifyFontNow(crop, topK).then(resolve, reject)
    runQueue = runQueue.then(run, run)
  })
