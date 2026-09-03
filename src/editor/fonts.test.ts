import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  canvasFont,
  ensureFont,
  FONT_CATALOG,
  detectedFonts,
  googleCssUrl,
  isFontFailed,
  isMonospaceFont,
  latinFontFaces,
  nearestWeight,
  parseGoogleFontCss,
  registerDetectedFonts,
  withSettledFonts,
} from './fonts'

describe('font catalog', () => {
  it('uses unique family names', () => {
    const families = FONT_CATALOG.map((font) => font.family)
    expect(new Set(families).size).toBe(families.length)
  })

  it('treats mono catalog entries and Courier New as monospace', () => {
    expect(isMonospaceFont('JetBrains Mono')).toBe(true)
    expect(isMonospaceFont('Courier New')).toBe(true)
    expect(isMonospaceFont('Inter')).toBe(false)
  })

  it('registers detected Google Fonts outside the starter catalog', () => {
    registerDetectedFonts([
      { family: 'Abril Fatface', weight: 400 },
      { family: 'New Candidate Font', weight: 700 },
      { family: 'Shippori Mincho B 1', weight: 800 },
    ])
    expect(detectedFonts().some((font) => font.family === 'Inter')).toBe(false)
    expect(
      detectedFonts().find((font) => font.family === 'New Candidate Font'),
    ).toMatchObject({
      category: 'sans',
      source: 'google',
      weights: [700],
    })
    expect(
      detectedFonts().find((font) => font.family === 'Shippori Mincho B1'),
    ).toMatchObject({
      family: 'Shippori Mincho B1',
      source: 'google',
    })
    expect(
      detectedFonts().some((font) => font.family === 'Shippori Mincho B 1'),
    ).toBe(false)
  })
})

describe('font helpers', () => {
  it('quotes family names for canvas', () => {
    expect(canvasFont(700, 32, 'Open Sans')).toBe(
      '700 32px "Open Sans", Arial, Helvetica, sans-serif',
    )
    expect(canvasFont(400, 16, 'Arial')).toBe('400 16px "Arial", sans-serif')
    expect(canvasFont(700, 24, 'Playfair Display')).toBe(
      '700 24px "Playfair Display", Georgia, "Times New Roman", Times, serif',
    )
  })

  it('picks the closest available weight', () => {
    expect(nearestWeight([400], 700)).toBe(400)
    expect(nearestWeight([400, 700, 900], 800)).toBe(700)
    expect(nearestWeight([400, 700, 900], 850)).toBe(900)
  })

  it('builds a css2 URL with plus-encoded family names', () => {
    expect(googleCssUrl('Open Sans', 700)).toBe(
      'https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap',
    )
    expect(googleCssUrl('Shippori Mincho B1', 800)).toBe(
      'https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@800&display=swap',
    )
  })

  it('keeps the previous face while a Google font is still loading', () => {
    const previous = [
      {
        id: 'layer',
        typography: { fontFamily: 'Arial', fontWeight: 700, fontSize: 24 },
      },
    ]
    const next = [
      {
        id: 'layer',
        typography: { fontFamily: 'Merriweather', fontWeight: 700, fontSize: 24 },
      },
    ]
    expect(withSettledFonts(next, previous)).toEqual([
      {
        id: 'layer',
        typography: { fontFamily: 'Arial', fontWeight: 700, fontSize: 24 },
      },
    ])
  })

  it('uses the requested face once it has settled as a system font', () => {
    const next = [
      {
        id: 'layer',
        typography: { fontFamily: 'Georgia', fontWeight: 700 },
      },
    ]
    expect(withSettledFonts(next, [])).toBe(next)
  })
})

describe('ensureFont failures', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('does not throw when Google Fonts is unavailable', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(new Response('unavailable', { status: 503 }))),
    )
    await expect(ensureFont('Inter', 700, true)).resolves.toBeUndefined()
    expect(isFontFailed('Inter', 700)).toBe(true)
  })

  it('does not fetch families that are not hosted on Google Fonts', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    registerDetectedFonts([{ family: 'New Candidate Font', weight: 700 }])
    await expect(ensureFont('New Candidate Font', 700, true)).resolves.toBeUndefined()
    expect(fetchMock).not.toHaveBeenCalled()
    expect(isFontFailed('New Candidate Font', 700)).toBe(true)
  })
})

describe('parseGoogleFontCss', () => {
  it('extracts woff2 urls and unicode ranges', () => {
    const css = `
/* latin-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  src: url(https://fonts.gstatic.com/s/inter/latin-ext.woff2) format('woff2');
  unicode-range: U+0100-02BA, U+2020;
}
/* latin */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  src: url(https://fonts.gstatic.com/s/inter/latin.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131;
}
`

    expect(parseGoogleFontCss(css)).toEqual([
      {
        url: 'https://fonts.gstatic.com/s/inter/latin-ext.woff2',
        unicodeRange: 'U+0100-02BA, U+2020',
        weight: '400',
      },
      {
        url: 'https://fonts.gstatic.com/s/inter/latin.woff2',
        unicodeRange: 'U+0000-00FF, U+0131',
        weight: '400',
      },
    ])
  })

  it('keeps latin and latin-ext faces only', () => {
    expect(
      latinFontFaces([
        {
          url: 'https://example/cyrillic.woff2',
          unicodeRange: 'U+0301, U+0400-045F',
        },
        {
          url: 'https://example/latin-ext.woff2',
          unicodeRange: 'U+0100-02BA',
        },
        {
          url: 'https://example/latin.woff2',
          unicodeRange: 'U+0000-00FF',
        },
      ]).map((face) => face.url),
    ).toEqual([
      'https://example/latin-ext.woff2',
      'https://example/latin.woff2',
    ])
  })
})
