/// <reference lib="webworker" />

type OpenCvModule = typeof import('@techstark/opencv-js')
type OpenCv = OpenCvModule

type OpenCvRequest = {
  requestId: string
  pixels: ArrayBuffer
  mask: ArrayBuffer
  width: number
  height: number
  method: 'telea' | 'navier-stokes'
  radius: number
}

type OpenCvResponse =
  | { requestId: string; type: 'success'; pixels: ArrayBuffer }
  | { requestId: string; type: 'error'; message: string }

let ready: Promise<OpenCv> | null = null

const getOpenCv = () => {
  ready ??= import('@techstark/opencv-js').then(async (module) => {
    const candidate = module as OpenCvModule & {
      default?: OpenCv | Promise<OpenCv>
    }
    return candidate.default ? await candidate.default : candidate
  })
  return ready
}

const processRequest = async (request: OpenCvRequest) => {
  const cv = await getOpenCv()
  const crop = new ImageData(
    new Uint8ClampedArray(request.pixels),
    request.width,
    request.height,
  )
  const mask = new Uint8Array(request.mask)
  const resources: Array<{ delete: () => void }> = []
  try {
    const rgba = cv.matFromImageData(crop)
    resources.push(rgba)
    const rgb = new cv.Mat()
    resources.push(rgb)
    cv.cvtColor(rgba, rgb, cv.COLOR_RGBA2RGB)
    const maskMat = cv.matFromArray(
      request.height,
      request.width,
      cv.CV_8UC1,
      mask,
    )
    resources.push(maskMat)
    const restoredRgb = new cv.Mat()
    resources.push(restoredRgb)
    cv.inpaint(
      rgb,
      maskMat,
      restoredRgb,
      request.radius,
      request.method === 'telea' ? cv.INPAINT_TELEA : cv.INPAINT_NS,
    )
    const restoredRgba = new cv.Mat()
    resources.push(restoredRgba)
    cv.cvtColor(restoredRgb, restoredRgba, cv.COLOR_RGB2RGBA)
    const pixels = new Uint8ClampedArray(restoredRgba.data)
    for (let index = 0; index < request.width * request.height; index += 1) {
      pixels[index * 4 + 3] = crop.data[index * 4 + 3]
    }
    const response: OpenCvResponse = {
      requestId: request.requestId,
      type: 'success',
      pixels: pixels.buffer,
    }
    self.postMessage(response, { transfer: [pixels.buffer] })
  } finally {
    for (const resource of resources.reverse()) resource.delete()
  }
}

self.onmessage = (event: MessageEvent<OpenCvRequest>) => {
  void processRequest(event.data).catch((error: unknown) => {
    const response: OpenCvResponse = {
      requestId: event.data.requestId,
      type: 'error',
      message: error instanceof Error ? error.message : 'OpenCV inpainting failed.',
    }
    self.postMessage(response)
  })
}
