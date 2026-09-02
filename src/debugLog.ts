const LAST_KEY = 'txtimg.debug.last'

export type DebugPayload = Record<string, unknown>

const persist = (scope: string, message: string, data?: DebugPayload) => {
  try {
    sessionStorage.setItem(
      LAST_KEY,
      JSON.stringify({
        t: new Date().toISOString(),
        scope,
        message,
        data: data ?? null,
      }),
    )
  } catch {
    // Workers and locked-down storage cannot persist breadcrumbs.
  }
}

export const debugLog = (scope: string, message: string, data?: DebugPayload) => {
  if (data) console.info(`[txtimg:${scope}] ${message}`, data)
  else console.info(`[txtimg:${scope}] ${message}`)
  persist(scope, message, data)
}

export const debugBoot = () => {
  const nav = performance.getEntriesByType(
    'navigation',
  )[0] as PerformanceNavigationTiming | undefined
  let last: unknown = null
  try {
    const raw = sessionStorage.getItem(LAST_KEY)
    last = raw ? (JSON.parse(raw) as unknown) : null
  } catch {
    last = null
  }
  console.info('[txtimg:lifecycle] boot', {
    navType: nav?.type ?? 'unknown',
    lastEvent: last,
  })
}
