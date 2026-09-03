/// <reference lib="webworker" />

import * as ort from 'onnxruntime-web/webgpu'
import {
  FONT_MODEL_CACHE_NAME,
  STORIA_FONT_LABELS_URL,
  STORIA_FONT_MODEL_MIN_BYTES,
  storiaFontModelRequestUrl,
} from '../fonts/fontModelAssets'
import {
  labelToCandidate,
  type FontCandidate,
  type StoriaFontLabel,
} from '../fonts/storiaLabels'

type FontIdRequest = {
  requestId: string
  pixels: ArrayBuffer
  width: number
  height: number
  topK?: number
}

type FontIdResponse =
  | {
      requestId: string
      type: 'success'
      provider: 'webgpu' | 'wasm'
      candidates: FontCandidate[]
    }
  | { requestId: string; type: 'error'; message: string }

const INPUT_SIZE = 320
const IMAGE_NET_MEAN = [0.485, 0.456, 0.406]
const IMAGE_NET_STD = [0.229, 0.224, 0.225]

let cachedProvider: 'webgpu' | 'wasm' | null = null
let gpuRunFailed = false
let labelsPromise: Promise<StoriaFontLabel[]> | null = null

type LoadedSession = {
  session: ort.InferenceSession
  provider: 'webgpu' | 'wasm'
  input: string
  output: string
}

let sessionPromise: Promise<LoadedSession> | null = null

const detectProvider = async (): Promise<'webgpu' | 'wasm'> => {
  if (cachedProvider) return cachedProvider
  cachedProvider = 'wasm'
  try {
    const gpu = (navigator as unknown as { gpu?: GPU }).gpu
    if (gpu && (await gpu.requestAdapter())) cachedProvider = 'webgpu'
  } catch {
    cachedProvider = 'wasm'
  }
  return cachedProvider
}

const preferredProvider = async (): Promise<'webgpu' | 'wasm'> => {
  if (gpuRunFailed) return 'wasm'
  return detectProvider()
}

const probeModel = async (url: string) => {
  const response = await fetch(url, { method: 'HEAD', cache: 'no-store' })
  const size = Number(response.headers.get('content-length') ?? 0)
  if (
    !response.ok ||
    size < STORIA_FONT_MODEL_MIN_BYTES ||
    (response.headers.get('content-type') ?? '').includes('html')
  ) {
    throw new Error(
      'Font model is missing. Run pnpm fetch:models before using font matching.',
    )
  }
}

const openCachedModel = async (url: string) => {
  const cache = await caches.open(FONT_MODEL_CACHE_NAME)
  const cached = await cache.match(url)
  if (!cached) return null
  return URL.createObjectURL(await cached.blob())
}

const loadLabels = () => {
  labelsPromise ??= fetch(STORIA_FONT_LABELS_URL).then(async (response) => {
    if (!response.ok) {
      throw new Error('Font labels are missing. Run pnpm fetch:models.')
    }
    const labels = (await response.json()) as StoriaFontLabel[]
    if (!Array.isArray(labels) || labels.length < 3000) {
      throw new Error('Font labels are invalid. Run pnpm fetch:models.')
    }
    console.info('[pngn font] loaded', labels.length, 'Storia labels')
    return labels
  })
  return labelsPromise
}

const configureWasm = () => {
  ort.env.wasm.numThreads = Math.max(
    1,
    Math.min(4, (navigator.hardwareConcurrency ?? 4) - 1),
  )
}

const createSession = async (provider: 'webgpu' | 'wasm') => {
  if (provider === 'wasm') configureWasm()
  const url = storiaFontModelRequestUrl()
  const cachedUrl = await openCachedModel(url)
  if (!cachedUrl) await probeModel(url)
  const source = cachedUrl ?? url
  try {
    const session = await ort.InferenceSession.create(source, {
      executionProviders:
        provider === 'webgpu' ? ['webgpu', 'wasm'] : ['wasm'],
      graphOptimizationLevel: 'all',
    })
    console.info(
      '[pngn font] Storia model ready',
      provider,
      cachedUrl ? 'cache' : 'network',
    )
    return {
      session,
      provider,
      input: session.inputNames[0],
      output: session.outputNames[0],
    }
  } finally {
    if (cachedUrl) URL.revokeObjectURL(cachedUrl)
  }
}

const loadSession = (provider?: 'webgpu' | 'wasm') => {
  if (sessionPromise) return sessionPromise
  sessionPromise = (async () => {
    const chosen = provider ?? (await preferredProvider())
    try {
      return await createSession(chosen)
    } catch (error) {
      if (chosen !== 'webgpu') throw error
      console.warn('[pngn font] WebGPU session failed; using wasm.', error)
      gpuRunFailed = true
      return createSession('wasm')
    }
  })()
  void sessionPromise.catch(() => {
    sessionPromise = null
  })
  return sessionPromise
}

const dropSession = async () => {
  const pending = sessionPromise
  sessionPromise = null
  if (!pending) return
  try {
    const loaded = await pending
    await loaded.session.release()
  } catch {
    // Session never loaded, or release is unavailable.
  }
}

const getContext = (canvas: OffscreenCanvas) => {
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas 2D is unavailable in this worker.')
  return context
}

const letterbox = (image: ImageData) => {
  const source = new OffscreenCanvas(image.width, image.height)
  getContext(source).putImageData(image, 0, 0)

  const target = new OffscreenCanvas(INPUT_SIZE, INPUT_SIZE)
  const context = getContext(target)
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, INPUT_SIZE, INPUT_SIZE)
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'

  const scale = Math.min(INPUT_SIZE / image.width, INPUT_SIZE / image.height)
  const width = Math.max(1, Math.round(image.width * scale))
  const height = Math.max(1, Math.round(image.height * scale))
  const x = Math.floor((INPUT_SIZE - width) / 2)
  const y = Math.floor((INPUT_SIZE - height) / 2)
  context.drawImage(source, x, y, width, height)
  return context.getImageData(0, 0, INPUT_SIZE, INPUT_SIZE)
}

const preprocess = (image: ImageData) => {
  const resized = letterbox(image)
  const plane = INPUT_SIZE * INPUT_SIZE
  const data = new Float32Array(plane * 3)
  for (let index = 0; index < plane; index += 1) {
    const source = index * 4
    data[index] = resized.data[source] / 255
    data[plane + index] = resized.data[source + 1] / 255
    data[plane * 2 + index] = resized.data[source + 2] / 255
  }
  for (let channel = 0; channel < 3; channel += 1) {
    const start = channel * plane
    for (let index = 0; index < plane; index += 1) {
      data[start + index] =
        (data[start + index] - IMAGE_NET_MEAN[channel]) / IMAGE_NET_STD[channel]
    }
  }
  return data
}

const topKSoftmax = (logits: Float32Array, k: number) => {
  let max = -Infinity
  for (const value of logits) {
    if (value > max) max = value
  }
  let total = 0
  const scored: Array<{ index: number; score: number }> = []
  for (let index = 0; index < logits.length; index += 1) {
    const score = Math.exp(logits[index] - max)
    total += score
    scored.push({ index, score })
  }
  return scored
    .sort((left, right) => right.score - left.score)
    .slice(0, k)
    .map(({ index, score }) => ({ index, score: score / total }))
}

const runLogits = async (loaded: LoadedSession, input: Float32Array) => {
  const results = await loaded.session.run({
    [loaded.input]: new ort.Tensor('float32', input, [
      1,
      3,
      INPUT_SIZE,
      INPUT_SIZE,
    ]),
  })
  return results[loaded.output].data as Float32Array
}

const processRequest = async (
  request: FontIdRequest,
): Promise<FontIdResponse> => {
  const [loaded, labels] = await Promise.all([loadSession(), loadLabels()])
  const image = new ImageData(
    new Uint8ClampedArray(request.pixels),
    request.width,
    request.height,
  )
  const input = preprocess(image)
  let session = loaded
  let logits: Float32Array
  try {
    logits = await runLogits(session, input)
  } catch (error) {
    if (session.provider !== 'webgpu') throw error
    console.warn('[pngn font] WebGPU run failed; retrying on wasm.', error)
    gpuRunFailed = true
    await dropSession()
    session = await loadSession('wasm')
    logits = await runLogits(session, input)
  }
  const candidates = topKSoftmax(logits, request.topK ?? 10)
    .map(({ index, score }) => {
      const label = labels[index]
      return label ? labelToCandidate(label, score) : null
    })
    .filter((candidate): candidate is FontCandidate => Boolean(candidate))
  return {
    requestId: request.requestId,
    type: 'success',
    provider: session.provider,
    candidates,
  }
}

let tail: Promise<void> = Promise.resolve()

self.onmessage = (event: MessageEvent<FontIdRequest>) => {
  tail = tail
    .catch(() => undefined)
    .then(async () => {
      try {
        self.postMessage(await processRequest(event.data))
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : 'Font matching failed.'
        console.warn('[pngn font] inference failed:', message)
        const response: FontIdResponse = {
          requestId: event.data.requestId,
          type: 'error',
          message,
        }
        self.postMessage(response)
      }
    })
}

