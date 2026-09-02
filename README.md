# txtimg prototype

A browser-only prototype that detects text with PP-OCRv6, builds a deterministic
removal mask, reconstructs the covered background, and exposes the recognized
text as editable layers.

## Run locally

```sh
pnpm install
pnpm fetch:models   # downloads the neural inpainting weights (once)
pnpm dev
```

`pnpm fetch:models` fetches the MI-GAN (Free) and LaMa (Pro) ONNX weights into
`public/models/inpaint/`. They are large (LaMa ~200 MB) and are gitignored, so
run it once after cloning. URLs can be overridden with `MIGAN_URL` / `LAMA_URL`.

Open the local URL shown by Vite, upload a PNG/JPEG/WebP image, drag a rectangle
around the text to change, then edit and export at the original resolution. OCR
runs only on an automatically padded version of that selection; segmentation
and reconstruction still use surrounding full-resolution source pixels.

Use **Add another text area** to draw more regions. Previously reconstructed
background pixels and edited layers remain active, and every editable text
rectangle stays visible on the editor canvas.

## Reconstruction tiers

Reconstruction is split into two client-side tiers, swappable with the Free/Pro
toggle:

- **Free — MI-GAN** (`migan_pipeline_v2.onnx`, ~28 MB, MIT). Runs in the browser
  via ONNX Runtime Web (WebGPU, WASM fallback). The default for complex
  backgrounds.
- **Pro — LaMa** (`lama_fp32.onnx`, ~200 MB, Apache-2.0). Higher quality for
  tough, detailed backgrounds; lazily downloaded on first use. Gated behind an
  email prompt (stored locally for now; no payment, no account).

Both run fully client-side. `auto` sends truly flat/gradient backgrounds to the
instant analytical fills and everything else to the tier's neural model, falling
back to classical OpenCV Telea if a model fails to load. Neural fills use a
padded context crop and a feathered composite so there are no hard seams.

If a region still looks wrong, the **"Not happy with the result?"** prompt
re-runs that area with the Pro model and lets you keep either the Free or Pro
result.

## Reconstruction methods

- MI-GAN neural inpainting (Free tier)
- LaMa neural inpainting (Pro tier)
- Flat-color median fill
- Per-channel linear gradient fit
- OpenCV Telea inpainting
- OpenCV Navier–Stokes inpainting
- Deterministic exemplar patch fill
- Automatic background classification

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
