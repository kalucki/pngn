const trimOrigin = (value: string) => value.replace(/\/+$/, '')

export const getSiteOrigin = () => {
  const fromEnv = import.meta.env.VITE_SITE_ORIGIN
  if (typeof fromEnv === 'string' && fromEnv.length > 0) {
    return trimOrigin(fromEnv)
  }
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return ''
}

export const absoluteUrl = (path: string, origin = getSiteOrigin()) => {
  if (!origin) return path
  if (path === '/') return `${origin}/`
  return `${origin}${path}`
}
