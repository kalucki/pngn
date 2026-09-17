import type { TextLayer } from '../document/types'
import { fontByFamily, isFontFailed, nearestWeight } from '../editor/fonts'
import { DEFAULT_OCR_FONT } from './rerankFont'

export type FontChoice = {
  family: string
  weight: number
  italic: boolean
}

const arialFallback = (weight: number): FontChoice => {
  const font = fontByFamily(DEFAULT_OCR_FONT)
  return {
    family: DEFAULT_OCR_FONT,
    weight: font ? nearestWeight(font.weights, weight) : 700,
    italic: false,
  }
}

export const fontMatchChoices = (
  layer: Pick<TextLayer, 'fontMatch'>,
): FontChoice[] => {
  const match = layer.fontMatch
  if (!match || match.status !== 'ready') return []
  const choices: FontChoice[] = [
    {
      family: match.family,
      weight: match.weight,
      italic: match.italic,
    },
    ...match.similar.map((candidate) => ({
      family: candidate.family,
      weight: candidate.weight,
      italic: Boolean(candidate.italic),
    })),
  ]
  const seen = new Set<string>()
  return choices.filter((choice) => {
    if (!choice.family) return false
    const key = `${choice.family}:${choice.weight}:${choice.italic}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

const normalizeChoice = (choice: FontChoice): FontChoice => {
  const font = fontByFamily(choice.family)
  return {
    family: choice.family,
    weight: font ? nearestWeight(font.weights, choice.weight) : choice.weight,
    italic: choice.italic,
  }
}

export const fallbackFontChoice = (
  layer: Pick<TextLayer, 'fontMatch'>,
  failedFamily: string,
  failedWeight: number,
  failedItalic = false,
): FontChoice => {
  for (const choice of fontMatchChoices(layer)) {
    const next = normalizeChoice(choice)
    if (
      next.family === failedFamily &&
      next.weight === failedWeight &&
      next.italic === failedItalic
    ) {
      continue
    }
    if (isFontFailed(next.family, next.weight, next.italic)) continue
    return next
  }
  return arialFallback(failedWeight)
}
