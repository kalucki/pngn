// Refreshes Storia label metadata and the Google Fonts catalog.
// ONNX weights load from Hugging Face at runtime, in both `pnpm dev` and
// production, so they are not downloaded here.
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  buildGoogleFontLookup,
  fetchGoogleFontMetadata,
  resolveGoogleFontLookup,
  stemFromClassName,
  writeGoogleFontCatalog,
} from './google-font-catalog.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const STORIA_BASE = 'https://huggingface.co/storia/font-classify-onnx/resolve/main'

const METADATA = [
  {
    name: 'Storia font model config',
    url:
      process.env.STORIA_CONFIG_URL ??
      `${STORIA_BASE}/model_config.yaml?download=true`,
    target: 'public/models/font/storia/model_config.yaml',
  },
  {
    name: 'Storia Google Fonts mapping',
    url:
      process.env.STORIA_MAPPING_URL ??
      `${STORIA_BASE}/fonts_mapping.yaml?download=true`,
    target: 'public/models/font/storia/fonts_mapping.yaml',
  },
]

const exists = async (path) => {
  try {
    const info = await stat(path)
    return info.isFile() && info.size > 0
  } catch {
    return false
  }
}

const downloadText = async ({ name, url, target }) => {
  const destination = join(root, target)
  if (await exists(destination)) {
    console.log(`✓ ${name} already present, skipping.`)
    return
  }
  await mkdir(dirname(destination), { recursive: true })
  console.log(`↓ ${name}\n  ${url}`)
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to download ${name}: HTTP ${response.status}`)
  }
  const text = await response.text()
  if (text.trimStart().startsWith('<') || text.length < 20) {
    throw new Error(`Downloaded ${name} does not look like metadata.`)
  }
  await writeFile(destination, text)
}

const parseClassNames = (yaml) => {
  const classNames = []
  let inClassNames = false
  for (const line of yaml.split(/\r?\n/)) {
    if (/^classnames:\s*$/.test(line)) {
      inClassNames = true
      continue
    }
    if (!inClassNames) continue
    const match = /^\s*-\s*['"]?([^'"]+)['"]?\s*$/.exec(line)
    if (match) {
      classNames.push(match[1])
      continue
    }
    if (/^\S/.test(line)) break
  }
  return classNames
}

const splitCamelFamily = (value) =>
  value
    .replace(/([a-z])([A-Z0-9])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    .replace(/([0-9])([A-Za-z])/g, '$1 $2')
    .replace(/([A-Za-z])([0-9])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()

const normalizeFamily = (className, lookup) => {
  const resolved = resolveGoogleFontLookup(className, lookup)
  if (resolved) return resolved.family
  return splitCamelFamily(stemFromClassName(className))
}

const weightFor = (className) => {
  if (/ExtraBold/i.test(className)) return 800
  if (/SemiBold/i.test(className)) return 600
  if (/ExtraLight/i.test(className)) return 200
  if (/Thin/i.test(className)) return 100
  if (/Light/i.test(className)) return 300
  if (/Medium/i.test(className)) return 500
  if (/Black/i.test(className)) return 900
  if (/Bold/i.test(className)) return 700
  return 400
}

const generateFontLabels = async (lookup) => {
  const configPath = join(root, 'public/models/font/storia/model_config.yaml')
  const labelsPath = join(root, 'public/models/font/storia/labels.json')
  const configYaml = await readFile(configPath, 'utf8')
  const labels = parseClassNames(configYaml).map((className, index) => ({
    index,
    className,
    family: normalizeFamily(className, lookup),
    weight: weightFor(className),
    italic: /italic/i.test(className),
  }))
  if (labels.length < 3000) {
    throw new Error(`Expected at least 3000 Storia labels, got ${labels.length}.`)
  }
  await writeFile(labelsPath, `${JSON.stringify(labels)}\n`)
  console.log(`✓ Generated ${labels.length} Storia font labels.`)
}

const generateGoogleFontCatalog = async () => {
  console.log('↓ Google Fonts family catalog')
  const metadata = await fetchGoogleFontMetadata()
  const lookup = buildGoogleFontLookup(metadata)
  const keys = await writeGoogleFontCatalog(lookup)
  console.log(`✓ Wrote ${keys} Google Fonts lookup keys.`)
  return lookup
}

for (const metadata of METADATA) {
  await downloadText(metadata)
}
const lookup = await generateGoogleFontCatalog().catch((error) => {
  console.warn(
    `Could not refresh the Google Fonts catalog: ${error instanceof Error ? error.message : error}`,
  )
  return null
})
if (lookup) await generateFontLabels(lookup)
else console.warn('Keeping existing Storia font labels.')
console.log('\nFont metadata is ready. ONNX weights load from Hugging Face at runtime.')
