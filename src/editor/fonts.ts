import { resolveGoogleFontFamily } from '../fonts/googleFontFamily'

export type FontCategory = 'system' | 'sans' | 'serif' | 'display' | 'mono'

export type FontDefinition = {
  family: string
  category: FontCategory
  source: 'system' | 'google'
  weights: number[]
}

export const FONT_WEIGHT_LABELS: Record<number, string> = {
  100: 'Thin',
  200: 'Extra light',
  300: 'Light',
  400: 'Regular',
  500: 'Medium',
  600: 'Semibold',
  700: 'Bold',
  800: 'Extra bold',
  900: 'Black',
}

export const FONT_GROUP_ORDER: FontCategory[] = [
  'system',
  'sans',
  'serif',
  'display',
  'mono',
]

export const FONT_GROUP_LABELS: Record<FontCategory, string> = {
  system: 'System',
  sans: 'Sans',
  serif: 'Serif',
  display: 'Display',
  mono: 'Monospace',
}

const SYSTEM_WEIGHTS = [400, 500, 600, 700, 800, 900]

export const FONT_CATALOG: FontDefinition[] = [
  { family: 'Arial', category: 'system', source: 'system', weights: SYSTEM_WEIGHTS },
  {
    family: 'Helvetica',
    category: 'system',
    source: 'system',
    weights: SYSTEM_WEIGHTS,
  },
  {
    family: 'Georgia',
    category: 'system',
    source: 'system',
    weights: SYSTEM_WEIGHTS,
  },
  {
    family: 'Times New Roman',
    category: 'system',
    source: 'system',
    weights: SYSTEM_WEIGHTS,
  },
  {
    family: 'Courier New',
    category: 'system',
    source: 'system',
    weights: SYSTEM_WEIGHTS,
  },
  {
    family: 'Impact',
    category: 'system',
    source: 'system',
    weights: SYSTEM_WEIGHTS,
  },
  {
    family: 'Inter',
    category: 'sans',
    source: 'google',
    weights: [400, 500, 600, 700, 800, 900],
  },
  {
    family: 'Roboto',
    category: 'sans',
    source: 'google',
    weights: [300, 400, 500, 700, 900],
  },
  {
    family: 'Open Sans',
    category: 'sans',
    source: 'google',
    weights: [400, 500, 600, 700, 800],
  },
  {
    family: 'Lato',
    category: 'sans',
    source: 'google',
    weights: [300, 400, 700, 900],
  },
  {
    family: 'Montserrat',
    category: 'sans',
    source: 'google',
    weights: [400, 500, 600, 700, 800, 900],
  },
  {
    family: 'Poppins',
    category: 'sans',
    source: 'google',
    weights: [400, 500, 600, 700, 800, 900],
  },
  {
    family: 'Nunito',
    category: 'sans',
    source: 'google',
    weights: [400, 600, 700, 800, 900],
  },
  {
    family: 'Outfit',
    category: 'sans',
    source: 'google',
    weights: [400, 500, 600, 700, 800, 900],
  },
  {
    family: 'Oswald',
    category: 'sans',
    source: 'google',
    weights: [300, 400, 500, 600, 700],
  },
  {
    family: 'Rubik',
    category: 'sans',
    source: 'google',
    weights: [400, 500, 600, 700, 800, 900],
  },
  {
    family: 'DM Sans',
    category: 'sans',
    source: 'google',
    weights: [400, 500, 600, 700],
  },
  {
    family: 'Playfair Display',
    category: 'serif',
    source: 'google',
    weights: [400, 500, 600, 700, 800, 900],
  },
  {
    family: 'Merriweather',
    category: 'serif',
    source: 'google',
    weights: [300, 400, 700, 900],
  },
  {
    family: 'Lora',
    category: 'serif',
    source: 'google',
    weights: [400, 500, 600, 700],
  },
  {
    family: 'Libre Baskerville',
    category: 'serif',
    source: 'google',
    weights: [400, 700],
  },
  {
    family: 'PT Serif',
    category: 'serif',
    source: 'google',
    weights: [400, 700],
  },
  {
    family: 'Source Serif 4',
    category: 'serif',
    source: 'google',
    weights: [400, 600, 700],
  },
  { family: 'Anton', category: 'display', source: 'google', weights: [400] },
  {
    family: 'Bebas Neue',
    category: 'display',
    source: 'google',
    weights: [400],
  },
  { family: 'Bangers', category: 'display', source: 'google', weights: [400] },
  { family: 'Lobster', category: 'display', source: 'google', weights: [400] },
  { family: 'Pacifico', category: 'display', source: 'google', weights: [400] },
  {
    family: 'Permanent Marker',
    category: 'display',
    source: 'google',
    weights: [400],
  },
  {
    family: 'Archivo Black',
    category: 'display',
    source: 'google',
    weights: [400],
  },
  {
    family: 'Alfa Slab One',
    category: 'display',
    source: 'google',
    weights: [400],
  },
  {
    family: 'Roboto Mono',
    category: 'mono',
    source: 'google',
    weights: [400, 500, 600, 700],
  },
  {
    family: 'JetBrains Mono',
    category: 'mono',
    source: 'google',
    weights: [400, 500, 600, 700, 800],
  },
  {
    family: 'Source Code Pro',
    category: 'mono',
    source: 'google',
    weights: [400, 500, 600, 700],
  },
  {
    family: 'Space Mono',
    category: 'mono',
    source: 'google',
    weights: [400, 700],
  },
  {
    family: 'IBM Plex Mono',
    category: 'mono',
    source: 'google',
    weights: [400, 500, 600, 700],
  },
]

export type ParsedFontFace = {
  url: string
  unicodeRange?: string
  weight?: string
}

const loadedFaces = new Map<string, Promise<void>>()
const readyFaces = new Set<string>()
const failedFaces = new Set<string>()
const detectedFaces = new Map<string, FontDefinition>()

const FONT_FALLBACKS: Record<Exclude<FontCategory, 'system'>, string> = {
  sans: 'Arial, Helvetica, sans-serif',
  serif: 'Georgia, "Times New Roman", Times, serif',
  display: 'Impact, Arial, sans-serif',
  mono: '"Courier New", Courier, monospace',
}

const SYSTEM_FALLBACKS: Record<string, string> = {
  'Courier New': 'Courier, monospace',
  Georgia: 'Times, serif',
  'Times New Roman': 'Times, serif',
  Impact: 'Arial, sans-serif',
}

const fontCacheKey = (family: string, weight: number) => `${family}:${weight}`

const fallbackStack = (family: string) => {
  const font = fontByFamily(family)
  if (!font || font.category === 'system') {
    return SYSTEM_FALLBACKS[family] ?? 'sans-serif'
  }
  return FONT_FALLBACKS[font.category]
}

export const fontByFamily = (family: string) =>
  FONT_CATALOG.find((font) => font.family === family) ?? detectedFaces.get(family)

export const fontsInCategory = (category: FontCategory) =>
  [
    ...FONT_CATALOG.filter((font) => font.category === category),
    ...[...detectedFaces.values()].filter((font) => font.category === category),
  ]

export const detectedFonts = () => [...detectedFaces.values()]

export const registerDetectedFonts = (
  fonts: Array<{ family: string; weight: number }>,
) => {
  let changed = false
  for (const font of fonts) {
    if (!font.family) continue
    const resolved = resolveGoogleFontFamily(font.family)
    const family = resolved?.family ?? font.family
    const existing = fontByFamily(family)
    if (existing && FONT_CATALOG.some((item) => item.family === family)) {
      continue
    }
    const detectedWeight = resolved
      ? nearestWeight(resolved.weights, font.weight)
      : font.weight
    const weights = existing
      ? [...new Set([...existing.weights, detectedWeight])].sort((a, b) => a - b)
      : resolved
        ? [...new Set([detectedWeight, ...resolved.weights])].sort((a, b) => a - b)
        : [detectedWeight]
    if (existing && existing.source === 'system') continue
    detectedFaces.set(family, {
      family,
      category: existing?.category ?? 'sans',
      source: 'google',
      weights,
    })
    changed = true
  }
  return changed
}

export const isMonospaceFont = (family: string) =>
  fontByFamily(family)?.category === 'mono' || family === 'Courier New'

export const nearestWeight = (weights: number[], weight: number) =>
  weights.reduce((closest, candidate) =>
    Math.abs(candidate - weight) < Math.abs(closest - weight)
      ? candidate
      : closest,
  )

export const canvasFont = (
  fontWeight: number,
  fontSize: number,
  fontFamily: string,
) =>
  `${fontWeight} ${fontSize}px "${fontFamily.replaceAll('"', '\\"')}", ${fallbackStack(fontFamily)}`

export const googleCssUrl = (family: string, weight: number) => {
  const familyParam = encodeURIComponent(family).replaceAll('%20', '+')
  return `https://fonts.googleapis.com/css2?family=${familyParam}:wght@${weight}&display=swap`
}

export const parseGoogleFontCss = (css: string): ParsedFontFace[] => {
  const faces: ParsedFontFace[] = []
  for (const match of css.matchAll(/@font-face\s*\{([^}]+)\}/g)) {
    const block = match[1]
    if (!block) continue
    const url = block.match(/url\((['"]?)([^)'"]+)\1\)/)?.[2]
    if (!url?.endsWith('.woff2')) continue
    faces.push({
      url,
      unicodeRange: block.match(/unicode-range:\s*([^;]+)/)?.[1]?.trim(),
      weight: block.match(/font-weight:\s*([^;]+)/)?.[1]?.trim(),
    })
  }
  return faces
}

export const latinFontFaces = (faces: ParsedFontFace[]) => {
  const latin = faces.filter((face) => {
    if (!face.unicodeRange) return true
    return /\bU\+0000\b|\bU\+0100\b/.test(face.unicodeRange)
  })
  return latin.length > 0 ? latin : faces
}

const loadGoogleFont = async (family: string, weight: number) => {
  const response = await fetch(googleCssUrl(family, weight))
  if (!response.ok) {
    throw new Error(`Could not fetch ${family} (${weight}) from Google Fonts.`)
  }
  const faces = latinFontFaces(parseGoogleFontCss(await response.text()))
  if (faces.length === 0) {
    throw new Error(`Google Fonts returned no files for ${family} (${weight}).`)
  }

  await Promise.all(
    faces.map(async (parsed) => {
      const face = new FontFace(family, `url(${parsed.url})`, {
        weight: String(weight),
        style: 'normal',
        display: 'block',
        unicodeRange: parsed.unicodeRange,
      })
      await face.load()
      document.fonts.add(face)
    }),
  )
  await document.fonts.load(canvasFont(weight, 16, family))
}

export const isFontReady = (family: string, weight: number) => {
  const font = fontByFamily(family)
  if (!font || font.source !== 'google') return true
  return readyFaces.has(
    fontCacheKey(font.family, nearestWeight(font.weights, weight)),
  )
}

export const isFontFailed = (family: string, weight: number) => {
  const font = fontByFamily(family)
  if (!font || font.source !== 'google') return false
  return failedFaces.has(
    fontCacheKey(font.family, nearestWeight(font.weights, weight)),
  )
}

export const isFontSettled = (family: string, weight: number) =>
  isFontReady(family, weight) || isFontFailed(family, weight)

type FontTypography = { fontFamily: string; fontWeight: number }

type FontLayer = {
  id: string
  typography: FontTypography
}

/**
 * While a Google font is still downloading, keep the previous face so
 * canvas/CSS do not paint a fallback and then jump when the file arrives.
 */
export const withSettledFonts = <T extends FontLayer>(
  layers: T[],
  previous: T[],
): T[] => {
  if (
    layers.every((layer) =>
      isFontSettled(layer.typography.fontFamily, layer.typography.fontWeight),
    )
  ) {
    return layers
  }

  const previousById = new Map(previous.map((layer) => [layer.id, layer]))
  return layers.map((layer) => {
    if (
      isFontSettled(layer.typography.fontFamily, layer.typography.fontWeight)
    ) {
      return layer
    }
    const prior = previousById.get(layer.id)
    if (
      !prior ||
      (prior.typography.fontFamily === layer.typography.fontFamily &&
        prior.typography.fontWeight === layer.typography.fontWeight)
    ) {
      return layer
    }
    return {
      ...layer,
      typography: {
        ...layer.typography,
        fontFamily: prior.typography.fontFamily,
        fontWeight: prior.typography.fontWeight,
      },
    }
  })
}

export const ensureFont = async (
  family: string,
  weight: number,
  retry = false,
) => {
  const resolved = resolveGoogleFontFamily(family)
  const font = fontByFamily(resolved?.family ?? family)
  if (!font || font.source !== 'google') return

  const resolvedWeight = nearestWeight(
    resolved?.weights ?? font.weights,
    weight,
  )
  const faceFamily = resolved?.family ?? font.family
  const key = fontCacheKey(faceFamily, resolvedWeight)
  if (!resolved) {
    failedFaces.add(key)
    return
  }
  if (retry) {
    loadedFaces.delete(key)
    failedFaces.delete(key)
  } else if (failedFaces.has(key)) {
    return
  }

  const pending = loadedFaces.get(key)
  if (pending) return pending

  const loading = loadGoogleFont(faceFamily, resolvedWeight)
    .then(() => {
      readyFaces.add(key)
      failedFaces.delete(key)
    })
    .catch(() => {
      failedFaces.add(key)
      loadedFaces.delete(key)
    })
  loadedFaces.set(key, loading)
  await loading
}

export const ensureFontsForLayers = (
  layers: Array<{ typography: { fontFamily: string; fontWeight: number } }>,
) =>
  Promise.all(
    layers.map((layer) =>
      ensureFont(layer.typography.fontFamily, layer.typography.fontWeight),
    ),
  )
