import { beforeEach, describe, expect, it } from 'vitest'
import {
  EDITOR_SHOW_GRID_STORAGE_KEY,
  EDITOR_ZOOM_STORAGE_KEY,
  editorDocumentKey,
  parseZoomTransform,
  readEditorZoom,
  readShowGrid,
  writeShowGrid,
  writeEditorZoom,
} from './editorSession'
import { IDENTITY_ZOOM, MAX_ZOOM } from './imageZoom'

const sessionMemory = new Map<string, string>()
const localMemory = new Map<string, string>()

const createStorage = (memory: Map<string, string>): Storage => ({
  get length() {
    return memory.size
  },
  clear: () => memory.clear(),
  getItem: (key) => memory.get(key) ?? null,
  key: (index) => [...memory.keys()][index] ?? null,
  removeItem: (key) => {
    memory.delete(key)
  },
  setItem: (key, value) => {
    memory.set(key, value)
  },
})

const installStorage = () => {
  Object.defineProperty(globalThis, 'sessionStorage', {
    configurable: true,
    value: createStorage(sessionMemory),
  })
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: createStorage(localMemory),
  })
}

describe('editor session zoom', () => {
  beforeEach(() => {
    sessionMemory.clear()
    localMemory.clear()
    installStorage()
  })

  it('builds a stable key from the source file and dimensions', () => {
    expect(
      editorDocumentKey(
        { name: 'sign.jpg', size: 1200, lastModified: 77 },
        1600,
        900,
      ),
    ).toBe('sign.jpg:1200:77:1600x900')
  })

  it('round-trips a zoom transform for the same document', () => {
    const zoom = { scale: 2.5, x: -40, y: 12 }
    writeEditorZoom('doc-a', zoom)
    expect(readEditorZoom('doc-a')).toEqual(zoom)
  })

  it('does not reuse zoom from a different document', () => {
    writeEditorZoom('doc-a', { scale: 3, x: 10, y: 20 })
    expect(readEditorZoom('doc-b')).toEqual(IDENTITY_ZOOM)
  })

  it('returns identity zoom when nothing is stored', () => {
    expect(readEditorZoom('doc-a')).toEqual(IDENTITY_ZOOM)
  })

  it('ignores a corrupt session payload', () => {
    sessionStorage.setItem(EDITOR_ZOOM_STORAGE_KEY, '{not json')
    expect(readEditorZoom('doc-a')).toEqual(IDENTITY_ZOOM)
  })

  it('clamps an oversized scale and rejects non-finite values', () => {
    expect(parseZoomTransform({ scale: 40, x: 1, y: 2 })).toEqual({
      scale: MAX_ZOOM,
      x: 1,
      y: 2,
    })
    expect(parseZoomTransform({ scale: 2, x: Number.NaN, y: 0 })).toBeNull()
    expect(parseZoomTransform({ scale: 1, x: 8, y: 9 })).toEqual(IDENTITY_ZOOM)
  })
})

describe('editor grid preference', () => {
  beforeEach(() => {
    sessionMemory.clear()
    localMemory.clear()
    installStorage()
  })

  it('defaults to hidden when nothing is stored', () => {
    expect(readShowGrid()).toBe(false)
  })

  it('round-trips the grid preference in local storage', () => {
    writeShowGrid(true)
    expect(readShowGrid()).toBe(true)
    writeShowGrid(false)
    expect(readShowGrid()).toBe(false)
  })

  it('treats invalid stored values as hidden', () => {
    localStorage.setItem(EDITOR_SHOW_GRID_STORAGE_KEY, '{not json')
    expect(readShowGrid()).toBe(false)
  })
})
