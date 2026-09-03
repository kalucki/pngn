export const FONT_MODEL_CACHE_NAME = 'txtimg-font-id-v1'

export const STORIA_FONT_MODEL_URL = '/models/font/storia/model.onnx'
export const STORIA_FONT_LABELS_URL = '/models/font/storia/labels.json'
export const STORIA_FONT_MODEL_MIN_BYTES = 50 * 1024 * 1024

export const storiaFontModelRequestUrl = () =>
  new URL(STORIA_FONT_MODEL_URL, self.location.origin).href

