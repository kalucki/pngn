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
import {
  EXPORT_PREVIEW_ID,
  LayersPanel,
} from "./editor/LayersPanel";
import {
  downloadFromUrl,
  exportFileName,
  renderExportImage,
  type ExportFormat,
} from "./editor/exportImage";
import { stashExport } from "./editor/exportTransfer";
import { isMonospaceFont } from "./editor/fonts";
import {
  adoptRegionLayers,
  findRegionByLayerId,
  layersFromRegions,
  optionsEqual,
  staleLayerIds,
  type ProcessedRegion,
} from "./editor/processedRegions";
import { RegionSelector } from "./editor/RegionSelector";
import { TextToolbar } from "./editor/TextToolbar";
import { FlowSteps } from "./layout/FlowSteps";
import { HintTooltip } from "./layout/HintTooltip";
import { LandingStage } from "./layout/LandingStage";
import {
  AlertCircleIcon,
  DownloadIcon,
  HelpCircleIcon,
  ImagePlusIcon,
  PencilIcon,
  PlusIcon,
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
  maskDilation: 2,
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

const neuralModelFor = (method: ProcessingOptions["method"]): NeuralInpaintModel =>
  method === "migan" ? "migan" : "lama";

type UiStage =
  | "waiting"
  | "reading"
  | "loadingModels"
  | "ocr"
  | "masking"
  | "reconstruction"
  | "ready"
  | "failed";

const progressStage: Record<
  "loading-models" | "ocr" | "masking" | "reconstruction",
  UiStage
> = {
  "loading-models": "loadingModels",
  ocr: "ocr",
  masking: "masking",
  reconstruction: "reconstruction",
};

const stageMessage: Record<UiStage, MessageKey> = {
  waiting: "stage.waiting",
  reading: "stage.reading",
  loadingModels: "stage.loadingModels",
  ocr: "stage.ocr",
  masking: "stage.masking",
  reconstruction: "stage.reconstruction",
  ready: "stage.ready",
  failed: "stage.failed",
};

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
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<UiStage>("waiting");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("image/png");
  const [isAddingRegion, setIsAddingRegion] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [regions, setRegions] = useState<ProcessedRegion[]>([]);
  const processingGenerationRef = useRef(0);
  const regionsRef = useRef<ProcessedRegion[]>([]);
  const optionsRef = useRef(options);
  const layersRef = useRef(layers);
  const selectedLayerIdRef = useRef(selectedLayerId);
  const urlsRef = useRef(urls);
  const isAddingRegionRef = useRef(isAddingRegion);
  const isProcessingRef = useRef(isProcessing);
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
    : layers.length > 0 && !selectedLayer && !isAddingRegion
      ? t("app.selectLayerToApply")
      : "";
  const hasValidSelection = Boolean(
    selection && selection.width >= 4 && selection.height >= 4,
  );
  const documentKey =
    file && source ? editorDocumentKey(file, source.width, source.height) : "";

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
    setStage("reading");

    try {
      const processed = await processImage(
        await file.arrayBuffer(),
        file.type,
        activeSelection,
        activeOptions,
        (nextStage, nextProgress) => {
          if (generation !== processingGenerationRef.current) return;
          setStage(progressStage[nextStage]);
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
      const nextRegionLayers = adoptRegionLayers(
        previousLayers,
        processed.textLayers,
        regionId,
      );
      const nextRegion: ProcessedRegion = {
        id: regionId,
        selection: activeSelection,
        options: activeOptions,
        layerIds: nextRegionLayers.map((layer) => layer.id),
        processed,
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
      if (!config.replaceRegionId) {
        setSelection(null);
        setIsAddingRegion(false);
      }
      setProgress(1);
      setStage("ready");
    } catch (processingError) {
      if (generation !== processingGenerationRef.current) return;
      setError(
        processingError instanceof Error
          ? processingError.message
          : "Processing failed.",
      );
      setStage("failed");
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
  }, []);

  useEffect(() => {
    if (!file || isAddingRegion || isProcessing) return;
    const layerId = selectedLayerIdRef.current;
    if (!layerId) return;
    const region = findRegionByLayerId(regionsRef.current, layerId);
    if (!region || optionsEqual(region.options, options)) return;
    const timeout = window.setTimeout(() => {
      const activeLayerId = selectedLayerIdRef.current;
      if (activeLayerId) requestApplyToLayerRef.current(activeLayerId);
    }, 450);
    return () => window.clearTimeout(timeout);
  }, [options, isAddingRegion, isProcessing, file]);

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
      setSelection(null);
      setResult(null);
      setUrls(null);
      setLayers([]);
      setSelectedLayerId(null);
      setIsAddingRegion(false);
      setError(null);
      setRegions([]);
    } catch {
      setError("This image could not be decoded by the browser.");
    }
  };

  const updateLayer = (nextLayer: TextLayer) => {
    setLayers((current) =>
      current.map((layer) => {
        if (layer.id !== nextLayer.id) return layer;
        const longestLine = nextLayer.text
          .split("\n")
          .reduce(
            (longest, line) => (line.length > longest.length ? line : longest),
            "",
          );
        const estimatedWidth =
          longestLine.length *
          nextLayer.typography.fontSize *
          (isMonospaceFont(nextLayer.typography.fontFamily) ? 0.62 : 0.56);
        return {
          ...nextLayer,
          bounds: {
            ...nextLayer.bounds,
            width: Math.max(nextLayer.bounds.width, estimatedWidth),
            height: Math.max(
              nextLayer.bounds.height,
              nextLayer.text.split("\n").length *
                nextLayer.typography.fontSize *
                nextLayer.typography.lineHeight,
            ),
          },
        };
      }),
    );
  };

  const handleSelectLayer = (
    id: string | null,
    source: LayerSelectSource = "canvas",
  ) => {
    setSelectedLayerId(id);
    if (id) {
      setIsAddingRegion(false);
      setSelection(null);
    }
    if (source === "sidebar" && id && id !== EXPORT_PREVIEW_ID) {
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

  const removeLayer = (id: string) => {
    const currentLayers = layersRef.current;
    const index = currentLayers.findIndex((layer) => layer.id === id);
    if (index < 0) return;
    const nextLayers = currentLayers.filter((layer) => layer.id !== id);
    setLayers(nextLayers);
    setRegions((current) =>
      current.map((region) => ({
        ...region,
        layerIds: region.layerIds.filter((layerId) => layerId !== id),
      })),
    );
    setResult((current) =>
      current ? { ...current, textLayers: nextLayers } : current,
    );
    if (selectedLayerIdRef.current === id) {
      setSelectedLayerId(
        (nextLayers[index] ?? nextLayers[index - 1])?.id ?? null,
      );
    }
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

  const newImageControl = (
    <label className="upload-button">
      <ImagePlusIcon />
      {t("app.newImage")}
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(event) => void handleFile(event.target.files?.[0])}
      />
    </label>
  );

  const statusCard =
    isProcessing || error ? (
      <section className={`status-card ${error ? "error" : ""}`}>
        {error ? (
          <div>
            <AlertCircleIcon />
            <span>{translateError(error)}</span>
          </div>
        ) : (
          <>
            <div>
              <strong>{t(stageMessage[stage])}</strong>
              <span>{Math.round(progress * 100)}%</span>
            </div>
            <progress max="1" value={progress} />
          </>
        )}
      </section>
    ) : null;

  const processingControls = (
    <section className="processing-controls">
      <label>
        <span className="control-label-row">{t("app.reconstruction")}</span>
        <Select
          className="control-input"
          aria-label={t("app.reconstruction")}
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
          max={8}
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
        </>
      ) : (
        <div className="editor-layout">
          <aside className="editor-sidebar">
            <div className="sidebar-header">
              <h1 className="visually-hidden">{t("title.home")}</h1>
              {newImageControl}
            </div>
            <LayersPanel
              layers={layers}
              selectedLayerId={selectedLayerId}
              staleLayerIds={dirtyLayerIds}
              hasBackground
              removeDisabled={isProcessing}
              onSelectLayer={handleSelectLayer}
              onRemoveLayer={removeLayer}
            />
            <div className="sidebar-actions">
              {urls && result ? (
                <button
                  type="button"
                  className={`button-with-icon${isAddingRegion ? " secondary-button" : ""}`}
                  onClick={() => {
                    setIsAddingRegion((current) => !current);
                    setSelection(null);
                    setSelectedLayerId(null);
                  }}
                >
                  {isAddingRegion ? null : <PlusIcon />}
                  {isAddingRegion ? t("app.cancel") : t("app.selectAnother")}
                </button>
              ) : null}
              {isAddingRegion ? (
                <button
                  type="button"
                  disabled={
                    !file ||
                    !selection ||
                    selection.width < 4 ||
                    selection.height < 4 ||
                    isProcessing
                  }
                  onClick={requestProcessing}
                >
                  {t("app.processNewArea")}
                </button>
              ) : null}
              {processingControls}
            </div>
          </aside>

          <div className="editor-main">
            <div className="editor-topbar">
              {!result || !urls ? (
                <div className="selection-hint">
                  <p>{t("app.dragHint")}</p>
                  <button
                    type="button"
                    className={`button-with-icon${hasValidSelection ? " is-ready" : ""}`}
                    disabled={isProcessing || !hasValidSelection}
                    aria-hidden={!hasValidSelection}
                    tabIndex={hasValidSelection ? undefined : -1}
                    onClick={requestProcessing}
                  >
                    <PencilIcon />
                    {isProcessing ? t("app.processing") : t("app.editSelected")}
                  </button>
                </div>
              ) : (
                <>
                  <TextToolbar layer={selectedLayer} onChange={updateLayer} />
                  <div className="export-bar">
                    <Select
                      size="xs"
                      className="export-format-select"
                      aria-label={t("app.exportFormat")}
                      comboboxProps={{ width: "target", shadow: "md", withinPortal: true }}
                      value={exportFormat}
                      data={[
                        { value: "image/png", label: "PNG" },
                        { value: "image/jpeg", label: "JPEG" },
                        { value: "image/webp", label: "WebP" },
                      ]}
                      onChange={(value) => {
                        if (value) setExportFormat(value as ExportFormat);
                      }}
                    />
                    <button
                      type="button"
                      className="button-with-icon"
                      disabled={isExporting}
                      onClick={handleExport}
                    >
                      <DownloadIcon />
                      {isExporting ? t("app.exporting") : t("app.export")}
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="editor-stage">
              {!result || !urls ? (
                <RegionSelector
                  imageUrl={source.url}
                  documentKey={documentKey}
                  width={source.width}
                  height={source.height}
                  selection={selection}
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
                    isAddingRegion
                      ? "select-region"
                      : selectedLayerId === EXPORT_PREVIEW_ID
                        ? "preview"
                        : "edit"
                  }
                  regionSelection={selection}
                  onSelectLayer={handleSelectLayer}
                  onMoveLayer={moveLayer}
                  onRotateLayer={rotateLayer}
                  onRegionSelectionChange={setSelection}
                />
              )}
              {statusCard}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
