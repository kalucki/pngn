const GA_MEASUREMENT_ID = "G-5ZC0BMBPFE";

declare global {
  interface Window {
    dataLayer: IArguments[];
    gtag: (...args: unknown[]) => void;
  }
}

const enabled =
  /^G-[A-Z0-9]+$/.test(GA_MEASUREMENT_ID) &&
  !GA_MEASUREMENT_ID.includes("XXXX");

let started = false;
let lastTrackedPath: string | undefined;
const seenClientErrors = new Set<string>();

// Event params are short labels only. Never pass file names, image bytes,
// recognized text, or raw exception messages (those can contain URLs).
type ParamValue = string | number;
type Params = Record<string, ParamValue>;

const track = (name: string, params: Params = {}) => {
  if (!enabled || typeof window === "undefined") return;
  const safe: Params = {};
  for (const [key, value] of Object.entries(params)) {
    safe[key] =
      typeof value === "number"
        ? Number.isFinite(value)
          ? Math.round(value)
          : 0
        : value.slice(0, 100);
  }
  window.gtag?.("event", name, safe);
};

export const megapixelBucket = (width: number, height: number) => {
  const megapixels = (width * height) / 1_000_000;
  if (megapixels < 1) return "lt1";
  if (megapixels < 4) return "1-4";
  if (megapixels <= 12) return "4-12";
  return "gt12";
};

export const countBucket = (count: number) => {
  if (count <= 0) return "0";
  if (count === 1) return "1";
  if (count <= 5) return "2-5";
  return "6+";
};

const IMAGE_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/webp": "webp",
};

export const imageTypeLabel = (mimeType: string) =>
  IMAGE_TYPES[mimeType] ?? "other";

const EXPORT_FORMATS: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/webp": "webp",
};

export const exportFormatLabel = (mimeType: string) =>
  EXPORT_FORMATS[mimeType] ?? "other";

const ERROR_CODES: Record<string, string> = {
  "No text was found in this selection. Draw a slightly wider area around the text.":
    "no_text",
  "Canvas 2D is unavailable in this browser.": "canvas",
  "Canvas 2D is unavailable in this worker.": "canvas",
  "Canvas 2D is unavailable.": "canvas",
  "Canvas encoding failed.": "encode",
  "The processing worker crashed.": "worker",
  "OpenCV worker crashed.": "worker",
  "Image processing failed.": "processing",
  "Processing failed.": "processing",
  "OpenCV inpainting failed.": "opencv",
  "Neural inpainting failed.": "inpaint",
  "Export failed.": "export",
  "The text layer could not be removed.": "layer_remove",
  "No font candidates returned.": "font",
  "Font matching failed.": "font",
  "Font labels are missing. Run pnpm fetch:models.": "font_model",
  "Font labels are invalid. Run pnpm fetch:models.": "font_model",
  "This image could not be decoded by the browser.": "decode",
};

export const errorCode = (error: unknown) => {
  const message = error instanceof Error ? error.message : "";
  const known = ERROR_CODES[message];
  if (known) return known;
  if (message.startsWith("Failed to download model from Hugging Face")) {
    return "model";
  }
  if (message.startsWith("Hugging Face model was too small")) return "model";
  if (message.startsWith("Could not fetch ")) return "font_fetch";
  if (message.startsWith("Google Fonts returned no ")) return "font_fetch";
  return "unknown";
};

export type ProcessStage =
  | "start"
  | "loading-models"
  | "ocr"
  | "masking"
  | "reconstruction"
  | "compose";

export type ProcessScope = "full" | "region" | "reapply";

export const initAnalytics = () => {
  if (!enabled || started || typeof window === "undefined") return;
  started = true;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });

  const script = document.createElement("script");
  script.async = true;
  script.crossOrigin = "anonymous";
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
  document.head.appendChild(script);

  window.addEventListener("error", (event) => {
    reportClientError(event.error ?? event.message);
  });
  window.addEventListener("unhandledrejection", (event) => {
    reportClientError(event.reason);
  });
};

export const setAnalyticsLocale = (locale: string) => {
  if (!enabled || typeof window === "undefined") return;
  window.gtag?.("set", "user_properties", { ui_locale: locale });
};

export const trackPageView = (path: string) => {
  if (!enabled || lastTrackedPath === path || typeof window === "undefined") {
    return;
  }
  lastTrackedPath = path;
  window.gtag?.("event", "page_view", {
    page_path: path,
    page_title: document.title,
    page_location: window.location.href,
  });
};

export const trackImageOpened = (
  mimeType: string,
  width: number,
  height: number,
  source: "drop" | "picker",
) => {
  track("image_opened", {
    type: imageTypeLabel(mimeType),
    megapixels: megapixelBucket(width, height),
    source,
  });
};

export const trackImageRejected = (reason: "type" | "decode") => {
  track("image_rejected", { reason });
};

export const trackProcessFinished = (details: {
  method: string;
  outcome: "ok" | "error";
  durationMs: number;
  scope: ProcessScope;
  layers?: number;
  stage?: ProcessStage;
  error?: unknown;
  ocrProvider?: "webgpu" | "wasm";
  inpaintProvider?: "webgpu" | "wasm" | null;
}) => {
  const params: Params = {
    method: details.method,
    outcome: details.outcome,
    duration_ms: Math.max(0, details.durationMs),
    scope: details.scope,
  };
  if (details.outcome === "ok") {
    params.layers = countBucket(details.layers ?? 0);
    if (details.ocrProvider) params.ocr_provider = details.ocrProvider;
    if (details.inpaintProvider !== undefined) {
      params.inpaint_provider = details.inpaintProvider ?? "none";
    }
  } else {
    params.stage = details.stage ?? "start";
    params.error_code = errorCode(details.error);
  }
  track("process_finished", params);
};

export const trackFontMatchFinished = (
  layers: Array<{ fontMatch?: { status: string } }>,
) => {
  let matched = 0;
  let failed = 0;
  for (const layer of layers) {
    if (layer.fontMatch?.status === "ready") matched += 1;
    if (layer.fontMatch?.status === "error") failed += 1;
  }
  track("font_match_finished", {
    outcome: "ok",
    matched: countBucket(matched),
    failed: countBucket(failed),
  });
};

export const trackFontMatchFailed = (error: unknown) => {
  track("font_match_finished", {
    outcome: "error",
    matched: "0",
    failed: "0",
    error_code: errorCode(error),
  });
};

export const trackExportFinished = (details: {
  format: string;
  outcome: "ok" | "error";
  durationMs: number;
  error?: unknown;
}) => {
  const params: Params = {
    format: exportFormatLabel(details.format),
    outcome: details.outcome,
    duration_ms: Math.max(0, details.durationMs),
  };
  if (details.outcome === "error") params.error_code = errorCode(details.error);
  track("export_finished", params);
};

export const trackMethodChanged = (method: string) => {
  track("method_changed", { method });
};

export const trackLayerRemoved = (
  outcome: "ok" | "error",
  error?: unknown,
) => {
  const params: Params = { outcome };
  if (outcome === "error") params.error_code = errorCode(error);
  track("layer_removed", params);
};

export const reportClientError = (error: unknown) => {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "";
  if (message.includes("ResizeObserver")) return;
  if (seenClientErrors.size >= 100) return;
  const name =
    error instanceof Error && error.name ? error.name.slice(0, 40) : "Error";
  const key = `${name}\n${message.slice(0, 200)}`;
  if (seenClientErrors.has(key)) return;
  seenClientErrors.add(key);
  track("client_error", { name });
};
