import type { NeuralInpaintModel } from '../document/types'
import { ensureOnnxCached } from '../cacheOnnx'
import { warmupInpaintModel } from './inpaintClient'
import {
  INPAINT_CACHE_NAME,
  INPAINT_MODEL_MIN_BYTES,
  inpaintModelRequestUrl,
} from './modelAssets'

const inflight = new Map<NeuralInpaintModel, Promise<void>>()

// Streams weights into Cache Storage in discarded chunks so we never keep the
// 200 MB file as one JavaScript ArrayBuffer. Once those bytes land, tell the
// inpaint worker to build the ONNX session too: it will hit the now-warm
// cache with no network call and only pay the WASM/WebGPU compile cost,
// ahead of the user's first submitted selection.
export const prefetchInpaintModel = (model: NeuralInpaintModel) => {
  const existing = inflight.get(model)
  if (existing) return existing
  const promise = ensureOnnxCached(
    INPAINT_CACHE_NAME,
    inpaintModelRequestUrl(model),
    INPAINT_MODEL_MIN_BYTES[model],
  )
    .then(() => warmupInpaintModel(model))
    .catch(() => {})
  inflight.set(model, promise)
  void promise.finally(() => {
    if (inflight.get(model) === promise) inflight.delete(model)
  })
  return promise
}
