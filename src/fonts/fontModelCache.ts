import { ensureOnnxCached } from '../cacheOnnx'
import {
  FONT_MODEL_CACHE_NAME,
  STORIA_FONT_MODEL_MIN_BYTES,
  storiaFontModelRequestUrl,
} from './fontModelAssets'

let inflight: Promise<void> | null = null

export const prefetchFontIdModel = () => {
  if (inflight) return inflight
  inflight = ensureOnnxCached(
    FONT_MODEL_CACHE_NAME,
    storiaFontModelRequestUrl(),
    STORIA_FONT_MODEL_MIN_BYTES,
  ).catch(() => {})
  void inflight.finally(() => {
    inflight = null
  })
  return inflight
}
