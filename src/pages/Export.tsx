import { downloadFromUrl } from '../editor/exportImage'
import { readPendingExport } from '../editor/exportTransfer'
import { useLocale } from '../i18n/useLocale'
import { CheckIcon, DownloadIcon } from '../layout/icons'
import { Link } from '../layout/Link'

export const ExportPage = () => {
  const pending = readPendingExport()
  const { t } = useLocale()

  if (!pending) {
    return (
      <main className="export-page">
        <section className="export-card export-card-error" aria-live="assertive">
          <h1>{t('export.couldNot')}</h1>
          <p>{t('export.noPending')}</p>
          <Link to="/" className="button-with-icon export-home-link">
            {t('export.back')}
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="export-page">
      <section className="export-card export-card-success" aria-live="polite">
        <span className="export-check" aria-hidden="true">
          <CheckIcon />
        </span>
        <h1>{t('export.downloadStarted')}</h1>
        <p>{t('export.saving', { filename: pending.filename })}</p>
        <img
          className="export-preview"
          src={pending.url}
          alt={t('export.previewAlt')}
        />
        <div className="export-actions">
          <button
            type="button"
            className="button-with-icon"
            onClick={() => downloadFromUrl(pending.url, pending.filename)}
          >
            <DownloadIcon />
            {t('export.downloadAgain')}
          </button>
          <Link to="/" className="secondary-button export-home-link">
            {t('export.back')}
          </Link>
        </div>
      </section>
    </main>
  )
}
