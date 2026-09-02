import { useEffect, useState } from 'react'
import { EXPORT_PATH, FAQ_PATH, HOW_IT_WORKS_PATH } from './paths'

export { EXPORT_PATH, FAQ_PATH, HOW_IT_WORKS_PATH }

export const normalizePath = (path: string) => path.replace(/\/+$/, '') || '/'

const getPath = () => normalizePath(window.location.pathname)

export const navigate = (to: string) => {
  if (normalizePath(to) === getPath()) return
  window.history.pushState({}, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export const usePath = () => {
  const [path, setPath] = useState(getPath)
  useEffect(() => {
    const onPop = () => setPath(getPath())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
  return path
}
