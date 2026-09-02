# pngn

Change text on any image, entirely in the browser. pngn finds letters in a
selection, paints them out of the background, and turns the recognized text into
editable layers. Images never leave the device: there is no account, no upload,
and no server-side processing.

## Run locally

```sh
pnpm install
pnpm fetch:models   # downloads the neural inpainting weights (once)
pnpm dev
```

`pnpm fetch:models` fetches the MI-GAN and LaMa ONNX weights into
`public/models/inpaint/`. They are large (LaMa ~200 MB) and are gitignored, so
run it once after cloning. URLs can be overridden with `MIGAN_URL` / `LAMA_URL`.

Open the local URL shown by Vite, drop a PNG, JPEG, or WebP, drag a rectangle
around the text to change, then edit and export at the original resolution. OCR
runs only on an automatically padded version of that selection; segmentation
and reconstruction still use surrounding full-resolution source pixels.

Use **Select another area** to process more regions. Previously reconstructed
background pixels and edited layers stay in place, and every text rectangle
remains visible on the editor canvas.

The UI is localized in English, Spanish, Polish, Simplified Chinese, Nigerian
Pidgin, and Arabic (RTL). Credits for the inpainting models live at
`/how-it-works`.

## Editing

Recognized text becomes layers you can rewrite, restyle, move, and rotate.
Typography covers font (system plus Google Fonts), size, weight, color, stroke,
and opacity. Mask threshold and mask expansion adjust how aggressively the old
letters are erased.

Export as PNG, JPEG, or WebP. The download is composed locally and never leaves
the browser.

## Reconstruction

Choose a fill from the Reconstruction control:

- **Auto** - instant color or gradient fill on flat backgrounds; LaMa on photos
  and busy textures.
- **MI-GAN** (`migan_pipeline_v2.onnx`, ~28 MB, MIT) - faster neural fill. Best
  for small text and simple backgrounds.
- **LaMa** (`lama_fp32.onnx`, ~200 MB, Apache-2.0) - slower, more detailed fill
  for large text, photos, or busy textures.

Both neural models run fully client-side via ONNX Runtime Web (WebGPU, WASM
fallback). Weights are prefetched into Cache Storage and loaded on first use.
Neural fills use a padded context crop and a feathered composite so there are
no hard seams. If a neural model fails to load, reconstruction falls back to
OpenCV Telea.

Glyph masks use crop-local robust background fitting, perceptual Lab residuals,
adaptive noise thresholds, color-cluster rejection, morphology, and connected
weak-residual growth to capture antialiasing, outlines, and nearby shadows.

## Local assets

PP-OCRv6 tiny ORT weights and dictionary live under
`public/models/ocr/ppocr-v6-tiny-v1`. ONNX Runtime's WASM binary is bundled by
Vite. Once these assets have been cached, processing does not need an inference
API or upload the image.

## Checks

```sh
pnpm test
pnpm lint
pnpm build
pnpm smoke # requires local Chrome and a running pnpm dev
```
