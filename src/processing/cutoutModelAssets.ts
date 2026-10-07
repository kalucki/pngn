export type CutoutModel = 'birefnet' | 'u2net'

export const CUTOUT_CACHE_NAME = 'txtimg-cutout-v1'

export const CUTOUT_MODEL_URLS: Record<CutoutModel, string> = {
  // BiRefNet is MIT licensed. This URL is intentionally isolated so the model
  // can be swapped without changing the editor code.
  birefnet:
    'https://huggingface.co/onnx-community/BiRefNet-ONNX/resolve/main/model.onnx',
  u2net: 'https://huggingface.co/xenova/u2net/resolve/main/onnx/model.onnx',
}

export const CUTOUT_MODEL_MIN_BYTES: Record<CutoutModel, number> = {
  birefnet: 80 * 1024 * 1024,
  u2net: 4 * 1024 * 1024,
}
