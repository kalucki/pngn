import catalog from './googleFontFamilies.json'

export type GoogleFontRecord = {
  family: string
  weights: number[]
}

const STYLE_SUFFIX =
  /-(Thin|ExtraLight|UltraLight|Light|Regular|Medium|SemiBold|DemiBold|Bold|ExtraBold|Black|Heavy|Book|Italic|Oblique|ThinItalic|ExtraLightItalic|LightItalic|MediumItalic|SemiBoldItalic|DemiBoldItalic|BoldItalic|ExtraBoldItalic|BlackItalic)$/i

const TRAILING_STYLE =
  /(ThinItalic|ExtraLightItalic|LightItalic|MediumItalic|SemiBoldItalic|DemiBoldItalic|BoldItalic|ExtraBoldItalic|BlackItalic|ExtraLight|UltraLight|SemiBold|DemiBold|ExtraBold|Regular|Medium|Italic|Oblique|Heavy|Black|Light|Bold|Book|Thin)$/i

const PREFIX_FAMILIES: Array<[string, string]> = [
  ['Inconsolata', 'Inconsolata'],
  ['GFSNeohellenic', 'GFS Neohellenic'],
]

type CatalogEntry = [string, number[]]

const entries = catalog as unknown as Record<string, CatalogEntry>
const byCompact = new Map<string, GoogleFontRecord>()
const byFamily = new Map<string, GoogleFontRecord>()

for (const [compact, [family, weights]] of Object.entries(entries)) {
  const record = { family, weights }
  byCompact.set(compact, record)
  byFamily.set(family, record)
}

export const compactFontName = (value: string) => value.replace(/[\s_-]+/g, '')

export const stemFromClassName = (className: string) =>
  className.replace(/\[[^\]]+\]/g, '').replace(STYLE_SUFFIX, '').replace(TRAILING_STYLE, '')

export const resolveGoogleFontFamily = (
  name: string,
): GoogleFontRecord | null => {
  if (!name) return null
  const compact = compactFontName(name)
  const stem = compactFontName(stemFromClassName(name))
  const match = byFamily.get(name) ?? byCompact.get(compact) ?? byCompact.get(stem)
  if (match) return match
  for (const [prefix, family] of PREFIX_FAMILIES) {
    if (stem.startsWith(prefix) || compact.startsWith(prefix)) {
      return byFamily.get(family) ?? null
    }
  }
  return null
}
