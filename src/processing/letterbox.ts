export type LetterboxLayout = {
  size: number
  scale: number
  x: number
  y: number
  contentWidth: number
  contentHeight: number
}

export const letterboxLayout = (
  width: number,
  height: number,
  size: number,
): LetterboxLayout => {
  const scale = size / Math.max(width, height, 1)
  const contentWidth = Math.max(1, Math.round(width * scale))
  const contentHeight = Math.max(1, Math.round(height * scale))
  return {
    size,
    scale,
    x: Math.floor((size - contentWidth) / 2),
    y: Math.floor((size - contentHeight) / 2),
    contentWidth,
    contentHeight,
  }
}

export const meanUnmaskedColor = (
  image: ImageData,
  mask: Uint8Array,
): [number, number, number] => {
  let red = 0
  let green = 0
  let blue = 0
  let count = 0
  const pixels = image.width * image.height
  for (let index = 0; index < pixels; index += 1) {
    if (mask[index]) continue
    const source = index * 4
    red += image.data[source]
    green += image.data[source + 1]
    blue += image.data[source + 2]
    count += 1
  }
  if (!count) return [127, 127, 127]
  return [
    Math.round(red / count),
    Math.round(green / count),
    Math.round(blue / count),
  ]
}

const fillSquare = (
  side: number,
  color: [number, number, number],
) => {
  const pixels = new Uint8ClampedArray(side * side * 4)
  for (let index = 0; index < side * side; index += 1) {
    const offset = index * 4
    pixels[offset] = color[0]
    pixels[offset + 1] = color[1]
    pixels[offset + 2] = color[2]
    pixels[offset + 3] = 255
  }
  return pixels
}

export const padImageToSquare = (
  image: ImageData,
  fill: [number, number, number],
) => {
  const side = Math.max(image.width, image.height)
  const layout = letterboxLayout(image.width, image.height, side)
  if (image.width === side && image.height === side) {
    return { image, layout }
  }
  const pixels = fillSquare(side, fill)
  for (let y = 0; y < image.height; y += 1) {
    const sourceStart = y * image.width * 4
    const destinationStart = ((y + layout.y) * side + layout.x) * 4
    pixels.set(
      image.data.subarray(sourceStart, sourceStart + image.width * 4),
      destinationStart,
    )
  }
  return { image: new ImageData(pixels, side, side), layout }
}

export const padMaskToSquare = (
  mask: Uint8Array,
  width: number,
  height: number,
) => {
  const side = Math.max(width, height)
  const layout = letterboxLayout(width, height, side)
  if (width === side && height === side) return mask
  const output = new Uint8Array(side * side)
  for (let y = 0; y < height; y += 1) {
    const sourceStart = y * width
    output.set(
      mask.subarray(sourceStart, sourceStart + width),
      (y + layout.y) * side + layout.x,
    )
  }
  return output
}

export const cropContentFromSquare = (
  square: ImageData,
  layout: LetterboxLayout,
) => {
  const { contentWidth, contentHeight } = layout
  if (
    layout.x === 0 &&
    layout.y === 0 &&
    square.width === contentWidth &&
    square.height === contentHeight
  ) {
    return square
  }
  const pixels = new Uint8ClampedArray(contentWidth * contentHeight * 4)
  for (let y = 0; y < contentHeight; y += 1) {
    const sourceStart = ((y + layout.y) * square.width + layout.x) * 4
    pixels.set(
      square.data.subarray(sourceStart, sourceStart + contentWidth * 4),
      y * contentWidth * 4,
    )
  }
  return new ImageData(pixels, contentWidth, contentHeight)
}
