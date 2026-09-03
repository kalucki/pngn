import { writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

export const STYLE_SUFFIX =
  /-(Thin|ExtraLight|UltraLight|Light|Regular|Medium|SemiBold|DemiBold|Bold|ExtraBold|Black|Heavy|Book|Italic|Oblique|ThinItalic|ExtraLightItalic|LightItalic|MediumItalic|SemiBoldItalic|DemiBoldItalic|BoldItalic|ExtraBoldItalic|BlackItalic)$/i

export const TRAILING_STYLE =
  /(ThinItalic|ExtraLightItalic|LightItalic|MediumItalic|SemiBoldItalic|DemiBoldItalic|BoldItalic|ExtraBoldItalic|BlackItalic|ExtraLight|UltraLight|SemiBold|DemiBold|ExtraBold|Regular|Medium|Italic|Oblique|Heavy|Black|Light|Bold|Book|Thin)$/i

export const compactName = (value) => value.replace(/[\s_-]+/g, '')

export const stemFromClassName = (className) =>
  className.replace(/\[[^\]]+\]/g, '').replace(STYLE_SUFFIX, '').replace(TRAILING_STYLE, '')

const CLASS_STEM_ALIASES = {
  IMFeDPsc28P: 'IM Fell DW Pica SC',
  IMFeENit28P: 'IM Fell English',
  IMFeENrm28P: 'IM Fell English',
  IMFeENsc28P: 'IM Fell English SC',
  IMFeFCit28P: 'IM Fell French Canon',
  IMFeFCrm28P: 'IM Fell French Canon',
  IMFeFCsc28P: 'IM Fell French Canon SC',
  IMFeGPit28P: 'IM Fell Great Primer',
  IMFeGPrm28P: 'IM Fell Great Primer',
  IMFeGPsc28P: 'IM Fell Great Primer SC',
  IMFePIit28P: 'IM Fell DW Pica',
  IMFePIrm28P: 'IM Fell DW Pica',
  IMFePIsc28P: 'IM Fell DW Pica SC',
  IMFELLDoublePica: 'IM Fell Double Pica',
  RoundedMplus1c: 'M PLUS Rounded 1c',
  OldStandard: 'Old Standard TT',
  SairaStencilOne: 'Saira Stencil One',
  MontserratSubrayada: 'Montserrat Subrayada',
  NotoSerifNyiakengPuachueHmong: 'Noto Serif NP Hmong',
  BigShouldersDisplay: 'Big Shoulders',
  BigShouldersText: 'Big Shoulders',
  BigShouldersInlineDisplay: 'Big Shoulders Inline',
  BigShouldersInlineText: 'Big Shoulders Inline',
  BigShouldersStencilDisplay: 'Big Shoulders Stencil',
  BigShouldersStencilText: 'Big Shoulders Stencil',
  'PT_Sans-Caption-Web': 'PT Sans Caption',
  'PT_Sans-Narrow-Web': 'PT Sans Narrow',
  'PT_Sans-Web': 'PT Sans',
  'PT_Serif-Caption-Web': 'PT Serif Caption',
  'PT_Serif-Web': 'PT Serif',
  PTM55FT: 'PT Mono',
  SignikaNegativeSC: 'Signika Negative',
  SignikaSC: 'Signika',
  SansitaOne: 'Sansita',
  GFSNeohellenic: 'GFS Neohellenic',
  AdobeBlank: 'Adobe Blank',
}

const PREFIX_FAMILIES = [
  ['Inconsolata', 'Inconsolata'],
  ['GFSNeohellenic', 'GFS Neohellenic'],
]

const STANDARD_WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900]

const weightsFor = (font) => {
  const axis = font.axes?.find((item) => item.tag === 'wght')
  if (axis) {
    return STANDARD_WEIGHTS.filter(
      (weight) => weight >= axis.min && weight <= axis.max,
    )
  }
  return [
    ...new Set(
      Object.keys(font.fonts ?? {})
        .map((key) => Number.parseInt(key, 10))
        .filter((weight) => Number.isFinite(weight)),
    ),
  ].sort((left, right) => left - right)
}

export const fetchGoogleFontMetadata = async () => {
  const response = await fetch('https://fonts.google.com/metadata/fonts', {
    headers: { 'User-Agent': 'Mozilla/5.0 pngn-font-catalog' },
  })
  if (!response.ok) {
    throw new Error(`Google Fonts metadata HTTP ${response.status}`)
  }
  const raw = (await response.text()).replace(/^\)\]\}'\n?/, '')
  return JSON.parse(raw).familyMetadataList
}

export const buildGoogleFontLookup = (familyMetadataList) => {
  const byFamily = new Map()
  const byCompact = new Map()
  for (const font of familyMetadataList) {
    const weights = weightsFor(font)
    const entry = { family: font.family, weights }
    byFamily.set(font.family, entry)
    byCompact.set(compactName(font.family), entry)
  }

  const addAlias = (key, family) => {
    const entry = byFamily.get(family)
    if (!entry) return false
    byCompact.set(compactName(key), entry)
    return true
  }

  for (const [stem, family] of Object.entries(CLASS_STEM_ALIASES)) {
    addAlias(stem, family)
  }

  return { byFamily, byCompact, addAlias }
}

export const resolveGoogleFontLookup = (name, lookup) => {
  if (!name) return null
  const compact = compactName(name)
  const stem = stemFromClassName(name)
  const stemCompact = compactName(stem)
  const direct =
    lookup.byFamily.get(name) ??
    lookup.byCompact.get(compact) ??
    lookup.byCompact.get(stemCompact)
  if (direct) return direct
  for (const [prefix, family] of PREFIX_FAMILIES) {
    if (stem.startsWith(prefix) || compact.startsWith(prefix)) {
      return lookup.byFamily.get(family) ?? null
    }
  }
  return null
}

export const catalogPath = join(root, 'src/fonts/googleFontFamilies.json')

export const writeGoogleFontCatalog = async (lookup) => {
  const families = {}
  for (const [compact, entry] of lookup.byCompact) {
    families[compact] = [entry.family, entry.weights]
  }
  await writeFile(catalogPath, `${JSON.stringify(families)}\n`)
  return Object.keys(families).length
}
