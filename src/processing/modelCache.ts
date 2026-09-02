import type { NeuralInpaintModel } from '../document/types'
import {
  INPAINT_CACHE_NAME,
  INPAINT_MODEL_MIN_BYTES,
  inpaintModelRequestUrl,
} from './modelAssets'

const inflight = new Map<NeuralInpaintModel, Promise<void>>()

const discardBody = async (body: ReadableStream<Uint8Array>) => {
  const reader = body.getReader()
  let received = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    received += value.byteLength
  }
  return received
}

const prefetchUrl = async (model: NeuralInpaintModel) => {
  const url = inpaintModelRequestUrl(model)
  const minBytes = INPAINT_MODEL_MIN_BYTES[model]
  const cache = await caches.open(INPAINT_CACHE_NAME)
  const existing = await cache.match(url)
  if (existing) return
  const response = await fetch(url)
  const total = Number(response.headers.get('content-length') ?? 0)
  if (!response.ok || !response.body || (total > 0 && total < minBytes)) {
    throw new Error(`Prefetch failed for ${url}: HTTP ${response.status}`)
  }
  const [progressSide, cacheSide] = response.body.tee()
  const [received] = await Promise.all([
    discardBody(progressSide),
    cache.put(
      url,
      new Response(cacheSide, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      }),
    ),
  ])
  if (received < minBytes) {
    await cache.delete(url)
    throw new Error(`Prefetch of ${url} was too small (${received} bytes).`)
  }
}

// Streams weights into Cache Storage in discarded chunks so we never keep the
// 200 MB file as one JavaScript ArrayBuffer. The ONNX session is not created
// here — WASM allocation stays on the first Pro inference.
export const prefetchInpaintModel = (model: NeuralInpaintModel) => {
  const existing = inflight.get(model)
  if (existing) return existing
  const promise = prefetchUrl(model).catch(() => {})
  inflight.set(model, promise)
  void promise.finally(() => {
    if (inflight.get(model) === promise) inflight.delete(model)
  })
  return promise
}
