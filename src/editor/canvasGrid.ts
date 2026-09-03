export const GRID_DIVISIONS = 8

export const gridLinePositions = (size: number, divisions = GRID_DIVISIONS) => {
  if (!Number.isFinite(size) || size <= 0 || divisions < 2) return []
  const step = size / divisions
  return Array.from({ length: divisions - 1 }, (_, index) => step * (index + 1))
}

export const drawCanvasGrid = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
) => {
  const verticalLines = gridLinePositions(width)
  const horizontalLines = gridLinePositions(height)
  const lineWidth = Math.max(1, width / 1600)

  const drawLines = () => {
    context.beginPath()
    for (const x of verticalLines) {
      context.moveTo(x, 0)
      context.lineTo(x, height)
    }
    for (const y of horizontalLines) {
      context.moveTo(0, y)
      context.lineTo(width, y)
    }
    context.stroke()
  }

  context.save()
  context.setLineDash([width / 220, width / 280])
  context.lineWidth = lineWidth * 2
  context.strokeStyle = 'rgba(0, 0, 0, 0.35)'
  drawLines()
  context.lineWidth = lineWidth
  context.strokeStyle = 'rgba(255, 255, 255, 0.55)'
  drawLines()
  context.restore()
}
