import { useEffect } from 'react'
import { trackPageView } from './analytics'
import { App } from './App'
import { useLocale } from './i18n/useLocale'
import { NavBar } from './layout/NavBar'
import { EXPORT_PATH, FAQ_PATH, HOW_IT_WORKS_PATH, usePath } from './navigation'
import { ExportPage } from './pages/Export'
import { Faq } from './pages/Faq'
import { HowItWorks } from './pages/HowItWorks'
import { applyDocumentSeo } from './seo/document'

export const Root = () => {
  const path = usePath()
  const { t } = useLocale()
  const onHowItWorks = path === HOW_IT_WORKS_PATH
  const onFaq = path === FAQ_PATH
  const onExport = path === EXPORT_PATH
  const onDocs = onHowItWorks || onFaq

  useEffect(() => {
    const page = onExport
      ? 'export'
      : onFaq
        ? 'faq'
        : onHowItWorks
          ? 'howItWorks'
          : 'home'
    applyDocumentSeo(page, t)
    trackPageView(path)
  }, [onExport, onFaq, onHowItWorks, path, t])

  return (
    <>
      <NavBar />
      {onExport ? (
        <ExportPage />
      ) : (
        <>
          <div className="app-root" hidden={onDocs} inert={onDocs}>
            <App />
          </div>
          {onHowItWorks ? <HowItWorks /> : null}
          {onFaq ? <Faq /> : null}
        </>
      )}
    </>
  )
}
