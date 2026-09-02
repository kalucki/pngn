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

export type TextLayer = {
  id: string
  originalText: string
  text: string
  bounds: Bounds
  polygon: Point[]
  rotation: number
  typography: {
    fontFamily: string
    fontSize: number
    fontWeight: number
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
  processing: {
    recognitionConfidence: number
    maskConfidence: number
    reconstructionConfidence: number
    reconstructionMethod: ResolvedReconstructionMethod
    backgroundType: 'flat' | 'gradient' | 'complex'
  }
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
