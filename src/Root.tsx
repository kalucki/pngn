import { useEffect } from 'react'
import { App } from './App'
import { useLocale } from './i18n/useLocale'
import { NavBar } from './layout/NavBar'
import { EXPORT_PATH, HOW_IT_WORKS_PATH, usePath } from './navigation'
import { ExportPage } from './pages/Export'
import { HowItWorks } from './pages/HowItWorks'

export const Root = () => {
  const path = usePath()
  const { t } = useLocale()
  const onHowItWorks = path === HOW_IT_WORKS_PATH
  const onExport = path === EXPORT_PATH

  useEffect(() => {
    document.title = onExport
      ? t('title.export')
      : onHowItWorks
        ? t('title.howItWorks')
        : t('title.home')
  }, [onExport, onHowItWorks, t])

  return (
    <>
      <NavBar />
      {onExport ? (
        <ExportPage />
      ) : (
        <>
          <div
            className="app-root"
            hidden={onHowItWorks}
            inert={onHowItWorks}
          >
            <App />
          </div>
          {onHowItWorks ? <HowItWorks /> : null}
        </>
      )}
    </>
  )
}
