type OpenCvMethod = 'telea' | 'navier-stokes'

type OpenCvResponse =
  | { requestId: string; type: 'success'; pixels: ArrayBuffer }
  | { requestId: string; type: 'error'; message: string }

type PendingRequest = {
  width: number
  height: number
  resolve: (image: ImageData) => void
  reject: (error: Error) => void
}

let worker: Worker | null = null
const pending = new Map<string, PendingRequest>()

const getWorker = () => {
  if (worker) return worker
  worker = new Worker(new URL('../workers/opencv.worker.ts', import.meta.url), {
    type: 'module',
  })
  worker.onmessage = (event: MessageEvent<OpenCvResponse>) => {
    const request = pending.get(event.data.requestId)
    if (!request) return
    pending.delete(event.data.requestId)
    if (event.data.type === 'error') {
      request.reject(new Error(event.data.message))
      return
    }
    request.resolve(
      new ImageData(
        new Uint8ClampedArray(event.data.pixels),
        request.width,
        request.height,
      ),
    )
  }
  worker.onerror = (event) => {
    const error = new Error(event.message || 'OpenCV worker crashed.')
    for (const request of pending.values()) request.reject(error)
    pending.clear()
    worker?.terminate()
    worker = null
  }
  return worker
}

export const warmupOpenCvWorker = () => {
  getWorker()
}

// Triggers the actual `@techstark/opencv-js` WASM import/compile. OpenCV is
// only the fallback path (a failed neural inpaint, or an explicit classical
// method), so this is called on file drop rather than at app mount, giving
// it time to finish before it might be needed without loading it for every
// visitor who never uploads an image.
export const warmupOpenCvModule = () => {
  getWorker().postMessage({ type: 'warmup' })
}

export const openCvInpaint = (
  crop: ImageData,
  mask: Uint8Array,
  method: OpenCvMethod,
  radius: number,
) =>
  new Promise<ImageData>((resolve, reject) => {
    const requestId = crypto.randomUUID()
    pending.set(requestId, {
      width: crop.width,
      height: crop.height,
      resolve,
      reject,
    })
    const pixels = crop.data.slice().buffer
    const maskBuffer = mask.slice().buffer
    getWorker().postMessage(
      {
        type: 'run',
        requestId,
        pixels,
        mask: maskBuffer,
        width: crop.width,
        height: crop.height,
        method,
        radius,
      },
      [pixels, maskBuffer],
    )
  })
