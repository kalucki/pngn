const inflight = new Map<string, Promise<void>>()

const cacheStorage = (): CacheStorage | undefined => {
  try {
    return (globalThis as { caches?: CacheStorage }).caches
  } catch {
    return undefined
  }
}

const openCache = async (cacheName: string): Promise<Cache | undefined> => {
  const storage = cacheStorage()
  if (!storage) return undefined
  try {
    return await storage.open(cacheName)
  } catch {
    // Private mode and some dedicated workers expose the API but reject on open.
    return undefined
  }
}

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

const fetchModelResponse = async (url: string, minBytes: number) => {
  const response = await fetch(url, { mode: 'cors', credentials: 'omit' })
  const total = Number(response.headers.get('content-length') ?? 0)
  const { body } = response
  if (
    !response.ok ||
    !body ||
    (total > 0 && total < minBytes) ||
    (response.headers.get('content-type') ?? '').includes('html')
  ) {
    throw new Error(
      `Failed to download model from Hugging Face (${response.status}): ${url}`,
    )
  }
  return { response, body }
}

const clonedResponse = (body: ReadableStream<Uint8Array>, source: Response) =>
  new Response(body, {
    status: source.status,
    statusText: source.statusText,
    headers: source.headers,
  })

const downloadIntoCache = async (
  cacheName: string,
  url: string,
  minBytes: number,
) => {
  const cache = await openCache(cacheName)
  if (!cache) return
  if (await cache.match(url)) return

  const { response, body } = await fetchModelResponse(url, minBytes)
  const [progressSide, cacheSide] = body.tee()
  let received: number
  try {
    const progress = await Promise.all([
      discardBody(progressSide),
      cache.put(url, clonedResponse(cacheSide, response)),
    ])
    received = progress[0]
  } catch {
    // Quota and private-mode puts fail after open() succeeds. The worker can
    // still load from the network.
    return
  }
  if (received < minBytes) {
    await cache.delete(url)
    throw new Error(
      `Hugging Face model was too small (${received} bytes): ${url}`,
    )
  }
}

const blobFromNetwork = async (url: string, minBytes: number) => {
  const { response } = await fetchModelResponse(url, minBytes)
  const blob = await response.blob()
  if (blob.size < minBytes) {
    throw new Error(
      `Hugging Face model was too small (${blob.size} bytes): ${url}`,
    )
  }
  return blob
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
  // Catch on this branch so a rejected download is not reported twice: once
  // from the caller and again from the unhandled `finally` promise.
  void promise
    .catch(() => {})
    .finally(() => {
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
  const cached = await (await openCache(cacheName))?.match(url)
  if (cached) return URL.createObjectURL(await cached.blob())
  return URL.createObjectURL(await blobFromNetwork(url, minBytes))
}
