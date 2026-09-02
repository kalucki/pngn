/// <reference lib="webworker" />

import {
  isWebGpuAvailable,
  PaddleOcrService,
  type FlattenedPaddleOcrResult,
} from 'ppu-paddle-ocr/web'
import type { DetectedText } from '../document/types'
import { reconstructTextRegions } from '../processing/reconstruction'
import {
  expandSelection,
  mapRegionalDetections,
} from '../processing/region'
import type {
  ProcessingRequest,
  ProcessingResponse,
} from './messages'

const MODEL_BASE = '/models/ocr/ppocr-v6-tiny-v1'

let provider: 'webgpu' | 'wasm' = 'wasm'
let ready: Promise<PaddleOcrService> | null = null

const getService = () => {
  ready ??= (async () => {
    provider = (await isWebGpuAvailable()) ? 'webgpu' : 'wasm'
    const service = new PaddleOcrService({
      model: {
        detection: `${MODEL_BASE}/detection.ort`,
        recognition: `${MODEL_BASE}/recognition.ort`,
        charactersDictionary: `${MODEL_BASE}/dictionary.txt`,
      },
      detection: {
        maxSideLength: 'auto',
        minimumAreaThreshold: 16,
        paddingHorizontal: 0.15,
        paddingVertical: 0.12,
      },
      recognition: {
        charactersDictionary: [],
        minimumConfidence: 0.35,
        strategy: 'per-box',
        maxCropSourceSideLength: 3000,
        spaceRecovery: true,
      },
      processing: {
        engine: 'canvas-native',
      },
    })
    await service.initialize()
    return service
  })()
  return ready
}

const send = (response: ProcessingResponse, transfer: Transferable[] = []) => {
  self.postMessage(response, { transfer })
}

const progress = (
  requestId: string,
  stage: 'loading-models' | 'ocr' | 'masking' | 'reconstruction',
  value: number,
) => {
  send({ type: 'progress', requestId, stage, progress: value })
}

const imageDataToPng = async (image: ImageData) => {
  const canvas = new OffscreenCanvas(image.width, image.height)
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas 2D is unavailable in this browser.')
  context.putImageData(image, 0, 0)
  return (await canvas.convertToBlob({ type: 'image/png' })).arrayBuffer()
}

const decodeImage = async (bytes: ArrayBuffer, mimeType: string) => {
  const bitmap = await createImageBitmap(new Blob([bytes], { type: mimeType }), {
    imageOrientation: 'from-image',
  })
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) throw new Error('Canvas 2D is unavailable in this browser.')
  context.drawImage(bitmap, 0, 0)
  bitmap.close()
  return {
    canvas,
    imageData: context.getImageData(0, 0, canvas.width, canvas.height),
  }
}

const createOcrCrop = (
  source: OffscreenCanvas,
  crop: { x: number; y: number; width: number; height: number },
  selectionHeight: number,
) => {
  const maximumScale = Math.min(3, 2000 / Math.max(crop.width, crop.height))
  const scale =
    selectionHeight < 70
      ? Math.max(1, maximumScale)
      : selectionHeight < 140
        ? Math.max(1, Math.min(2, maximumScale))
        : 1
  const canvas = new OffscreenCanvas(
    Math.max(1, Math.round(crop.width * scale)),
    Math.max(1, Math.round(crop.height * scale)),
  )
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas 2D is unavailable in this browser.')
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.drawImage(
    source,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    canvas.width,
    canvas.height,
  )
  return { canvas, scale }
}

const processImage = async (request: ProcessingRequest) => {
  const startedAt = performance.now()
  progress(request.requestId, 'loading-models', 0.05)
  const [service, decoded] = await Promise.all([
    getService(),
    decodeImage(request.image, request.mimeType),
  ])
  progress(request.requestId, 'ocr', 0.15)

  const original = decoded.imageData
  const ocrCropBounds = expandSelection(
    request.selection,
    original.width,
    original.height,
  )
  const ocrCrop = createOcrCrop(
    decoded.canvas,
    ocrCropBounds,
    request.selection.height,
  )
  const ocrStartedAt = performance.now()
  const ocrResult = (await service.recognize(ocrCrop.canvas, {
    flatten: true,
    strategy: 'per-box',
    noCache: true,
  })) as FlattenedPaddleOcrResult
  const ocrMs = performance.now() - ocrStartedAt

  const regionalDetections: DetectedText[] = ocrResult.results
    .filter((result) => result.text.trim().length > 0)
    .map((result) => ({
      text: result.text.trim(),
      confidence: result.confidence,
      bounds: {
        x: result.box.x / ocrCrop.scale,
        y: result.box.y / ocrCrop.scale,
        width: result.box.width / ocrCrop.scale,
        height: result.box.height / ocrCrop.scale,
      },
    }))
  const detections = mapRegionalDetections(
    regionalDetections,
    ocrCropBounds,
    request.selection,
  )
  if (!detections.length) {
    throw new Error(
      'No text was found in this selection. Draw a slightly wider area around the text.',
    )
  }

  progress(request.requestId, 'masking', 0.55)
  const maskStartedAt = performance.now()
  const reconstruction = await reconstructTextRegions(
    original,
    detections,
    request.options,
  )
  const maskMs = performance.now() - maskStartedAt

  progress(request.requestId, 'reconstruction', 0.82)
  const reconstructionStartedAt = performance.now()
  const [cleanImage, maskImage] = await Promise.all([
    imageDataToPng(reconstruction.clean),
    imageDataToPng(reconstruction.mask),
  ])
  const reconstructionMs = performance.now() - reconstructionStartedAt

  const result = {
    width: original.width,
    height: original.height,
    cleanImage,
    maskImage,
    textLayers: reconstruction.layers,
    diagnostics: {
      model: 'PP-OCRv6 tiny (ORT)',
      provider,
      inpaintModel: reconstruction.inpaintModel,
      inpaintProvider: reconstruction.inpaintProvider,
      ocrMs,
      maskMs,
      segmentationMs: reconstruction.segmentationMs,
      inpaintMs: reconstruction.inpaintMs,
      reconstructionMs,
      totalMs: performance.now() - startedAt,
      maskedPixels: reconstruction.maskedPixels,
    },
  }

  send(
    { type: 'success', requestId: request.requestId, result },
    [cleanImage, maskImage],
  )
}

self.onmessage = (event: MessageEvent<ProcessingRequest>) => {
  void processImage(event.data).catch((error: unknown) => {
    send({
      type: 'error',
      requestId: event.data.requestId,
      message: error instanceof Error ? error.message : 'Image processing failed.',
    })
  })
}
