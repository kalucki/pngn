import { describe, expect, it } from 'vitest'
import { nextSelectedLayerIds } from './layerSelection'

describe('nextSelectedLayerIds', () => {
  it('selects only the clicked layer without shift', () => {
    expect(nextSelectedLayerIds(['a'], 'b', false)).toEqual(['b'])
    expect(nextSelectedLayerIds(['a', 'b'], 'b', false)).toEqual(['b'])
  })

  it('clears the selection when clicking empty space without shift', () => {
    expect(nextSelectedLayerIds(['a', 'b'], null, false)).toEqual([])
  })

  it('keeps the selection when clicking empty space with shift', () => {
    expect(nextSelectedLayerIds(['a'], null, true)).toEqual(['a'])
  })

  it('adds another layer with shift after one is already selected', () => {
    expect(nextSelectedLayerIds(['a'], 'b', true)).toEqual(['a', 'b'])
  })

  it('keeps the first selected layer first so the toolbar can stay on it', () => {
    expect(nextSelectedLayerIds(['first'], 'second', true)[0]).toBe('first')
  })

  it('selects the clicked layer with shift when nothing is selected yet', () => {
    expect(nextSelectedLayerIds([], 'a', true)).toEqual(['a'])
  })

  it('toggles an extra selected layer off with shift', () => {
    expect(nextSelectedLayerIds(['a', 'b'], 'b', true)).toEqual(['a'])
    expect(nextSelectedLayerIds(['a', 'b'], 'a', true)).toEqual(['b'])
  })

  it('keeps the last remaining layer selected on shift click', () => {
    expect(nextSelectedLayerIds(['a'], 'a', true)).toEqual(['a'])
  })
})
