import type { ProcessedImage, TextLayer } from './types'
import type { ProcessedRegion } from '../editor/processedRegions'

const DB_NAME = 'pngn-documents'
const STORE_NAME = 'autosaves'
const LAST_KEY = '__last__'

export type AutosavedDocument = {
  key: string
  savedAt: number
  file: {
    name: string
    type: string
    size: number
    lastModified: number
    blob: Blob
  }
  source: {
    width: number
    height: number
  }
  urls?: {
    clean: Blob
    mask: Blob
  }
  result: ProcessedImage | null
  layers: TextLayer[]
  regions: ProcessedRegion[]
}

const openDb = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME)
    }
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })

const withStore = async <T,>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
) => {
  const db = await openDb()
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode)
    const request = run(tx.objectStore(STORE_NAME))
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    tx.oncomplete = () => db.close()
    tx.onerror = () => {
      db.close()
      reject(tx.error)
    }
  })
}

export const saveAutosave = async (document: AutosavedDocument) => {
  await withStore('readwrite', (store) => store.put(document, document.key))
  await withStore('readwrite', (store) => store.put(document.key, LAST_KEY))
}

export const readLastAutosave = async () => {
  const key = await withStore<string | undefined>('readonly', (store) =>
    store.get(LAST_KEY),
  )
  if (!key) return null
  return withStore<AutosavedDocument | undefined>('readonly', (store) =>
    store.get(key),
  ).then((document) => document ?? null)
}
