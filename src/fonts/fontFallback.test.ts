import { afterEach, describe, expect, it, vi } from 'vitest'
import { ensureFont, registerDetectedFonts } from '../editor/fonts'
import { fallbackFontChoice, fontMatchChoices } from './fontFallback'

const layer = (
  family: string,
  similar: Array<{ family: string; weight: number; italic?: boolean }> = [],
) => ({
  fontMatch: {
    family,
    weight: 700,
    italic: false,
    score: 0.4,
    status: 'ready' as const,
    similar,
  },
})

describe('fontMatchChoices', () => {
  it('is empty when matching never produced a ranking', () => {
    expect(fontMatchChoices({})).toEqual([])
    expect(
      fontMatchChoices({
        fontMatch: {
          family: 'Arial',
          weight: 700,
          italic: false,
          score: 0,
          status: 'error',
          similar: [{ family: 'Roboto', weight: 700 }],
        },
      }),
    ).toEqual([])
  })

  it('walks the winner then similar faces in rank order', () => {
    expect(
      fontMatchChoices(
        layer('Roboto', [
          { family: 'Inter', weight: 700 },
          { family: 'Open Sans', weight: 600, italic: true },
        ]),
      ),
    ).toEqual([
      { family: 'Roboto', weight: 700, italic: false },
      { family: 'Inter', weight: 700, italic: false },
      { family: 'Open Sans', weight: 600, italic: true },
    ])
  })
})

describe('fallbackFontChoice', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('uses the next ranked suggestion when the winner cannot load', () => {
    expect(
      fallbackFontChoice(
        layer('Roboto', [
          { family: 'Inter', weight: 500 },
          { family: 'Georgia', weight: 700 },
        ]),
        'Roboto',
        700,
      ),
    ).toEqual({ family: 'Inter', weight: 500, italic: false })
  })

  it('skips suggestions that already failed and keeps rank order', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(new Response('unavailable', { status: 503 }))),
    )
    registerDetectedFonts([{ family: 'Alef', weight: 700 }])
    await ensureFont('Alef', 700, { retry: true })
    expect(
      fallbackFontChoice(
        layer('Roboto', [
          { family: 'Alef', weight: 700 },
          { family: 'Georgia', weight: 400 },
        ]),
        'Roboto',
        700,
      ),
    ).toEqual({ family: 'Georgia', weight: 400, italic: false })
  })

  it('falls back to Arial when the classifier has no usable ranking', () => {
    expect(fallbackFontChoice({}, 'Roboto', 700)).toEqual({
      family: 'Arial',
      weight: 700,
      italic: false,
    })
  })

  it('falls back to Arial when every suggestion failed', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(new Response('unavailable', { status: 503 }))),
    )
    registerDetectedFonts([
      { family: 'Alef', weight: 700 },
      { family: 'Aboreto', weight: 400 },
    ])
    await ensureFont('Alef', 700, { retry: true })
    await ensureFont('Aboreto', 400, { retry: true })
    expect(
      fallbackFontChoice(
        layer('Alef', [{ family: 'Aboreto', weight: 400 }]),
        'Alef',
        700,
      ),
    ).toEqual({ family: 'Arial', weight: 700, italic: false })
  })
})
