import type { NeuralInpaintModel } from '../document/types'

export const INPAINT_CACHE_NAME = 'txtimg-inpaint-v1'

export const INPAINT_MODEL_URLS: Record<NeuralInpaintModel, string> = {
  migan: '/models/inpaint/migan/migan_pipeline_v2.onnx',
  lama: '/models/inpaint/lama/lama_fp32.onnx',
}

export const INPAINT_MODEL_MIN_BYTES: Record<NeuralInpaintModel, number> = {
  migan: 20 * 1024 * 1024,
  lama: 150 * 1024 * 1024,
}

export const inpaintModelRequestUrl = (model: NeuralInpaintModel) =>
  new URL(INPAINT_MODEL_URLS[model], self.location.origin).href
