const inflight = new Map<string, Promise<void>>()

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

const downloadIntoCache = async (
  cacheName: string,
  url: string,
  minBytes: number,
) => {
  const cache = await caches.open(cacheName)
  if (await cache.match(url)) return

  const response = await fetch(url, { mode: 'cors', credentials: 'omit' })
  const total = Number(response.headers.get('content-length') ?? 0)
  if (
    !response.ok ||
    !response.body ||
    (total > 0 && total < minBytes) ||
    (response.headers.get('content-type') ?? '').includes('html')
  ) {
    throw new Error(
      `Failed to download model from Hugging Face (${response.status}): ${url}`,
    )
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
    throw new Error(
      `Hugging Face model was too small (${received} bytes): ${url}`,
    )
  }
}

export const ensureOnnxCached = (
  cacheName: string,
  url: string,
  minBytes: number,
) => {
  const key = `${cacheName}:${url}`
  const existing = inflight.get(key)
  if (existing) return existing
  const promise = downloadIntoCache(cacheName, url, minBytes)
  inflight.set(key, promise)
  void promise.finally(() => {
    if (inflight.get(key) === promise) inflight.delete(key)
  })
  return promise
}

export const onnxObjectUrl = async (
  cacheName: string,
  url: string,
  minBytes: number,
) => {
  await ensureOnnxCached(cacheName, url, minBytes)
  const cached = await (await caches.open(cacheName)).match(url)
  if (!cached) {
    throw new Error(`Model was not cached after download: ${url}`)
  }
  return URL.createObjectURL(await cached.blob())
}
