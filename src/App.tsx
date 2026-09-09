import { Select, Slider, Tooltip } from "@mantine/core";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { withTextSizeBounds } from "./editor/textLayerBounds";
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
  DownloadIcon,
  EyeIcon,
  HelpCircleIcon,
  ImagePlusIcon,
  DashedBoxIcon,
  PencilIcon,
  PlusIcon,
  RestartIcon,
} from "./layout/icons";
import { EXPORT_PATH, navigate } from "./navigation";
import { processImage, warmupProcessingWorker } from "./processing/client";
import { warmupInpaintWorker } from "./processing/inpaintClient";
import { prefetchInpaintModel } from "./processing/modelCache";
import { warmupOpenCvWorker } from "./processing/openCvClient";
import { useLocale } from "./i18n/useLocale";
import type { MessageKey } from "./i18n/messages";

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

type ReconstructionChoice = "auto" | NeuralInpaintModel;

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
    value: "lama",
    label: "app.methodLama",
    hint: "app.methodLamaHint",
    hintAria: "app.methodLamaHintAria",
  },
  {
    value: "migan",
    label: "app.methodMigan",
    hint: "app.methodMiganHint",
    hintAria: "app.methodMiganHintAria",
  },
];

const neuralModelFor = (
  method: ProcessingOptions["method"],
): NeuralInpaintModel => (method === "migan" ? "migan" : "lama");

const canvasToPng = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Canvas encoding failed.")),
      "image/png",
    );
  });

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
  const { t, translateError } = useLocale();
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ProcessedImage | null>(null);
  const [layers, setLayers] = useState<TextLayer[]>([]);
  const [urls, setUrls] = useState<ImageUrls | null>(null);
  const [source, setSource] = useState<ImageSource | null>(null);
  const [selection, setSelection] = useState<Bounds | null>(null);
  const [options, setOptions] = useState<ProcessingOptions>(initialOptions);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [textFocusKey, setTextFocusKey] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("image/png");
  const [isAddingRegion, setIsAddingRegion] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [isExportPreview, setIsExportPreview] = useState(false);
  const [regions, setRegions] = useState<ProcessedRegion[]>([]);
  const processingGenerationRef = useRef(0);
  const regionsRef = useRef<ProcessedRegion[]>([]);
  const optionsRef = useRef(options);
  const layersRef = useRef(layers);
  const selectedLayerIdRef = useRef(selectedLayerId);
  const urlsRef = useRef(urls);
  const isAddingRegionRef = useRef(isAddingRegion);
  const isProcessingRef = useRef(isProcessing);
  const removeLayerChainRef = useRef(Promise.resolve());
  const requestApplyToLayerRef = useRef<(layerId: string) => void>(() => {});

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
  const showDragHint =
    (!result || !urls || isAddingRegion) &&
    !hasValidSelection &&
    !isProcessing;
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
    isProcessingRef.current = true;
    setIsProcessing(true);
    setError(null);
    setProgress(0.02);

    try {
      const processed = await processImage(
        await file.arrayBuffer(),
        file.type,
        activeSelection,
        activeOptions,
        (_nextStage, nextProgress) => {
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
      const nextRegionLayers = markPendingFontMatches(adoptedRegionLayers);
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

      const keepId = selectedLayerIdRef.current;
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
      setLayers(nextLayers);
      setSelectedLayerId(
        nextRegionLayers.some((layer) => layer.id === keepId)
          ? keepId
          : (nextRegionLayers[0]?.id ?? keepId),
      );
      setIsExportPreview(false);
      if (!config.replaceRegionId) {
        setSelection(null);
        setIsAddingRegion(false);
      }
      setProgress(1);
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
        void matchTextLayerFonts(file, nextRegionLayers, applyMatchedLayer).catch(
          (error) => {
            console.warn("[pngn font] matching failed:", error);
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
    selectedLayerIdRef.current = selectedLayerId;
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
        setSelectedLayerId(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isAddingRegion, isProcessing, result, selection, source, urls]);

  useEffect(() => {
    if (!file || isAddingRegion || isProcessing || isExportPreview) return;
    const layerId = selectedLayerIdRef.current;
    if (!layerId) return;
    const region = findRegionByLayerId(regionsRef.current, layerId);
    if (!region || optionsEqual(region.options, options)) return;
    const timeout = window.setTimeout(() => {
      const activeLayerId = selectedLayerIdRef.current;
      if (activeLayerId) requestApplyToLayerRef.current(activeLayerId);
    }, 450);
    return () => window.clearTimeout(timeout);
  }, [options, isAddingRegion, isProcessing, isExportPreview, file]);

  const requestMethod = (method: ReconstructionChoice) => {
    setOptions((current) => ({
      ...current,
      method,
    }));
    prefetchInpaintModel(neuralModelFor(method));
  };

  const requestProcessing = () => {
    void runProcessing();
  };

  const handleFile = async (nextFile: File | undefined) => {
    if (!nextFile) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(nextFile.type)) {
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
      bitmap.close();
      setFile(nextFile);
      setSource(nextSource);
      prefetchInpaintModel(neuralModelFor(options.method));
      prefetchFontIdModel();
      resetToUploadedImage();
    } catch {
      setError("This image could not be decoded by the browser.");
    }
  };

  const resetToUploadedImage = () => {
    processingGenerationRef.current += 1;
    isProcessingRef.current = false;
    setIsProcessing(false);
    setProgress(0);
    setError(null);
    setSelection(null);
    setResult(null);
    setUrls(null);
    setLayers([]);
    setSelectedLayerId(null);
    setIsAddingRegion(false);
    setIsExportPreview(false);
    setRegions([]);
  };

  const updateLayer = (nextLayer: TextLayer) => {
    setLayers((current) =>
      current.map((layer) =>
        layer.id === nextLayer.id ? withTextSizeBounds(nextLayer) : layer,
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
    source: LayerSelectSource = "canvas",
  ) => {
    if (isProcessingRef.current) return;
    setIsExportPreview(false);
    setSelectedLayerId(id);
    if (id) {
      setIsAddingRegion(false);
      setSelection(null);
    }
    if (source === "sidebar" && id) {
      requestApplyToLayer(id);
    }
  };

  const handleActivateLayer = () => {
    setTextFocusKey((key) => key + 1);
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

    const previousSelected = selectedLayerIdRef.current;
    setLayers(nextLayers);
    if (previousSelected === id) {
      const nextSelected =
        (nextLayers[index] ?? nextLayers[index - 1])?.id ?? null;
      selectedLayerIdRef.current = nextSelected;
      setSelectedLayerId(nextSelected);
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
        selectedLayerIdRef.current = previousSelected;
        setSelectedLayerId(previousSelected);
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
        );
        const pending = stashExport(blob, filename);
        downloadFromUrl(pending.url, pending.filename);
        setExportModalOpen(false);
        navigate(EXPORT_PATH);
      } catch (exportError) {
        setError(
          exportError instanceof Error ? exportError.message : "Export failed.",
        );
      } finally {
        setIsExporting(false);
      }
    })();
  };

  const exportControl =
    urls && result ? (
      <>
        <button
          type="button"
          className="button-with-icon sidebar-export-button"
          disabled={isBusy}
          onClick={() => setExportModalOpen(true)}
        >
          <DownloadIcon />
          {t("app.export")}
        </button>
        <button
          type="button"
          className="button-with-icon secondary-button sidebar-preview-button"
          disabled={isBusy}
          aria-pressed={isExportPreview}
          onClick={handleToggleExportPreview}
        >
          <EyeIcon />
          {t("app.exportPreview")}
        </button>
      </>
    ) : null;

  const newImageControl = (
    <label
      className={`upload-button${isBusy ? " is-disabled" : ""}`}
      aria-disabled={isBusy}
    >
      <ImagePlusIcon />
      {t("app.newImage")}
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        disabled={isBusy}
        onChange={(event) => void handleFile(event.target.files?.[0])}
      />
    </label>
  );

  const restartControl = (
    <button
      type="button"
      className="button-with-icon upload-button"
      disabled={isBusy}
      onClick={resetToUploadedImage}
    >
      <RestartIcon />
      {t("app.restart")}
    </button>
  );

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
            if (value === "auto" || value === "migan" || value === "lama") {
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
    </section>
  );

  return (
    <main className={`app-shell${!source ? " is-landing" : " is-editor"}`}>
      {!source ? (
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
                void handleFile(event.dataTransfer.files?.[0]);
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
                onChange={(event) => void handleFile(event.target.files?.[0])}
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
              {exportControl}
              {newImageControl}
              {restartControl}
            </div>
            <ExportModal
              opened={exportModalOpen}
              format={exportFormat}
              isExporting={isExporting}
              onClose={() => setExportModalOpen(false)}
              onFormatChange={setExportFormat}
              onExport={handleExport}
            />
            <LayersPanel
              layers={layers}
              selectedLayerId={selectedLayerId}
              staleLayerIds={dirtyLayerIds}
              disabled={isProcessing}
              onSelectLayer={handleSelectLayer}
              onRemoveLayer={removeLayer}
            />
            <div className="sidebar-actions">
              {urls && result && !isAddingRegion ? (
                <button
                  type="button"
                  className="button-with-icon"
                  disabled={isProcessing}
                  onClick={() => {
                    setIsAddingRegion(true);
                    setSelection(null);
                    setSelectedLayerId(null);
                    setIsExportPreview(false);
                  }}
                >
                  <PlusIcon />
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
                          setSelectedLayerId(null);
                        }
                      }}
                    >
                      {t("app.cancel")}
                    </button>
                  ) : null}
                </>
              )}
              {processingControls}
            </div>
          </aside>

          <div className="editor-main">
            {result && urls ? (
              <div className="editor-topbar">
                <TextToolbar
                  layer={isExportPreview ? null : selectedLayer}
                  disabled={isProcessing}
                  onChange={updateLayer}
                  textFocusKey={textFocusKey}
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
                  selectedLayerId={selectedLayerId}
                  interactionMode={
                    isProcessing
                      ? "preview"
                      : isAddingRegion
                        ? "select-region"
                        : isExportPreview
                          ? "preview"
                          : "edit"
                  }
                  regionSelection={selection}
                  onSelectLayer={handleSelectLayer}
                  onActivateLayer={handleActivateLayer}
                  onMoveLayer={moveLayer}
                  onRotateLayer={rotateLayer}
                  onFontSizeLayer={setLayerFontSize}
                  onRegionSelectionChange={setSelection}
                />
              )}
              {showDragHint ? (
                <div className="selection-hint" role="status">
                  <p>
                    <DashedBoxIcon size={18} />
                    {t("app.dragHint")}
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
