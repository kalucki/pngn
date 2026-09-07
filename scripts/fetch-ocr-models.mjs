// Downloads PP-OCRv6 medium ORT weights into public/models/ocr.
// Tiny weights stay vendored in git; medium is larger and gitignored.
import { mkdir, writeFile, stat } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const targetDir = join(root, 'public/models/ocr/ppocr-v6-medium-v1')
const SOURCE =
  'https://media.githubusercontent.com/media/PT-Perkasa-Pilar-Utama/ppu-paddle-ocr-models/main'
const DICT_SOURCE =
  'https://raw.githubusercontent.com/PT-Perkasa-Pilar-Utama/ppu-paddle-ocr-models/main'

const FILES = [
  {
    name: 'PP-OCRv6 medium detection',
    url: `${SOURCE}/detection/ort/PP-OCRv6_medium_det.ort`,
    target: 'detection.ort',
    minBytes: 40 * 1024 * 1024,
  },
  {
    name: 'PP-OCRv6 medium recognition',
    url: `${SOURCE}/recognition/ort/PP-OCRv6_medium_rec.ort`,
    target: 'recognition.ort',
    minBytes: 50 * 1024 * 1024,
  },
  {
    name: 'PP-OCRv6 dictionary',
    url: `${DICT_SOURCE}/recognition/ppocrv6_dict.txt`,
    target: 'dictionary.txt',
    minBytes: 20 * 1024,
  },
]

const exists = async (path, minBytes) => {
  try {
    const info = await stat(path)
    return info.isFile() && info.size >= minBytes
  } catch {
    return false
  }
}

const download = async ({ name, url, target, minBytes }) => {
  const destination = join(targetDir, target)
  if (await exists(destination, minBytes)) {
    console.log(`✓ ${name} already present, skipping.`)
    return
  }
  console.log(`↓ ${name}\n  ${url}`)
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to download ${name}: HTTP ${response.status}`)
  }
  const bytes = new Uint8Array(await response.arrayBuffer())
  if (bytes.byteLength < minBytes) {
    throw new Error(
      `Downloaded ${name} is too small (${bytes.byteLength} bytes).`,
    )
  }
  await writeFile(destination, bytes)
  console.log(`  saved ${bytes.byteLength} bytes`)
}

await mkdir(targetDir, { recursive: true })
for (const file of FILES) {
  await download(file)
}
