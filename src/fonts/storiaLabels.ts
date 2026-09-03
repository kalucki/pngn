import { resolveGoogleFontFamily, stemFromClassName } from './googleFontFamily'

export type StoriaFontLabel = {
  index: number
  className: string
  family: string
  weight: number
  italic: boolean
}

export type FontCandidate = {
  family: string
  weight: number
  italic: boolean
  score: number
  className?: string
}

export const classNameWeight = (className: string) => {
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

const splitCamelFamily = (value: string) =>
  value
    .replace(/([a-z])([A-Z0-9])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    .replace(/([0-9])([A-Za-z])/g, '$1 $2')
    .replace(/([A-Za-z])([0-9])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()

export const classNameFamily = (className: string) =>
  resolveGoogleFontFamily(className)?.family ??
  splitCamelFamily(stemFromClassName(className))

export const labelToCandidate = (
  label: StoriaFontLabel,
  score: number,
): FontCandidate => {
  const resolved =
    resolveGoogleFontFamily(label.className) ??
    resolveGoogleFontFamily(label.family)
  const weight = label.weight || classNameWeight(label.className)
  return {
    family: resolved?.family || label.family || classNameFamily(label.className),
    weight:
      resolved && resolved.weights.length > 0
        ? resolved.weights.reduce((closest, candidate) =>
            Math.abs(candidate - weight) < Math.abs(closest - weight)
              ? candidate
              : closest,
          )
        : weight,
    italic: label.italic || /italic/i.test(label.className),
    score,
    className: label.className,
  }
}

export const collapseCandidates = (candidates: FontCandidate[]) => {
  const byKey = new Map<string, FontCandidate>()
  for (const candidate of candidates) {
    const key = `${candidate.family}:${candidate.weight}:${candidate.italic}`
    const existing = byKey.get(key)
    if (!existing || candidate.score > existing.score) {
      byKey.set(key, candidate)
    }
  }
  return [...byKey.values()].sort((left, right) => right.score - left.score)
}

