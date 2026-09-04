export const DEFAULT_OCR_FONT_SIZE_RATIO = 0.72

export const defaultOcrFontSize = (boxHeight: number) =>
  Math.max(8, boxHeight * DEFAULT_OCR_FONT_SIZE_RATIO)
