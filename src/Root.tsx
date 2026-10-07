import { useEffect } from 'react'
import { trackPageView } from './analytics'
import { App } from './App'
import { useLocale } from './i18n/useLocale'
import { Footer } from './layout/Footer'
import { NavBar } from './layout/NavBar'
import {
  BATCH_PATH,
  EDITOR_PATH,
  EXPORT_PATH,
  FAQ_PATH,
  HOW_IT_WORKS_PATH,
  usePath,
} from './navigation'
import { Batch } from './pages/Batch'
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
  const onBatch = path === BATCH_PATH
  const onEditor = path === EDITOR_PATH
  const onDocs = onHowItWorks || onFaq

  useEffect(() => {
    const page = onExport
      ? 'export'
      : onEditor
        ? 'editor'
        : onBatch
          ? 'home'
          : onFaq
            ? 'faq'
            : onHowItWorks
              ? 'howItWorks'
              : 'home'
    applyDocumentSeo(page, t)
    trackPageView(path)
  }, [onBatch, onEditor, onExport, onFaq, onHowItWorks, path, t])

  return (
    <>
      <NavBar />
      {onExport ? (
        <ExportPage />
      ) : onBatch ? (
        <Batch />
      ) : (
        <>
          <div className="app-root" hidden={onDocs} inert={onDocs}>
            <App />
          </div>
          {onHowItWorks ? <HowItWorks /> : null}
          {onFaq ? <Faq /> : null}
        </>
      )}
      <Footer />
    </>
  )
}
