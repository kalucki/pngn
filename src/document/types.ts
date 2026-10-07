export type Point = {
  x: number
  y: number
}

export type Bounds = {
  x: number
  y: number
  width: number
  height: number
}

export type ReconstructionMethod =
  | 'auto'
  | 'flat'
  | 'gradient'
  | 'telea'
  | 'navier-stokes'
  | 'patch'
  | 'migan'
  | 'lama'

export type ResolvedReconstructionMethod = Exclude<ReconstructionMethod, 'auto'>

export type NeuralInpaintModel = 'migan' | 'lama'

export type DetectedText = {
  text: string
  confidence: number
  bounds: Bounds
}

export type LayerRemoval = {
  bounds: Bounds
  mask: Uint8Array
}

export type TextLayer = {
  kind?: 'text'
  id: string
  originalText: string
  text: string
  bounds: Bounds
  polygon: Point[]
  rotation: number
  removal: LayerRemoval
  typography: {
    fontFamily: string
    fontSize: number
    fontWeight: number
    italic?: boolean
    color: string
    strokeColor: string
    strokeWidth: number
    letterSpacing: number
    lineHeight: number
    alignment: CanvasTextAlign
  }
  effects: {
    opacity: number
  }
  fontMatch?: {
    family: string
    weight: number
    italic: boolean
    score: number
    status: 'pending' | 'ready' | 'skipped' | 'error'
    requestId?: string
    similar: Array<{ family: string; weight: number; italic?: boolean }>
  }
  processing: {
    recognitionConfidence: number
    maskConfidence: number
    reconstructionConfidence: number
    reconstructionMethod: ResolvedReconstructionMethod
    backgroundType: 'flat' | 'gradient' | 'complex'
    originalInkWidth?: number
  }
}

export type RasterLayer = {
  kind: 'raster'
  id: string
  name: string
  image: ArrayBuffer
  width: number
  height: number
  opacity: number
  visible: boolean
}

export type ImageLayer = {
  kind: 'image'
  id: string
  name: string
  image: ArrayBuffer
  mimeType: string
  bounds: Bounds
  rotation: number
  opacity: number
  visible: boolean
}

export type AdjustmentLayer = {
  kind: 'adjustment'
  id: string
  name: string
  visible: boolean
  adjustments: ImageAdjustments
}

export type Layer = RasterLayer | (TextLayer & { kind: 'text' }) | ImageLayer | AdjustmentLayer

export type ImageAdjustments = {
  brightness: number
  contrast: number
  saturation: number
  blur: number
}

export type EditorDocument = {
  id: string
  width: number
  height: number
  layers: Layer[]
  activeLayerIds: string[]
  adjustments: ImageAdjustments
}

export type ProcessingDiagnostics = {
  model: string
  provider: 'webgpu' | 'wasm'
  inpaintModel: NeuralInpaintModel | null
  inpaintProvider: 'webgpu' | 'wasm' | null
  ocrMs: number
  maskMs: number
  segmentationMs: number
  inpaintMs: number
  reconstructionMs: number
  totalMs: number
  maskedPixels: number
}

export type ProcessedImage = {
  width: number
  height: number
  cleanImage: ArrayBuffer
  maskImage: ArrayBuffer
  textLayers: TextLayer[]
  diagnostics: ProcessingDiagnostics
}

export type ProcessingOptions = {
  method: ReconstructionMethod
  maskThreshold: number
  maskDilation: number
}
