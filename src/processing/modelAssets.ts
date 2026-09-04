import type { NeuralInpaintModel } from '../document/types'

export const INPAINT_CACHE_NAME = 'txtimg-inpaint-v2'

export const INPAINT_MODEL_URLS: Record<NeuralInpaintModel, string> = {
  migan:
    'https://huggingface.co/andraniksargsyan/migan/resolve/main/migan_pipeline_v2.onnx',
  lama: 'https://huggingface.co/Carve/LaMa-ONNX/resolve/main/lama_fp32.onnx',
}

export const INPAINT_MODEL_MIN_BYTES: Record<NeuralInpaintModel, number> = {
  migan: 20 * 1024 * 1024,
  lama: 150 * 1024 * 1024,
}

export const inpaintModelRequestUrl = (model: NeuralInpaintModel) =>
  INPAINT_MODEL_URLS[model]
