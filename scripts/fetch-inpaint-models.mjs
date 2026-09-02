// Downloads the neural inpainting model weights into public/models/inpaint.
// These files are large (LaMa ~200 MB) and are intentionally NOT committed to
// git; run `pnpm fetch:models` once after cloning.
//
// URLs can be overridden with MIGAN_URL / LAMA_URL environment variables.
import { createWriteStream } from 'node:fs'
import { mkdir, open, stat, unlink } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const MODELS = [
  {
    name: 'MI-GAN 512 Places2 (pipeline v2, MIT)',
    url:
      process.env.MIGAN_URL ??
      'https://huggingface.co/andraniksargsyan/migan/resolve/main/migan_pipeline_v2.onnx?download=true',
    target: 'public/models/inpaint/migan/migan_pipeline_v2.onnx',
    minBytes: 20 * 1024 * 1024,
  },
  {
    name: 'LaMa big-lama fp32 (Apache-2.0)',
    url:
      process.env.LAMA_URL ??
      'https://huggingface.co/Carve/LaMa-ONNX/resolve/main/lama_fp32.onnx?download=true',
    target: 'public/models/inpaint/lama/lama_fp32.onnx',
    minBytes: 150 * 1024 * 1024,
  },
]

const formatMb = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`

const looksLikeOnnx = (header, size, minBytes) => {
  if (size < minBytes) return false
  const text = header.toString('utf8').trimStart()
  if (text.startsWith('<') || text.startsWith('version https://git-lfs')) {
    return false
  }
  return true
}

const isValidOnnx = async (path, minBytes) => {
  try {
    const info = await stat(path)
    if (info.size < minBytes) return false
    const handle = await open(path, 'r')
    try {
      const header = Buffer.alloc(256)
      const { bytesRead } = await handle.read(header, 0, 256, 0)
      return looksLikeOnnx(header.subarray(0, bytesRead), info.size, minBytes)
    } finally {
      await handle.close()
    }
  } catch {
    return false
  }
}

const download = async ({ name, url, target, minBytes }) => {
  const destination = join(root, target)
  if (await isValidOnnx(destination, minBytes)) {
    console.log(`✓ ${name} already present, skipping.`)
    return
  }
  await mkdir(dirname(destination), { recursive: true })
  console.log(`↓ ${name}\n  ${url}`)
  const response = await fetch(url)
  if (!response.ok || !response.body) {
    throw new Error(`Failed to download ${name}: HTTP ${response.status}`)
  }
  const total = Number(response.headers.get('content-length') ?? 0)
  let received = 0
  const source = Readable.fromWeb(response.body)
  source.on('data', (chunk) => {
    received += chunk.length
    if (total) {
      const percent = ((received / total) * 100).toFixed(0)
      process.stdout.write(`\r  ${percent}% (${formatMb(received)})   `)
    } else {
      process.stdout.write(`\r  ${formatMb(received)}   `)
    }
  })
  await pipeline(source, createWriteStream(destination))
  process.stdout.write(`\r  done (${formatMb(received)}).            \n`)
  if (!(await isValidOnnx(destination, minBytes))) {
    await unlink(destination).catch(() => {})
    throw new Error(
      `Downloaded ${name} is not a valid ONNX file (${formatMb(received)}).`,
    )
  }
}

for (const model of MODELS) {
  await download(model)
}
console.log('\nAll inpainting models are ready.')
