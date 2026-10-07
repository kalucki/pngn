import { useEffect, useState } from 'react'
import { BATCH_PATH, EDITOR_PATH, EXPORT_PATH, FAQ_PATH, HOW_IT_WORKS_PATH } from './paths'

export { BATCH_PATH, EDITOR_PATH, EXPORT_PATH, FAQ_PATH, HOW_IT_WORKS_PATH }

export const normalizePath = (path: string) => path.replace(/\/+$/, '') || '/'

const getPath = () => normalizePath(window.location.pathname)

export const navigate = (to: string, options?: { replace?: boolean }) => {
  if (normalizePath(to) === getPath()) return
  const update = options?.replace ? window.history.replaceState : window.history.pushState
  update.call(window.history, {}, '', to)
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
