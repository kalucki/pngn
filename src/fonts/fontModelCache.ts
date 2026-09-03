import {
  FONT_MODEL_CACHE_NAME,
  STORIA_FONT_MODEL_MIN_BYTES,
  storiaFontModelRequestUrl,
} from './fontModelAssets'

let inflight: Promise<void> | null = null

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

const prefetchUrl = async () => {
  const url = storiaFontModelRequestUrl()
  const cache = await caches.open(FONT_MODEL_CACHE_NAME)
  const existing = await cache.match(url)
  if (existing) return
  const response = await fetch(url)
  const total = Number(response.headers.get('content-length') ?? 0)
  if (
    !response.ok ||
    !response.body ||
    (total > 0 && total < STORIA_FONT_MODEL_MIN_BYTES)
  ) {
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
  if (received < STORIA_FONT_MODEL_MIN_BYTES) {
    await cache.delete(url)
    throw new Error(`Prefetch of ${url} was too small (${received} bytes).`)
  }
}

export const prefetchFontIdModel = () => {
  if (inflight) return inflight
  inflight = prefetchUrl().catch(() => {})
  void inflight.finally(() => {
    inflight = null
  })
  return inflight
}

