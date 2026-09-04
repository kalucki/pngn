import type { NeuralInpaintModel } from '../document/types'
import { ensureOnnxCached } from '../cacheOnnx'
import {
  INPAINT_CACHE_NAME,
  INPAINT_MODEL_MIN_BYTES,
  inpaintModelRequestUrl,
} from './modelAssets'

const inflight = new Map<NeuralInpaintModel, Promise<void>>()

// Streams weights into Cache Storage in discarded chunks so we never keep the
// 200 MB file as one JavaScript ArrayBuffer. The ONNX session is not created
// here - WASM allocation stays on the first Pro inference.
export const prefetchInpaintModel = (model: NeuralInpaintModel) => {
  const existing = inflight.get(model)
  if (existing) return existing
  const promise = ensureOnnxCached(
    INPAINT_CACHE_NAME,
    inpaintModelRequestUrl(model),
    INPAINT_MODEL_MIN_BYTES[model],
  ).catch(() => {})
  inflight.set(model, promise)
  void promise.finally(() => {
    if (inflight.get(model) === promise) inflight.delete(model)
  })
  return promise
}
