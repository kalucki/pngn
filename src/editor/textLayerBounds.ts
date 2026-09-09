import type { TextLayer } from '../document/types'
import { isMonospaceFont } from './fonts'

export const withTextSizeBounds = (layer: TextLayer): TextLayer => {
  const lines = layer.text.split('\n')
  const longestLine = lines.reduce(
    (longest, line) => (line.length > longest.length ? line : longest),
    '',
  )
  const estimatedWidth =
    longestLine.length *
    layer.typography.fontSize *
    (isMonospaceFont(layer.typography.fontFamily) ? 0.62 : 0.56)
  return {
    ...layer,
    bounds: {
      ...layer.bounds,
      width: Math.max(layer.bounds.width, estimatedWidth),
      height: Math.max(
        layer.bounds.height,
        lines.length * layer.typography.fontSize * layer.typography.lineHeight,
      ),
    },
  }
}

export const withFontSize = (layer: TextLayer, fontSize: number) =>
  withTextSizeBounds({
    ...layer,
    typography: { ...layer.typography, fontSize },
  })
