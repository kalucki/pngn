/// <reference lib="webworker" />

import * as ort from 'onnxruntime-web/webgpu'
import type { NeuralInpaintModel } from '../document/types'
import { onnxObjectUrl } from '../cacheOnnx'
import {
  INPAINT_CACHE_NAME,
  INPAINT_MODEL_MIN_BYTES,
  inpaintModelRequestUrl,
} from '../processing/modelAssets'

type InpaintRequest = {
  requestId: string
  model: NeuralInpaintModel
  pixels: ArrayBuffer
  mask: ArrayBuffer
  width: number
  height: number
}

type InpaintResponse =
  | {
      requestId: string
      type: 'success'
      pixels: ArrayBuffer
      width: number
      height: number
      provider: 'webgpu' | 'wasm'
    }
  | { requestId: string; type: 'error'; message: string }

type ModelSpec = {
  url: string
  minBytes: number
} & (
  | {
      // Self-contained pipeline: full-resolution uint8 NCHW image + uint8 mask
      // (255 = hole), returns full-resolution uint8 NCHW. Handles its own
      // internal 512 resize/normalise. This is the MI-GAN `migan_pipeline_v2`.
      style: 'pipeline-uint8'
    }
  | {
      // Fixed square float network: resize to `size`, RGB float NCHW in [0,1],
      // mask float NCHW with 1 = hole; resize the result back. This is LaMa.
      style: 'fixed-float'
      size: number
    }
)

const MODEL_SPECS: Record<NeuralInpaintModel, ModelSpec> = {
  migan: {
    url: inpaintModelRequestUrl('migan'),
    style: 'pipeline-uint8',
    minBytes: INPAINT_MODEL_MIN_BYTES.migan,
  },
  lama: {
    url: inpaintModelRequestUrl('lama'),
    style: 'fixed-float',
    size: 512,
    minBytes: INPAINT_MODEL_MIN_BYTES.lama,
  },
}

let cachedGpuProvider: 'webgpu' | 'wasm' | null = null
const gpuRunFailed = new Set<NeuralInpaintModel>()

const detectGpuProvider = async (): Promise<'webgpu' | 'wasm'> => {
  if (cachedGpuProvider) return cachedGpuProvider
  cachedGpuProvider = 'wasm'
  try {
    const gpu = (navigator as unknown as { gpu?: GPU }).gpu
    if (gpu && (await gpu.requestAdapter())) cachedGpuProvider = 'webgpu'
  } catch {
    cachedGpuProvider = 'wasm'
  }
  return cachedGpuProvider
}

// Default onnxruntime-web is JSEP, which still breaks LaMa's FFC Add. This
// worker loads the C++ WebGPU EP (PR 25160) and falls back to wasm if that
// session or run fails. https://github.com/microsoft/onnxruntime/issues/24744
const preferredProvider = async (
  model: NeuralInpaintModel,
): Promise<'webgpu' | 'wasm'> => {
  if (gpuRunFailed.has(model)) return 'wasm'
  return detectGpuProvider()
}

type LoadedSession = {
  session: ort.InferenceSession
  provider: 'webgpu' | 'wasm'
  imageInput: string
  maskInput: string
  output: string
}

const sessions = new Map<string, Promise<LoadedSession>>()

const sessionCacheKey = (
  model: NeuralInpaintModel,
  provider: 'webgpu' | 'wasm',
) => `${model}:${provider}`

const configureWasm = () => {
  ort.env.wasm.numThreads = Math.max(
    1,
    Math.min(4, (navigator.hardwareConcurrency ?? 4) - 1),
  )
}

const createSession = async (
  model: NeuralInpaintModel,
  provider: 'webgpu' | 'wasm',
): Promise<LoadedSession> => {
  if (provider === 'wasm') configureWasm()
  const spec = MODEL_SPECS[model]
  const source = await onnxObjectUrl(INPAINT_CACHE_NAME, spec.url, spec.minBytes)
  try {
    const session = await ort.InferenceSession.create(source, {
      executionProviders:
        provider === 'webgpu' ? ['webgpu', 'wasm'] : ['wasm'],
      graphOptimizationLevel: 'all',
    })
    const maskInput =
      session.inputNames.find((name) => /mask|mark/i.test(name)) ??
      session.inputNames[1] ??
      session.inputNames[0]
    const imageInput =
      session.inputNames.find((name) => name !== maskInput) ??
      session.inputNames[0]
    console.info('[pngn inpaint]', model, 'session', provider)
    return {
      session,
      provider,
      imageInput,
      maskInput,
      output: session.outputNames[0],
    }
  } finally {
    URL.revokeObjectURL(source)
  }
}

const loadSession = (
  model: NeuralInpaintModel,
  provider: 'webgpu' | 'wasm',
): Promise<LoadedSession> => {
  const key = sessionCacheKey(model, provider)
  const existing = sessions.get(key)
  if (existing) return existing
  const promise = createSession(model, provider)
  sessions.set(key, promise)
  void promise.catch(() => {
    if (sessions.get(key) === promise) sessions.delete(key)
  })
  return promise
}

const dropSession = async (
  model: NeuralInpaintModel,
  provider: 'webgpu' | 'wasm',
) => {
  const key = sessionCacheKey(model, provider)
  const pending = sessions.get(key)
  sessions.delete(key)
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

const resizeRgba = (
  image: ImageData,
  width: number,
  height: number,
  smooth: boolean,
) => {
  const source = new OffscreenCanvas(image.width, image.height)
  getContext(source).putImageData(image, 0, 0)
  const target = new OffscreenCanvas(width, height)
  const context = getContext(target)
  context.imageSmoothingEnabled = smooth
  context.imageSmoothingQuality = 'high'
  context.drawImage(source, 0, 0, width, height)
  return context.getImageData(0, 0, width, height)
}

const maskToImageData = (mask: Uint8Array, width: number, height: number) => {
  const pixels = new Uint8ClampedArray(width * height * 4)
  for (let index = 0; index < mask.length; index += 1) {
    const value = mask[index]
    const offset = index * 4
    pixels[offset] = value
    pixels[offset + 1] = value
    pixels[offset + 2] = value
    pixels[offset + 3] = 255
  }
  return new ImageData(pixels, width, height)
}

// ---- MI-GAN pipeline (full-resolution uint8 NCHW) ----------------------------

const runPipelineUint8 = async (
  loaded: LoadedSession,
  crop: ImageData,
  mask: Uint8Array,
) => {
  const { width, height } = crop
  const plane = width * height
  const image = new Uint8Array(plane * 3)
  for (let index = 0; index < plane; index += 1) {
    const source = index * 4
    image[index] = crop.data[source]
    image[plane + index] = crop.data[source + 1]
    image[plane * 2 + index] = crop.data[source + 2]
  }
  const maskData = new Uint8Array(plane)
  for (let index = 0; index < plane; index += 1) {
    maskData[index] = mask[index] ? 255 : 0
  }
  const feeds: Record<string, ort.Tensor> = {
    [loaded.imageInput]: new ort.Tensor('uint8', image, [1, 3, height, width]),
    [loaded.maskInput]: new ort.Tensor('uint8', maskData, [1, 1, height, width]),
  }
  const results = await loaded.session.run(feeds)
  const output = results[loaded.output].data as Uint8Array
  const pixels = new Uint8ClampedArray(plane * 4)
  for (let index = 0; index < plane; index += 1) {
    const offset = index * 4
    pixels[offset] = output[index]
    pixels[offset + 1] = output[plane + index]
    pixels[offset + 2] = output[plane * 2 + index]
    pixels[offset + 3] = crop.data[offset + 3]
  }
  return new ImageData(pixels, width, height)
}

// ---- LaMa (fixed square float NCHW) -----------------------------------------

const decodeFloatChw = (
  data: Float32Array,
  size: number,
  resizedImage: ImageData,
  resizedMask: ImageData,
) => {
  const plane = size * size
  let min = Infinity
  let max = -Infinity
  for (let index = 0; index < data.length; index += 1) {
    if (data[index] < min) min = data[index]
    if (data[index] > max) max = data[index]
  }
  const denormalize = (value: number) => {
    if (min < -0.05) return (value + 1) * 127.5
    if (max <= 1.5) return value * 255
    return value
  }
  // Write the network's output only inside the hole, over the resized crop, so
  // any drift outside the mask cannot leak in when we resize back.
  const pixels = new Uint8ClampedArray(resizedImage.data)
  for (let index = 0; index < plane; index += 1) {
    if (resizedMask.data[index * 4] <= 127) continue
    const offset = index * 4
    pixels[offset] = denormalize(data[index])
    pixels[offset + 1] = denormalize(data[plane + index])
    pixels[offset + 2] = denormalize(data[plane * 2 + index])
  }
  return new ImageData(pixels, size, size)
}

const runFixedFloat = async (
  loaded: LoadedSession,
  crop: ImageData,
  mask: Uint8Array,
  size: number,
) => {
  const resizedImage = resizeRgba(crop, size, size, true)
  const resizedMask = resizeRgba(
    maskToImageData(mask, crop.width, crop.height),
    size,
    size,
    false,
  )
  const plane = size * size
  const image = new Float32Array(plane * 3)
  for (let index = 0; index < plane; index += 1) {
    const source = index * 4
    image[index] = resizedImage.data[source] / 255
    image[plane + index] = resizedImage.data[source + 1] / 255
    image[plane * 2 + index] = resizedImage.data[source + 2] / 255
  }
  const maskTensor = new Float32Array(plane)
  for (let index = 0; index < plane; index += 1) {
    maskTensor[index] = resizedMask.data[index * 4] > 127 ? 1 : 0
  }
  const feeds: Record<string, ort.Tensor> = {
    [loaded.imageInput]: new ort.Tensor('float32', image, [1, 3, size, size]),
    [loaded.maskInput]: new ort.Tensor('float32', maskTensor, [1, 1, size, size]),
  }
  const results = await loaded.session.run(feeds)
  const composed = decodeFloatChw(
    results[loaded.output].data as Float32Array,
    size,
    resizedImage,
    resizedMask,
  )
  const full = resizeRgba(composed, crop.width, crop.height, true)
  const pixels = new Uint8ClampedArray(full.data)
  for (let index = 0; index < crop.width * crop.height; index += 1) {
    pixels[index * 4 + 3] = crop.data[index * 4 + 3]
  }
  return new ImageData(pixels, crop.width, crop.height)
}

const runModel = (
  loaded: LoadedSession,
  spec: ModelSpec,
  crop: ImageData,
  mask: Uint8Array,
) =>
  spec.style === 'pipeline-uint8'
    ? runPipelineUint8(loaded, crop, mask)
    : runFixedFloat(loaded, crop, mask, spec.size)

const infer = async (
  model: NeuralInpaintModel,
  spec: ModelSpec,
  crop: ImageData,
  mask: Uint8Array,
) => {
  const preferred = await preferredProvider(model)
  let loaded: LoadedSession
  try {
    loaded = await loadSession(model, preferred)
  } catch (error) {
    if (preferred !== 'webgpu') throw error
    console.warn('[pngn inpaint] WebGPU session failed; using wasm.', error)
    gpuRunFailed.add(model)
    loaded = await loadSession(model, 'wasm')
  }

  try {
    return {
      image: await runModel(loaded, spec, crop, mask),
      provider: loaded.provider,
    }
  } catch (error) {
    if (loaded.provider !== 'webgpu') throw error
    console.warn('[pngn inpaint] WebGPU run failed; retrying on wasm.', error)
    gpuRunFailed.add(model)
    await dropSession(model, 'webgpu')
    loaded = await loadSession(model, 'wasm')
    return {
      image: await runModel(loaded, spec, crop, mask),
      provider: loaded.provider,
    }
  }
}

const processRequest = async (
  request: InpaintRequest,
): Promise<InpaintResponse> => {
  const spec = MODEL_SPECS[request.model]
  const crop = new ImageData(
    new Uint8ClampedArray(request.pixels),
    request.width,
    request.height,
  )
  const mask = new Uint8Array(request.mask)
  const restored = await infer(request.model, spec, crop, mask)
  const pixels = new Uint8ClampedArray(restored.image.data)
  return {
    requestId: request.requestId,
    type: 'success',
    pixels: pixels.buffer,
    width: request.width,
    height: request.height,
    provider: restored.provider,
  }
}

self.onmessage = (event: MessageEvent<InpaintRequest>) => {
  void processRequest(event.data)
    .then((response) => {
      const transfer = response.type === 'success' ? [response.pixels] : []
      self.postMessage(response, { transfer })
    })
    .catch((error: unknown) => {
      const response: InpaintResponse = {
        requestId: event.data.requestId,
        type: 'error',
        message:
          error instanceof Error ? error.message : 'Neural inpainting failed.',
      }
      self.postMessage(response)
    })
}
