import { describe, expect, it } from 'vitest'
import { GRID_DIVISIONS, gridLinePositions } from './canvasGrid'

describe('canvas grid', () => {
  it('returns interior line positions for an 8-division image grid', () => {
    expect(gridLinePositions(800)).toEqual([100, 200, 300, 400, 500, 600, 700])
    expect(gridLinePositions(600)).toEqual([75, 150, 225, 300, 375, 450, 525])
  })

  it('does not include the image edges', () => {
    const positions = gridLinePositions(800)
    expect(positions).not.toContain(0)
    expect(positions).not.toContain(800)
  })

  it('keeps the planned grid density explicit', () => {
    expect(GRID_DIVISIONS).toBe(8)
  })
})
