import { describe, expect, it } from 'vitest'
import { groupLineIndices, onSameLine } from './inpaintGroups'

describe('groupLineIndices', () => {
  it('merges neighboring words on one line', () => {
    expect(
      groupLineIndices([
        { x: 10, y: 20, width: 40, height: 18 },
        { x: 62, y: 22, width: 36, height: 16 },
      ]),
    ).toEqual([[0, 1]])
  })

  it('keeps stacked lines in separate groups', () => {
    expect(
      groupLineIndices([
        { x: 10, y: 20, width: 80, height: 18 },
        { x: 10, y: 70, width: 80, height: 18 },
      ]),
    ).toEqual([[0], [1]])
  })

  it('does not treat a far-apart box as the same line', () => {
    expect(
      onSameLine(
        { x: 10, y: 20, width: 40, height: 16 },
        { x: 200, y: 22, width: 40, height: 16 },
      ),
    ).toBe(false)
  })
})
