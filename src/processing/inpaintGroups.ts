import type { Bounds } from '../document/types'

const verticalOverlap = (left: Bounds, right: Bounds) => {
  const top = Math.max(left.y, right.y)
  const bottom = Math.min(left.y + left.height, right.y + right.height)
  return Math.max(0, bottom - top)
}

const horizontalGap = (left: Bounds, right: Bounds) => {
  const overlap = Math.min(left.x + left.width, right.x + right.width) - Math.max(left.x, right.x)
  return overlap >= 0 ? 0 : -overlap
}

export const onSameLine = (left: Bounds, right: Bounds) => {
  const minHeight = Math.min(left.height, right.height)
  const maxHeight = Math.max(left.height, right.height)
  return (
    verticalOverlap(left, right) >= 0.3 * Math.max(1, minHeight) &&
    horizontalGap(left, right) <= 1.5 * Math.max(1, maxHeight)
  )
}

export const groupLineIndices = (bounds: Bounds[]) => {
  const parent = bounds.map((_, index) => index)
  const find = (index: number): number => {
    while (parent[index] !== index) {
      parent[index] = parent[parent[index]]
      index = parent[index]
    }
    return index
  }
  const merge = (left: number, right: number) => {
    const leftRoot = find(left)
    const rightRoot = find(right)
    if (leftRoot !== rightRoot) parent[rightRoot] = leftRoot
  }

  for (let left = 0; left < bounds.length; left += 1) {
    for (let right = left + 1; right < bounds.length; right += 1) {
      if (onSameLine(bounds[left], bounds[right])) merge(left, right)
    }
  }

  const groups = new Map<number, number[]>()
  for (let index = 0; index < bounds.length; index += 1) {
    const root = find(index)
    const group = groups.get(root)
    if (group) group.push(index)
    else groups.set(root, [index])
  }
  return [...groups.values()]
    .map((group) => [...group].sort((left, right) => left - right))
    .sort((left, right) => left[0] - right[0])
}
