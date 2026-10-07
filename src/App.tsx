import { Select, Slider, Tooltip } from "@mantine/core";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import {
  trackExportFinished,
  trackFontMatchFailed,
  trackFontMatchFinished,
  trackImageOpened,
  trackImageRejected,
  trackLayerRemoved,
  trackMethodChanged,
  trackProcessFinished,
  type ProcessScope,
  type ProcessStage,
} from "./analytics";
import type {
  Bounds,
  NeuralInpaintModel,
  ProcessedImage,
  ProcessingOptions,
  TextLayer,
} from "./document/types";
import { editorDocumentKey } from "./editor/editorSession";
import { EditorCanvas } from "./editor/EditorCanvas";
import { LayersPanel } from "./editor/LayersPanel";
import { ExportModal } from "./editor/ExportModal";
import {
  downloadFromUrl,
  exportFileName,
  renderExportImage,
  type ExportFormat,
} from "./editor/exportImage";
import { stashExport } from "./editor/exportTransfer";
import { prefetchFontIdModel } from "./fonts/fontModelCache";
import { warmupFontIdWorker } from "./fonts/fontIdClient";
import {
  markPendingFontMatches,
  matchTextLayerFonts,
  mergeMatchedFontLayer,
} from "./fonts/matchTextLayerFont";
import { fitLayersTextBounds, withTextSizeBounds } from "./editor/textLayerBounds";
import { applyLayerStylePatch, type LayerStylePatch } from "./editor/applyLayerStyle";
import { nextSelectedLayerIds } from "./editor/layerSelection";
import {
  adoptRegionLayers,
  findRegionByLayerId,
  layersFromRegions,
  optionsEqual,
  staleLayerIds,
  type ProcessedRegion,
} from "./editor/processedRegions";
import {
  imageDataFromFile,
  imageDataToPngBuffer,
  patchProcessedImage,
} from "./editor/revertLayerRemoval";
import { RegionSelector } from "./editor/RegionSelector";
import { TextToolbar } from "./editor/TextToolbar";
import { FlowSteps } from "./layout/FlowSteps";
import { HintTooltip } from "./layout/HintTooltip";
import { LandingSeo } from "./layout/LandingSeo";
import { LandingStage } from "./layout/LandingStage";
import { LoadingToast } from "./layout/LoadingToast";
import {
  AlertCircleIcon,
  BrushIcon,
  CropIcon,
  DownloadIcon,
  EyeIcon,
  HelpCircleIcon,
  ImagePlusIcon,
  DashedBoxIcon,
  PencilIcon,
  RestartIcon,
  TypeIcon,
  WandIcon,
} from "./layout/icons";
import { EDITOR_PATH, EXPORT_PATH, navigate, usePath } from "./navigation";
import {
  processImage,
  warmupOcrModel,
  warmupProcessingWorker,
} from "./processing/client";
import { warmupInpaintWorker } from "./processing/inpaintClient";
import { prefetchInpaintModel } from "./processing/modelCache";
import {
  cropRaster,
  eraseRaster,
  flipRaster,
  resizeRaster,
} from "./editor/rasterTools";
import { removeBackground, replaceBackground } from "./processing/cutoutClient";
import {
  warmupOpenCvModule,
  warmupOpenCvWorker,
} from "./processing/openCvClient";
import { useLocale } from "./i18n/useLocale";
import type { MessageKey } from "./i18n/messages";
import { createHistoryState, historyReducer } from "./document/history";
import { readLastAutosave, saveAutosave } from "./document/autosave";

type ImageUrls = {
  clean: string;
  mask: string;
};

type ImageSource = {
  url: string;
  width: number;
  height: number;
};

type RunConfig = {
  selectionOverride?: Bounds;
  optionsOverride?: ProcessingOptions;
  replaceRegionId?: string;
};

type LayerSelectSource = "sidebar" | "canvas";

type ReconstructionChoice = "auto" | "flat" | NeuralInpaintModel;
type EditorTool = "select" | "text" | "erase" | "background";

const initialOptions: ProcessingOptions = {
  method: "auto",
  maskThreshold: 34,
  maskDilation: 8,
};

const reconstructionMethods: {
  value: ReconstructionChoice;
  label: MessageKey;
  hint: MessageKey;
  hintAria: MessageKey;
}[] = [
  {
    value: "auto",
    label: "app.methodAuto",
    hint: "app.methodAutoHint",
    hintAria: "app.methodAutoHintAria",
  },
  {
    value: "flat",
    label: "app.methodFlat",
    hint: "app.methodFlatHint",
    hintAria: "app.methodFlatHintAria",
  },
  {
    value: "migan",
    label: "app.methodMigan",
    hint: "app.methodMiganHint",
    hintAria: "app.methodMiganHintAria",
  },
  {
    value: "lama",
    label: "app.methodLama",
    hint: "app.methodLamaHint",
    hintAria: "app.methodLamaHintAria",
  },
];

const neuralModelFor = (
  method: ProcessingOptions["method"],
): NeuralInpaintModel | null => {
  if (method === "migan") return "migan";
  if (method === "lama" || method === "auto") return "lama";
  return null;
};

const prefetchForMethod = (method: ProcessingOptions["method"]) => {
  const model = neuralModelFor(method);
  if (model) prefetchInpaintModel(model);
};

const canvasToPng = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Canvas encoding failed.")),
      "image/png",
    );
  });

const blobToDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(blob);
  });

const dataUrlToFile = async (dataUrl: string, name: string) => {
  const blob = await fetch(dataUrl).then((response) => response.blob());
  return new File([blob], name, { type: blob.type || "image/png" });
};

const blobFromCanvas = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Canvas encoding failed.")),
      "image/png",
    );
  });

const initialProcessedImage = async (
  bitmap: ImageBitmap,
): Promise<{ processed: ProcessedImage; urls: ImageUrls }> => {
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D is unavailable in this browser.");
  context.drawImage(bitmap, 0, 0);
  const cleanBlob = await blobFromCanvas(canvas);
  const blankMask = new ImageData(bitmap.width, bitmap.height);
  const maskImage = await imageDataToPngBuffer(blankMask);
  const maskBlob = new Blob([maskImage], { type: "image/png" });
  const cleanImage = await cleanBlob.arrayBuffer();
  return {
    processed: {
      width: bitmap.width,
      height: bitmap.height,
      cleanImage,
      maskImage,
      textLayers: [],
      diagnostics: {
        model: "none",
        provider: "wasm",
        inpaintModel: null,
        inpaintProvider: null,
        ocrMs: 0,
        maskMs: 0,
        segmentationMs: 0,
        inpaintMs: 0,
        reconstructionMs: 0,
        totalMs: 0,
        maskedPixels: 0,
      },
    },
    urls: {
      clean: URL.createObjectURL(cleanBlob),
      mask: URL.createObjectURL(maskBlob),
    },
  };
};

const mergeProcessedImages = async (
  current: ImageUrls | null,
  processed: ProcessedImage,
) => {
  const nextCleanBlob = new Blob([processed.cleanImage], { type: "image/png" });
  const nextMaskBlob = new Blob([processed.maskImage], { type: "image/png" });
  if (!current) {
    return {
      clean: URL.createObjectURL(nextCleanBlob),
      mask: URL.createObjectURL(nextMaskBlob),
    };
  }

  const [currentClean, currentMask, nextClean, nextMask] = await Promise.all([
    createImageBitmap(await (await fetch(current.clean)).blob()),
    createImageBitmap(await (await fetch(current.mask)).blob()),
    createImageBitmap(nextCleanBlob),
    createImageBitmap(nextMaskBlob),
  ]);
  const cleanCanvas = document.createElement("canvas");
  cleanCanvas.width = processed.width;
  cleanCanvas.height = processed.height;
  const cleanContext = cleanCanvas.getContext("2d");
  const overlayCanvas = document.createElement("canvas");
  overlayCanvas.width = processed.width;
  overlayCanvas.height = processed.height;
  const overlayContext = overlayCanvas.getContext("2d");
  const maskCanvas = document.createElement("canvas");
  maskCanvas.width = processed.width;
  maskCanvas.height = processed.height;
  const maskContext = maskCanvas.getContext("2d");
  if (!cleanContext || !overlayContext || !maskContext) {
    throw new Error("Canvas 2D is unavailable in this browser.");
  }

  cleanContext.drawImage(currentClean, 0, 0);
  overlayContext.drawImage(nextClean, 0, 0);
  overlayContext.globalCompositeOperation = "destination-in";
  overlayContext.drawImage(nextMask, 0, 0);
  cleanContext.drawImage(overlayCanvas, 0, 0);
  maskContext.drawImage(currentMask, 0, 0);
  maskContext.drawImage(nextMask, 0, 0);

  currentClean.close();
  currentMask.close();
  nextClean.close();
  nextMask.close();
  const [cleanBlob, maskBlob] = await Promise.all([
    canvasToPng(cleanCanvas),
    canvasToPng(maskCanvas),
  ]);
  return {
    clean: URL.createObjectURL(cleanBlob),
    mask: URL.createObjectURL(maskBlob),
  };
};

const composeProcessedRegions = async (regions: ProcessedRegion[]) => {
  let urls: ImageUrls | null = null;
  const intermediates: ImageUrls[] = [];
  for (const region of regions) {
    const next = await mergeProcessedImages(urls, region.processed);
    if (urls) intermediates.push(urls);
    urls = next;
  }
  for (const old of intermediates) {
    URL.revokeObjectURL(old.clean);
    URL.revokeObjectURL(old.mask);
  }
  return urls;
};

export const App = () => {
  const path = usePath();
  const inEditor = path === EDITOR_PATH;
  const { t, translateError } = useLocale();
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ProcessedImage | null>(null);
  const [layerHistory, dispatchLayerHistory] = useReducer(
    historyReducer<TextLayer[]>,
    createHistoryState<TextLayer[]>([]),
  );
  const layers = layerHistory.present;
  const [urls, setUrls] = useState<ImageUrls | null>(null);
  const [source, setSource] = useState<ImageSource | null>(null);
  const [selection, setSelection] = useState<Bounds | null>(null);
  const [options, setOptions] = useState<ProcessingOptions>(initialOptions);
  const [selectedLayerIds, setSelectedLayerIds] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("image/png");
  const [exportWidth, setExportWidth] = useState<number | undefined>();
  const [exportHeight, setExportHeight] = useState<number | undefined>();
  const [exportTargetKb, setExportTargetKb] = useState(0);
  const [isAddingRegion, setIsAddingRegion] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [isExportPreview, setIsExportPreview] = useState(false);
  const [regions, setRegions] = useState<ProcessedRegion[]>([]);
  const [activeTool, setActiveTool] = useState<EditorTool>("text");
  const [eraserSize, setEraserSize] = useState(36);
  const [resizeWidth, setResizeWidth] = useState(0);
  const [resizeHeight, setResizeHeight] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [toolHintHidden, setToolHintHidden] = useState(false);
  const processingGenerationRef = useRef(0);
  const regionsRef = useRef<ProcessedRegion[]>([]);
  const optionsRef = useRef(options);
  const layersRef = useRef(layers);
  const selectedLayerIdsRef = useRef(selectedLayerIds);
  const urlsRef = useRef(urls);
  const isAddingRegionRef = useRef(isAddingRegion);
  const isProcessingRef = useRef(isProcessing);
  const removeLayerChainRef = useRef(Promise.resolve());
  const requestApplyToLayerRef = useRef<(layerId: string) => void>(() => {});
  // Identifies the current file to the processing worker so it can reuse its
  // decoded source image across every region instead of re-decoding it each
  // time "Select another area" is used.
  const imageIdRef = useRef("");

  const setLayers = useCallback(
    (value: TextLayer[] | ((current: TextLayer[]) => TextLayer[])) => {
      const next =
        typeof value === "function" ? value(layersRef.current) : value;
      dispatchLayerHistory({ type: "commit", value: next });
    },
    [],
  );

  const replaceLayers = useCallback((next: TextLayer[]) => {
    dispatchLayerHistory({ type: "replace", value: next });
  }, []);

  const clearLayerHistory = useCallback((next: TextLayer[] = []) => {
    dispatchLayerHistory({ type: "clear", value: next });
  }, []);

  const selectedLayerId = selectedLayerIds[0] ?? null;
  const selectedLayer = useMemo(
    () => layers.find((layer) => layer.id === selectedLayerId) ?? null,
    [layers, selectedLayerId],
  );
  const dirtyLayerIds = useMemo(
    () =>
      isAddingRegion ? new Set<string>() : staleLayerIds(regions, options),
    [isAddingRegion, regions, options],
  );
  const settingsDirty = Boolean(
    selectedLayerId && dirtyLayerIds.has(selectedLayerId),
  );
  const settingsHint = settingsDirty
    ? t("app.applySettingsHint")
    : layers.length > 0 && !selectedLayer && !isAddingRegion && !isExportPreview
      ? t("app.selectLayerToApply")
      : "";
  const hasValidSelection = Boolean(
    selection && selection.width >= 4 && selection.height >= 4,
  );
  const canvasHint: { message: MessageKey; icon: typeof DashedBoxIcon } | null =
    (() => {
      if (isProcessing || isExportPreview) return null;
      const selectingText =
        !result || !urls || (activeTool === "text" && isAddingRegion);
      if (selectingText) {
        return hasValidSelection
          ? null
          : { message: "app.dragHint", icon: DashedBoxIcon };
      }
      if (activeTool === "select") {
        return hasValidSelection
          ? null
          : { message: "app.cropHint", icon: CropIcon };
      }
      if (toolHintHidden) return null;
      if (activeTool === "erase") {
        return { message: "app.eraseHint", icon: BrushIcon };
      }
      if (activeTool === "background") {
        return { message: "app.backgroundHint", icon: WandIcon };
      }
      return null;
    })();
  const CanvasHintIcon = canvasHint?.icon;
  const documentKey =
    file && source ? editorDocumentKey(file, source.width, source.height) : "";
  const isBusy = isProcessing || isExporting;

  useEffect(
    () => () => {
      if (!urls) return;
      URL.revokeObjectURL(urls.clean);
      URL.revokeObjectURL(urls.mask);
    },
    [urls],
  );

  useEffect(
    () => () => {
      if (source) URL.revokeObjectURL(source.url);
    },
    [source],
  );

  const runProcessing = async (config: RunConfig = {}) => {
    const activeSelection = config.selectionOverride ?? selection;
    const activeOptions = config.optionsOverride ?? optionsRef.current;
    if (!file || !activeSelection) return;
    const generation = ++processingGenerationRef.current;
    const startedAt = performance.now();
    let stage: ProcessStage = "start";
    const scope: ProcessScope = config.replaceRegionId
      ? "reapply"
      : isAddingRegionRef.current || regionsRef.current.length > 0
        ? "region"
        : "full";
    isProcessingRef.current = true;
    setIsProcessing(true);
    setError(null);
    setProgress(0.02);

    try {
      const processed = await processImage(
        await file.arrayBuffer(),
        file.type,
        imageIdRef.current,
        activeSelection,
        activeOptions,
        (nextStage, nextProgress) => {
          stage = nextStage;
          if (generation !== processingGenerationRef.current) return;
          setProgress(nextProgress);
        },
      );
      if (generation !== processingGenerationRef.current) return;

      const currentRegions = regionsRef.current;
      const currentLayers = layersRef.current;
      const existing = config.replaceRegionId
        ? currentRegions.find((region) => region.id === config.replaceRegionId)
        : undefined;
      if (config.replaceRegionId && !existing) return;
      const regionId = existing?.id ?? crypto.randomUUID();
      const previousLayers = existing
        ? currentLayers.filter((layer) => existing.layerIds.includes(layer.id))
        : [];
      const adoptedRegionLayers = adoptRegionLayers(
        previousLayers,
        processed.textLayers,
        regionId,
      );
      const nextRegionLayers = markPendingFontMatches(adoptedRegionLayers).map(
        withTextSizeBounds,
      );
      const nextRegion: ProcessedRegion = {
        id: regionId,
        selection: activeSelection,
        options: activeOptions,
        layerIds: nextRegionLayers.map((layer) => layer.id),
        processed: { ...processed, textLayers: nextRegionLayers },
      };
      const nextRegions = existing
        ? currentRegions.map((region) =>
            region.id === regionId ? nextRegion : region,
          )
        : [...currentRegions, nextRegion];
      const nextLayers = layersFromRegions(nextRegions, currentLayers, {
        regionId,
        layers: nextRegionLayers,
      });
      stage = "compose";
      const nextUrls = config.replaceRegionId
        ? await composeProcessedRegions(nextRegions)
        : await mergeProcessedImages(urlsRef.current, processed);

      if (generation !== processingGenerationRef.current) {
        if (nextUrls) {
          URL.revokeObjectURL(nextUrls.clean);
          URL.revokeObjectURL(nextUrls.mask);
        }
        return;
      }

      const keepIds = selectedLayerIdsRef.current.filter((id) =>
        nextLayers.some((layer) => layer.id === id),
      );
      setRegions(nextRegions);
      setUrls(nextUrls);
      setResult({
        ...processed,
        textLayers: nextLayers,
        diagnostics: {
          ...processed.diagnostics,
          maskedPixels: nextRegions.reduce(
            (sum, region) => sum + region.processed.diagnostics.maskedPixels,
            0,
          ),
        },
      });
      replaceLayers(nextLayers);
      setSelectedLayerIds(
        config.replaceRegionId
          ? keepIds.length > 0
            ? keepIds
            : nextRegionLayers[0]
              ? [nextRegionLayers[0].id]
              : []
          : nextRegionLayers[0]
            ? [nextRegionLayers[0].id]
            : [],
      );
      setIsExportPreview(false);
      if (!config.replaceRegionId) {
        setSelection(null);
        setIsAddingRegion(false);
      }
      setProgress(1);
      trackProcessFinished({
        method: activeOptions.method,
        outcome: "ok",
        durationMs: performance.now() - startedAt,
        scope,
        layers: nextRegionLayers.length,
        ocrProvider: processed.diagnostics.provider,
        inpaintProvider: processed.diagnostics.inpaintProvider,
      });
      if (file) {
        const applyMatchedLayer = (matched: TextLayer) => {
          console.info("[pngn font] applying match", {
            text: matched.originalText.slice(0, 32),
            applied: matched.typography.fontFamily,
            fontSize: matched.typography.fontSize,
            suggested: matched.fontMatch?.family,
            status: matched.fontMatch?.status,
          });
          setLayers((current) =>
            current.map((layer) => mergeMatchedFontLayer(layer, matched)),
          );
          setRegions((current) =>
            current.map((region) =>
              region.layerIds.includes(matched.id)
                ? {
                    ...region,
                    processed: {
                      ...region.processed,
                      textLayers: region.processed.textLayers.map((layer) =>
                        mergeMatchedFontLayer(layer, matched),
                      ),
                    },
                  }
                : region,
            ),
          );
          setResult((current) =>
            current
              ? {
                  ...current,
                  textLayers: current.textLayers.map((layer) =>
                    mergeMatchedFontLayer(layer, matched),
                  ),
                }
              : current,
          );
        };
        void matchTextLayerFonts(file, nextRegionLayers, applyMatchedLayer).then(
          (matched) => {
            trackFontMatchFinished(matched);
          },
          (error: unknown) => {
            console.warn("[pngn font] matching failed:", error);
            trackFontMatchFailed(error);
          },
        );
      }
    } catch (processingError) {
      if (generation !== processingGenerationRef.current) return;
      setError(
        processingError instanceof Error
          ? processingError.message
          : "Processing failed.",
      );
      trackProcessFinished({
        method: activeOptions.method,
        outcome: "error",
        durationMs: performance.now() - startedAt,
        scope,
        stage,
        error: processingError,
      });
    } finally {
      if (generation === processingGenerationRef.current) {
        isProcessingRef.current = false;
        setIsProcessing(false);
      }
    }
  };

  const requestApplyToLayer = (layerId: string) => {
    if (isAddingRegionRef.current || isProcessingRef.current) return;
    const region = findRegionByLayerId(regionsRef.current, layerId);
    if (!region || optionsEqual(region.options, optionsRef.current)) return;
    void runProcessing({
      selectionOverride: region.selection,
      optionsOverride: optionsRef.current,
      replaceRegionId: region.id,
    });
  };

  useEffect(() => {
    regionsRef.current = regions;
    optionsRef.current = options;
    layersRef.current = layers;
    selectedLayerIdsRef.current = selectedLayerIds;
    urlsRef.current = urls;
    isAddingRegionRef.current = isAddingRegion;
    isProcessingRef.current = isProcessing;
    requestApplyToLayerRef.current = requestApplyToLayer;
  });

  useEffect(() => {
    warmupProcessingWorker();
    warmupInpaintWorker();
    warmupOpenCvWorker();
    warmupFontIdWorker();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.closest('input, textarea, select, [role="combobox"]'))
      ) {
        return;
      }
      const key = event.key.toLowerCase();
      if (!(event.metaKey || event.ctrlKey) || key !== "z") return;
      event.preventDefault();
      dispatchLayerHistory({ type: event.shiftKey ? "redo" : "undo" });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const selectingInitial = Boolean(source && (!result || !urls));
    if (!selectingInitial && !isAddingRegion) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || isProcessing) return;
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.closest('input, textarea, select, [role="combobox"]'))
      ) {
        return;
      }
      if (!isAddingRegion && !selection) return;
      event.preventDefault();
      setSelection(null);
      if (isAddingRegion) {
        setIsAddingRegion(false);
        setSelectedLayerIds([]);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isAddingRegion, isProcessing, result, selection, source, urls]);

  useEffect(() => {
    if (!file || isAddingRegion || isProcessing || isExportPreview) return;
    const layerId = selectedLayerIdsRef.current[0];
    if (!layerId) return;
    const region = findRegionByLayerId(regionsRef.current, layerId);
    if (!region || optionsEqual(region.options, options)) return;
    const timeout = window.setTimeout(() => {
      const activeLayerId = selectedLayerIdsRef.current[0];
      if (activeLayerId) requestApplyToLayerRef.current(activeLayerId);
    }, 450);
    return () => window.clearTimeout(timeout);
  }, [options, isAddingRegion, isProcessing, isExportPreview, file]);

  const requestMethod = (method: ReconstructionChoice) => {
    if (optionsRef.current.method !== method) trackMethodChanged(method);
    setOptions((current) => ({
      ...current,
      method,
    }));
    prefetchForMethod(method);
  };

  const requestProcessing = () => {
    void runProcessing();
  };

  const resetToUploadedImage = useCallback(() => {
    processingGenerationRef.current += 1;
    isProcessingRef.current = false;
    setIsProcessing(false);
    setProgress(0);
    setError(null);
    setSelection(null);
    setResult(null);
    setUrls(null);
    clearLayerHistory([]);
    setSelectedLayerIds([]);
    setIsAddingRegion(false);
    setIsExportPreview(false);
    setRegions([]);
  }, [clearLayerHistory]);

  const handleFile = useCallback(async (
    nextFile: File | undefined,
    source: "drop" | "picker",
  ) => {
    if (!nextFile) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(nextFile.type)) {
      trackImageRejected("type");
      setError("Choose a PNG, JPEG, or WebP image.");
      return;
    }
    try {
      const bitmap = await createImageBitmap(nextFile, {
        imageOrientation: "from-image",
      });
      const nextSource = {
        url: URL.createObjectURL(nextFile),
        width: bitmap.width,
        height: bitmap.height,
      };
      const initial = await initialProcessedImage(bitmap);
      bitmap.close();
      trackImageOpened(nextFile.type, nextSource.width, nextSource.height, source);
      resetToUploadedImage();
      imageIdRef.current = crypto.randomUUID();
      setFile(nextFile);
      setSource(nextSource);
      setResult(initial.processed);
      setUrls(initial.urls);
      setExportWidth(nextSource.width);
      setExportHeight(nextSource.height);
      setResizeWidth(nextSource.width);
      setResizeHeight(nextSource.height);
      setActiveTool("text");
      setIsAddingRegion(true);
      navigate(EDITOR_PATH);
      prefetchForMethod(options.method);
      prefetchFontIdModel();
      warmupOcrModel();
      warmupOpenCvModule();
    } catch {
      trackImageRejected("decode");
      setError("This image could not be decoded by the browser.");
    }
  }, [options.method, resetToUploadedImage]);
  const handleFileRef = useRef(handleFile);
  useEffect(() => {
    handleFileRef.current = handleFile;
  }, [handleFile]);

  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      if (isBusy) return;
      const item = Array.from(event.clipboardData?.items ?? []).find((entry) =>
        entry.type.startsWith("image/"),
      );
      const blob = item?.getAsFile();
      if (!blob) return;
      event.preventDefault();
      const pasted = new File([blob], `pasted-image-${Date.now()}.png`, {
        type: blob.type || "image/png",
        lastModified: Date.now(),
      });
      void handleFileRef.current(pasted, "picker");
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [isBusy]);

  useEffect(() => {
    if (!inEditor || file || source) return;
    let cancelled = false;
    void readLastAutosave().then((saved) => {
      if (cancelled) return;
      if (!saved) {
        navigate("/", { replace: true });
        return;
      }
      const restoredFile = new File([saved.file.blob], saved.file.name, {
        type: saved.file.type,
        lastModified: saved.file.lastModified,
      });
      const sourceUrl = URL.createObjectURL(saved.file.blob);
      setFile(restoredFile);
      setSource({
        url: sourceUrl,
        width: saved.source.width,
        height: saved.source.height,
      });
      setResizeWidth(saved.result?.width ?? saved.source.width);
      setResizeHeight(saved.result?.height ?? saved.source.height);
      setExportWidth(saved.result?.width ?? saved.source.width);
      setExportHeight(saved.result?.height ?? saved.source.height);
      if (saved.urls) {
        setUrls({
          clean: URL.createObjectURL(saved.urls.clean),
          mask: URL.createObjectURL(saved.urls.mask),
        });
      }
      setResult(saved.result);
      replaceLayers(saved.layers);
      setRegions(saved.regions);
    });
    return () => {
      cancelled = true;
    };
  }, [file, inEditor, replaceLayers, source]);

  useEffect(() => {
    if (!file || !source || !documentKey) return;
    const timeout = window.setTimeout(() => {
      void (async () => {
        const savedUrls = urls
          ? {
              clean: await fetch(urls.clean).then((response) => response.blob()),
              mask: await fetch(urls.mask).then((response) => response.blob()),
            }
          : undefined;
        await saveAutosave({
          key: documentKey,
          savedAt: Date.now(),
          file: {
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified,
            blob: file,
          },
          source: {
            width: source.width,
            height: source.height,
          },
          urls: savedUrls,
          result,
          layers,
          regions,
        });
      })().catch(() => undefined);
    }, 800);
    return () => window.clearTimeout(timeout);
  }, [documentKey, file, layers, regions, result, source, urls]);

  const updateLayer = (nextLayer: TextLayer) => {
    setLayers((current) =>
      current.map((layer) =>
        layer.id === nextLayer.id ? withTextSizeBounds(nextLayer) : layer,
      ),
    );
  };

  const editLayerText = (id: string, text: string) => {
    setLayers((current) =>
      current.map((layer) =>
        layer.id === id ? withTextSizeBounds({ ...layer, text }) : layer,
      ),
    );
  };

  const fitTextLayerBounds = useCallback(() => {
    setLayers((current) => fitLayersTextBounds(current));
  }, [setLayers]);

  const updateSelectedLayerStyle = (patch: LayerStylePatch) => {
    const ids = selectedLayerIdsRef.current;
    if (ids.length === 0) return;
    const selected = new Set(ids);
    setLayers((current) =>
      current.map((layer) =>
        selected.has(layer.id) ? applyLayerStylePatch(layer, patch) : layer,
      ),
    );
  };

  const setLayerFontSize = (
    id: string,
    fontSize: number,
    bounds: Bounds,
  ) => {
    setLayers((current) =>
      current.map((layer) =>
        layer.id === id
          ? { ...layer, bounds, typography: { ...layer.typography, fontSize } }
          : layer,
      ),
    );
  };

  const handleSelectLayer = (
    id: string | null,
    options: { source?: LayerSelectSource; additive?: boolean } = {},
  ) => {
    if (isProcessingRef.current) return;
    const source = options.source ?? "canvas";
    const additive = Boolean(options.additive);
    setIsExportPreview(false);
    setSelectedLayerIds((current) =>
      nextSelectedLayerIds(current, id, additive),
    );
    if (id) {
      setIsAddingRegion(false);
      setSelection(null);
    }
    if (source === "sidebar" && id && !additive) {
      requestApplyToLayer(id);
    }
  };

  const moveLayer = (id: string, x: number, y: number) => {
    setLayers((current) =>
      current.map((layer) =>
        layer.id === id
          ? { ...layer, bounds: { ...layer.bounds, x, y } }
          : layer,
      ),
    );
  };

  const rotateLayer = (id: string, rotation: number) => {
    setLayers((current) =>
      current.map((layer) =>
        layer.id === id ? { ...layer, rotation } : layer,
      ),
    );
  };

  const revertRemovedLayer = async (id: string) => {
    const generation = processingGenerationRef.current;
    const sourceFile = file;
    const currentLayers = layersRef.current;
    const index = currentLayers.findIndex((layer) => layer.id === id);
    if (index < 0) return;
    const removedLayer = currentLayers[index];
    const nextLayers = currentLayers.filter((layer) => layer.id !== id);
    const region = findRegionByLayerId(regionsRef.current, id);
    const remainingRegionLayers = region
      ? nextLayers.filter((layer) => region.layerIds.includes(layer.id))
      : [];
    let nextRegions = regionsRef.current.map((entry) => ({
      ...entry,
      layerIds: entry.layerIds.filter((layerId) => layerId !== id),
    }));

    if (region && remainingRegionLayers.length === 0) {
      nextRegions = nextRegions.filter((entry) => entry.id !== region.id);
    }

    const previousSelected = selectedLayerIdsRef.current;
    setLayers(nextLayers);
    if (previousSelected.includes(id)) {
      const remaining = previousSelected.filter((layerId) => layerId !== id);
      const neighbor = (nextLayers[index] ?? nextLayers[index - 1])?.id;
      const nextSelected =
        remaining.length > 0 ? remaining : neighbor ? [neighbor] : [];
      selectedLayerIdsRef.current = nextSelected;
      setSelectedLayerIds(nextSelected);
    }

    try {
      if (region && remainingRegionLayers.length > 0 && sourceFile) {
        const original = await imageDataFromFile(sourceFile);
        if (generation !== processingGenerationRef.current) return;
        const patched = await patchProcessedImage(
          original,
          region.processed,
          removedLayer.removal,
          remainingRegionLayers.map((layer) => layer.removal),
        );
        if (generation !== processingGenerationRef.current) return;
        nextRegions = nextRegions.map((entry) =>
          entry.id === region.id
            ? {
                ...entry,
                layerIds: remainingRegionLayers.map((layer) => layer.id),
                processed: { ...patched, textLayers: remainingRegionLayers },
              }
            : entry,
        );
      }

      const nextUrls = await composeProcessedRegions(nextRegions);
      if (generation !== processingGenerationRef.current) {
        if (nextUrls) {
          URL.revokeObjectURL(nextUrls.clean);
          URL.revokeObjectURL(nextUrls.mask);
        }
        return;
      }

      layersRef.current = nextLayers;
      regionsRef.current = nextRegions;
      urlsRef.current = nextUrls;
      setRegions(nextRegions);
      setUrls(nextUrls);
      trackLayerRemoved("ok");
      if (nextRegions.length === 0) {
        setResult(null);
      } else {
        setResult((current) =>
          current
            ? {
                ...current,
                textLayers: nextLayers,
                diagnostics: {
                  ...current.diagnostics,
                  maskedPixels: nextRegions.reduce(
                    (sum, entry) =>
                      sum + entry.processed.diagnostics.maskedPixels,
                    0,
                  ),
                },
              }
            : current,
        );
      }
    } catch (error) {
      if (generation === processingGenerationRef.current) {
        setLayers(currentLayers);
        selectedLayerIdsRef.current = previousSelected;
        setSelectedLayerIds(previousSelected);
      }
      throw error;
    }
  };

  const removeLayer = (id: string) => {
    removeLayerChainRef.current = removeLayerChainRef.current.then(
      () => revertRemovedLayer(id),
      () => revertRemovedLayer(id),
    );
    void removeLayerChainRef.current.catch((error: unknown) => {
      trackLayerRemoved("error", error);
      setError(
        error instanceof Error
          ? error.message
          : "The text layer could not be removed.",
      );
    });
  };

  const handleToggleExportPreview = () => {
    if (isBusy) return;
    if (!isExportPreview) {
      setIsAddingRegion(false);
      setSelection(null);
    }
    setIsExportPreview((current) => !current);
  };

  const handleExport = () => {
    if (!urls || !result) return;
    const filename = exportFileName(file?.name, exportFormat);
    const startedAt = performance.now();
    setIsExporting(true);
    setError(null);
    void (async () => {
      try {
        const blob = await renderExportImage(
          urls.clean,
          result.width,
          result.height,
          layers,
          exportFormat,
          {
            width: exportWidth,
            height: exportHeight,
            targetBytes: exportTargetKb > 0 ? exportTargetKb * 1024 : undefined,
          },
        );
        const pending = stashExport(blob, filename);
        downloadFromUrl(pending.url, pending.filename);
        trackExportFinished({
          format: exportFormat,
          outcome: "ok",
          durationMs: performance.now() - startedAt,
        });
        setExportModalOpen(false);
        navigate(EXPORT_PATH);
      } catch (exportError) {
        trackExportFinished({
          format: exportFormat,
          outcome: "error",
          durationMs: performance.now() - startedAt,
          error: exportError,
        });
        setError(
          exportError instanceof Error ? exportError.message : "Export failed.",
        );
      } finally {
        setIsExporting(false);
      }
    })();
  };

  const applyRasterEdit = async (
    edit: () => Promise<{ url: string; buffer: ArrayBuffer; width: number; height: number }>,
  ) => {
    if (!urls || !result) return;
    const edited = await edit();
    setUrls((current) => (current ? { ...current, clean: edited.url } : current));
    setResult((current) =>
      current
        ? {
            ...current,
            width: edited.width,
            height: edited.height,
            cleanImage: edited.buffer,
          }
        : current,
    );
    setExportWidth(edited.width);
    setExportHeight(edited.height);
    setResizeWidth(edited.width);
    setResizeHeight(edited.height);
  };

  const inpaintModelForDevice = (): NeuralInpaintModel =>
    navigator.maxTouchPoints > 1 || window.innerWidth < 800 ? "migan" : "lama";

  const handleEraseMask = (stroke: { bounds: Bounds; mask: Uint8Array }) => {
    if (!urls || !result || isBusy) return;
    setToolHintHidden(true);
    setIsProcessing(true);
    setProgress(0.08);
    void applyRasterEdit(() =>
      eraseRaster(urls.clean, stroke.bounds, stroke.mask, inpaintModelForDevice()),
    )
      .catch((error: unknown) => {
        setError(error instanceof Error ? error.message : "Image processing failed.");
      })
      .finally(() => {
        setProgress(0);
        setIsProcessing(false);
      });
  };

  const applyCrop = () => {
    if (!selection || !urls || !result || selection.width < 4 || selection.height < 4) return;
    void applyRasterEdit(() => cropRaster(urls.clean, selection)).catch((error: unknown) => {
      setError(error instanceof Error ? error.message : "Image processing failed.");
    });
  };

  const applyFlip = (axis: "horizontal" | "vertical") => {
    if (!urls || !result) return;
    void applyRasterEdit(() => flipRaster(urls.clean, axis)).catch((error: unknown) => {
      setError(error instanceof Error ? error.message : "Image processing failed.");
    });
  };

  const applyResize = () => {
    if (!urls || !result || resizeWidth < 1 || resizeHeight < 1) return;
    void applyRasterEdit(() =>
      resizeRaster(urls.clean, Math.round(resizeWidth), Math.round(resizeHeight)),
    ).catch((error: unknown) => {
      setError(error instanceof Error ? error.message : "Image processing failed.");
    });
  };

  const applyBackgroundCutout = () => {
    if (!urls || !result) return;
    setToolHintHidden(true);
    void applyRasterEdit(() => removeBackground(urls.clean)).catch((error: unknown) => {
      setError(error instanceof Error ? error.message : "Image processing failed.");
    });
  };

  const applyBackgroundReplacement = () => {
    if (!urls || !result) return;
    setToolHintHidden(true);
    void applyRasterEdit(() => replaceBackground(urls.clean, backgroundColor)).catch(
      (error: unknown) => {
        setError(error instanceof Error ? error.message : "Image processing failed.");
      },
    );
  };

  const saveProjectFile = () => {
    if (!file || !source) return;
    void (async () => {
      const clean = urls
        ? await blobToDataUrl(await fetch(urls.clean).then((response) => response.blob()))
        : null;
      const payload = {
        version: 1,
        name: file.name,
        source: {
          width: source.width,
          height: source.height,
          dataUrl: await blobToDataUrl(file),
        },
        clean,
        layers,
      };
      const blob = new Blob([JSON.stringify(payload)], {
        type: "application/json",
      });
      downloadFromUrl(URL.createObjectURL(blob), `${file.name.replace(/\.[^.]+$/, "")}.pngn`);
    })();
  };

  const loadProjectFile = (projectFile: File | undefined) => {
    if (!projectFile) return;
    void (async () => {
      const payload = JSON.parse(await projectFile.text()) as {
        name: string;
        source: { width: number; height: number; dataUrl: string };
        clean?: string | null;
        layers?: TextLayer[];
      };
      const restored = await dataUrlToFile(payload.source.dataUrl, payload.name);
      await handleFile(restored, "picker");
      if (payload.clean) {
        const cleanFile = await dataUrlToFile(payload.clean, "clean.png");
        const cleanUrl = URL.createObjectURL(cleanFile);
        const cleanImage = await cleanFile.arrayBuffer();
        setUrls({ clean: cleanUrl, mask: cleanUrl });
        setResult((current) =>
          current
            ? { ...current, cleanImage }
            : current,
        );
      }
      replaceLayers(payload.layers ?? []);
    })().catch((error: unknown) => {
      setError(error instanceof Error ? error.message : "Project could not be opened.");
    });
  };

  const selectEditorTool = (tool: EditorTool) => {
    setActiveTool(tool);
    setSelection(null);
    setIsExportPreview(false);
    setToolHintHidden(false);
    if (tool === "text" || tool === "select") {
      setIsAddingRegion(true);
      setSelectedLayerIds([]);
      return;
    }
    setIsAddingRegion(false);
    setSelectedLayerIds([]);
  };

  const editorMenus = (
    <div className="editor-menu-row" aria-label="Editor menus">
      <details className="editor-menu">
        <summary>File</summary>
        <div className="editor-menu-panel">
          <label className={`editor-menu-item${isBusy ? " is-disabled" : ""}`}>
            <ImagePlusIcon />
            {t("app.newImage")}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              disabled={isBusy}
              onChange={(event) =>
                void handleFile(event.target.files?.[0], "picker")
              }
            />
          </label>
          <label className={`editor-menu-item${isBusy ? " is-disabled" : ""}`}>
            <ImagePlusIcon />
            Open project
            <input
              type="file"
              accept=".pngn,application/json"
              disabled={isBusy}
              onChange={(event) => loadProjectFile(event.target.files?.[0])}
            />
          </label>
          <button
            type="button"
            className="editor-menu-item"
            disabled={isBusy || !file}
            onClick={saveProjectFile}
          >
            <DownloadIcon />
            Save project
          </button>
          <button
            type="button"
            className="editor-menu-item"
            disabled={isBusy}
            onClick={resetToUploadedImage}
          >
            <RestartIcon />
            {t("app.restart")}
          </button>
        </div>
      </details>
      <details className="editor-menu">
        <summary>Export</summary>
        <div className="editor-menu-panel">
          <button
            type="button"
            className="editor-menu-item"
            disabled={isBusy || !urls || !result}
            onClick={() => setExportModalOpen(true)}
          >
            <DownloadIcon />
            {t("app.export")}
          </button>
          <button
            type="button"
            className="editor-menu-item"
            disabled={isBusy || !urls || !result}
            aria-pressed={isExportPreview}
            onClick={handleToggleExportPreview}
          >
            <EyeIcon />
            {t("app.exportPreview")}
          </button>
        </div>
      </details>
      <details className="editor-menu">
        <summary>Edit</summary>
        <div className="editor-menu-panel">
          <button
            type="button"
            className="editor-menu-item"
            disabled={isBusy || layerHistory.past.length === 0}
            onClick={() => dispatchLayerHistory({ type: "undo" })}
          >
            Undo
          </button>
          <button
            type="button"
            className="editor-menu-item"
            disabled={isBusy || layerHistory.future.length === 0}
            onClick={() => dispatchLayerHistory({ type: "redo" })}
          >
            Redo
          </button>
        </div>
      </details>
    </div>
  );

  const featureToolbar =
    urls && result ? (
      <div className="editor-featurebar" role="toolbar" aria-label="Tools">
        <button
          type="button"
          className={activeTool === "text" ? "feature-tool active" : "feature-tool"}
          aria-pressed={activeTool === "text"}
          onClick={() => selectEditorTool("text")}
        >
          <TypeIcon />
          <span>Text</span>
        </button>
        <button
          type="button"
          className={activeTool === "erase" ? "feature-tool active" : "feature-tool"}
          aria-pressed={activeTool === "erase"}
          onClick={() => selectEditorTool("erase")}
        >
          <BrushIcon />
          <span>Erase</span>
        </button>
        <button
          type="button"
          className={activeTool === "select" ? "feature-tool active" : "feature-tool"}
          aria-pressed={activeTool === "select"}
          onClick={() => selectEditorTool("select")}
        >
          <CropIcon />
          <span>Crop</span>
        </button>
        <button
          type="button"
          className={activeTool === "background" ? "feature-tool active" : "feature-tool"}
          aria-pressed={activeTool === "background"}
          onClick={() => selectEditorTool("background")}
        >
          <WandIcon />
          <span>Background</span>
        </button>
      </div>
    ) : null;

  const statusCard = error ? (
    <section className="status-card error">
      <div>
        <AlertCircleIcon />
        <span>{translateError(error)}</span>
      </div>
    </section>
  ) : isProcessing ? (
    <LoadingToast progress={progress} />
  ) : null;

  const processingControls = (
    <section className="processing-controls">
      {urls && result && activeTool === "text" ? (
        <div className="raster-controls">
          {urls && result && !isAddingRegion ? (
            <button
              type="button"
              className="button-with-icon"
              disabled={isProcessing}
              onClick={() => {
                setActiveTool("text");
                setIsAddingRegion(true);
                setSelection(null);
                setSelectedLayerIds([]);
                setIsExportPreview(false);
              }}
            >
              <TypeIcon />
              {t("app.selectAnother")}
            </button>
          ) : (
            <>
              <button
                type="button"
                className="button-with-icon"
                disabled={!file || !hasValidSelection || isProcessing}
                onClick={requestProcessing}
              >
                <PencilIcon />
                {isProcessing
                  ? t("app.processing")
                  : t("app.editSelected")}
              </button>
              {isAddingRegion || selection ? (
                <button
                  type="button"
                  className="button-with-icon secondary-button"
                  disabled={isProcessing}
                  onClick={() => {
                    setSelection(null);
                    if (isAddingRegion) {
                      setIsAddingRegion(false);
                      setSelectedLayerIds([]);
                    }
                  }}
                >
                  {t("app.cancel")}
                </button>
              ) : null}
            </>
          )}
          <label>
            <span className="control-label-row">{t("app.backgroundFill")}</span>
            <Select
              className="control-input"
              aria-label={t("app.backgroundFill")}
              allowDeselect={false}
              checkIconPosition="left"
              disabled={isProcessing}
              comboboxProps={{ width: "target", shadow: "md", withinPortal: true }}
              hiddenInputProps={{ className: "reconstruction-method" }}
              value={
                options.method === "auto" ||
                options.method === "flat" ||
                options.method === "lama" ||
                options.method === "migan"
                  ? options.method
                  : "auto"
              }
              data={reconstructionMethods.map((method) => ({
                value: method.value,
                label: t(method.label),
              }))}
              renderOption={({ option }) => {
                const method = reconstructionMethods.find(
                  (item) => item.value === option.value,
                );
                if (!method) return option.label;
                return (
                  <span className="method-select-option">
                    <span>{option.label}</span>
                    <Tooltip
                      label={t(method.hint)}
                      withArrow
                      multiline
                      w={200}
                      position="right"
                      events={{ hover: true, focus: true, touch: true }}
                    >
                      <span
                        className="method-select-hint"
                        role="img"
                        aria-label={t(method.hintAria)}
                        onMouseDown={(event) => event.preventDefault()}
                      >
                        <HelpCircleIcon />
                      </span>
                    </Tooltip>
                  </span>
                );
              }}
              onChange={(value) => {
                if (
                  value === "auto" ||
                  value === "flat" ||
                  value === "migan" ||
                  value === "lama"
                ) {
                  requestMethod(value);
                }
              }}
            />
          </label>
          <label>
            <span className="control-label-row">
              {t("app.maskThreshold")}
              <HintTooltip
                label={t("app.maskThresholdHintAria")}
                hint={t("app.maskThresholdHint")}
              />
              <output>{options.maskThreshold}</output>
            </span>
            <Slider
              className="control-input"
              min={12}
              max={90}
              disabled={isProcessing}
              thumbLabel={t("app.maskThreshold")}
              value={options.maskThreshold}
              onChange={(maskThreshold) =>
                setOptions((current) => ({
                  ...current,
                  maskThreshold,
                }))
              }
            />
          </label>
          <label>
            <span className="control-label-row">
              {t("app.maskExpansion")}
              <HintTooltip
                label={t("app.maskExpansionHintAria")}
                hint={t("app.maskExpansionHint")}
              />
              <output>{options.maskDilation}px</output>
            </span>
            <Slider
              className="control-input"
              min={0}
              max={16}
              disabled={isProcessing}
              thumbLabel={t("app.maskExpansion")}
              label={(value) => `${value}px`}
              value={options.maskDilation}
              onChange={(maskDilation) =>
                setOptions((current) => ({
                  ...current,
                  maskDilation,
                }))
              }
            />
          </label>
          <p
            className={`settings-apply-hint${settingsHint ? " is-visible" : ""}`}
            aria-live="polite"
            aria-hidden={settingsHint ? undefined : true}
          >
            {settingsHint}
          </p>
        </div>
      ) : null}
      {urls && result && activeTool === "erase" ? (
        <label>
          <span className="control-label-row">
            Eraser size
            <output>{eraserSize}px</output>
          </span>
          <Slider
            className="control-input"
            min={8}
            max={160}
            disabled={isProcessing}
            value={eraserSize}
            label={(value) => `${value}px`}
            onChange={setEraserSize}
          />
        </label>
      ) : null}
      {urls && result && activeTool === "select" ? (
        <div className="raster-controls">
          <button type="button" className="secondary-button" onClick={applyCrop}>
            Crop to selection
          </button>
          <button type="button" className="secondary-button" onClick={() => applyFlip("horizontal")}>
            Flip horizontal
          </button>
          <button type="button" className="secondary-button" onClick={() => applyFlip("vertical")}>
            Flip vertical
          </button>
          <label>
            Width
            <input
              className="plain-input"
              type="number"
              min={1}
              value={resizeWidth || ""}
              onChange={(event) => setResizeWidth(Number(event.target.value) || 0)}
            />
          </label>
          <label>
            Height
            <input
              className="plain-input"
              type="number"
              min={1}
              value={resizeHeight || ""}
              onChange={(event) => setResizeHeight(Number(event.target.value) || 0)}
            />
          </label>
          <button type="button" className="secondary-button" onClick={applyResize}>
            Resize
          </button>
        </div>
      ) : null}
      {urls && result && activeTool === "background" ? (
        <div className="raster-controls">
          <button type="button" className="secondary-button" onClick={applyBackgroundCutout}>
            Remove background
          </button>
          <label>
            Background colour
            <input
              className="plain-input"
              type="color"
              value={backgroundColor}
              onChange={(event) => setBackgroundColor(event.target.value)}
            />
          </label>
          <button
            type="button"
            className="secondary-button"
            onClick={applyBackgroundReplacement}
          >
            Replace background
          </button>
        </div>
      ) : null}
    </section>
  );

  if (inEditor && !source) {
    return <main className="app-shell is-editor" />;
  }

  return (
    <main className={`app-shell${inEditor ? " is-editor" : " is-landing"}`}>
      {!inEditor || !source ? (
        <>
          <header className="app-header">
            <FlowSteps current={1} />
          </header>
          {statusCard}
          <LandingStage>
            <label
              className={`dropzone${isDragging ? " dragging" : ""}`}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                void handleFile(event.dataTransfer.files?.[0], "drop");
              }}
            >
              <span className="dropzone-icon-wrap">
                <svg
                  className="dropzone-icon"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="m21 15-4.5-4.5L7 20" />
                </svg>
              </span>
              <h2>{t("landing.dropTitle")}</h2>
              <p>{t("landing.dropHint")}</p>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) =>
                  void handleFile(event.target.files?.[0], "picker")
                }
              />
            </label>
          </LandingStage>
          <LandingSeo />
        </>
      ) : (
        <div className="editor-layout">
          <aside className="editor-sidebar">
            <div className="sidebar-header">
              <h1 className="visually-hidden">{t("title.home")}</h1>
              {editorMenus}
            </div>
            <ExportModal
              opened={exportModalOpen}
              format={exportFormat}
              isExporting={isExporting}
              outputWidth={exportWidth}
              outputHeight={exportHeight}
              targetKb={exportTargetKb}
              onClose={() => setExportModalOpen(false)}
              onFormatChange={setExportFormat}
              onOutputWidthChange={setExportWidth}
              onOutputHeightChange={setExportHeight}
              onTargetKbChange={setExportTargetKb}
              onExport={handleExport}
            />
            <LayersPanel
              layers={layers}
              selectedLayerIds={selectedLayerIds}
              staleLayerIds={dirtyLayerIds}
              disabled={isProcessing}
              onSelectLayer={handleSelectLayer}
              onRemoveLayer={removeLayer}
            />
            <div className="sidebar-actions">
              {processingControls}
            </div>
          </aside>

          <div className="editor-main">
            {featureToolbar}
            {result && urls && (activeTool === "text" || selectedLayer) ? (
              <div className="editor-topbar" aria-label="Text formatting">
                <TextToolbar
                  layer={isExportPreview ? null : selectedLayer}
                  disabled={isProcessing}
                  onChange={updateLayer}
                  onStyleChange={updateSelectedLayerStyle}
                />
              </div>
            ) : null}

            <div className="editor-stage">
              {!result || !urls ? (
                <RegionSelector
                  imageUrl={source.url}
                  documentKey={documentKey}
                  width={source.width}
                  height={source.height}
                  selection={selection}
                  disabled={isProcessing}
                  onChange={setSelection}
                />
              ) : (
                <EditorCanvas
                  backgroundUrl={urls.clean}
                  documentKey={documentKey}
                  width={result.width}
                  height={result.height}
                  layers={layers}
                  selectedLayerIds={selectedLayerIds}
                  interactionMode={
                    isProcessing || isExportPreview
                      ? "preview"
                      : activeTool === "erase"
                        ? "erase"
                        : activeTool === "select" || isAddingRegion
                          ? "select-region"
                          : "edit"
                  }
                  regionSelection={selection}
                  eraserSize={eraserSize}
                  onSelectLayer={handleSelectLayer}
                  onMoveLayer={moveLayer}
                  onRotateLayer={rotateLayer}
                  onFontSizeLayer={setLayerFontSize}
                  onEditText={editLayerText}
                  onFitTextBounds={fitTextLayerBounds}
                  onRegionSelectionChange={setSelection}
                  onEraseMask={handleEraseMask}
                />
              )}
              {canvasHint && CanvasHintIcon ? (
                <div className="selection-hint" role="status">
                  <p key={canvasHint.message}>
                    <CanvasHintIcon size={18} />
                    {t(canvasHint.message)}
                  </p>
                </div>
              ) : null}
              {statusCard}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
